import { evidence, finding, type Report, type Finding } from '../model.js';
import { mapsUrl } from '../security/url.js';
import { safeError, type SafeFetcher } from '../security/fetch.js';
import type { Page } from '../audit/pages.js';

export type Place = {
	id?: string;
	displayName?: { text?: string };
	formattedAddress?: string;
	websiteUri?: string;
	googleMapsUri?: string;
	nationalPhoneNumber?: string;
	internationalPhoneNumber?: string;
	primaryType?: string;
	types?: string[];
	regularOpeningHours?: { weekdayDescriptions?: string[] };
	businessStatus?: string;
	rating?: number;
	userRatingCount?: number;
	reviews?: {
		rating?: number;
		publishTime?: string;
		authorAttribution?: { displayName?: string; uri?: string };
	}[];
	photos?: { authorAttributions?: { displayName?: string; uri?: string }[] }[];
};
export type PlacesProvider = {
	search: (practice: Report['practice'], signal: AbortSignal) => Promise<Place[]>;
};
const fields = [
	'id',
	'displayName',
	'formattedAddress',
	'websiteUri',
	'googleMapsUri',
	'nationalPhoneNumber',
	'internationalPhoneNumber',
	'primaryType',
	'types',
	'regularOpeningHours',
	'businessStatus',
	'rating',
	'userRatingCount',
	'reviews',
	'photos'
];
export function createPlacesProvider(fetcher: SafeFetcher, key: string): PlacesProvider {
	return {
		async search(practice, signal) {
			const address = practice.facts.find((f) => f.key === 'address')?.value ?? '';
			const response = await fetcher('https://places.googleapis.com/v1/places:searchText', {
				method: 'POST',
				body: JSON.stringify({ textQuery: `${practice.name} ${address}`, maxResultCount: 5 }),
				headers: {
					'Content-Type': 'application/json',
					'X-Goog-Api-Key': key,
					'X-Goog-FieldMask': fields.map((f) => `places.${f}`).join(',')
				},
				signal,
				maxBytes: 1_000_000,
				timeoutMs: 15_000
			});
			if (response.status !== 200) throw new Error('places_api');
			const data = JSON.parse(response.body.toString()) as { places?: Place[] };
			return data.places ?? [];
		}
	};
}
const digits = (s: string) => s.replace(/\D/g, '');
const domain = (s: string) => {
	try {
		return new URL(s).hostname.toLowerCase().replace(/^www\./, '');
	} catch {
		return '';
	}
};
const normal = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export function matchPlace(
	practice: Report['practice'],
	places: Place[],
	providedMaps?: string
): { match: Report['google']['match']; place?: Place; explanation: string } {
	if (practice.resolution === 'ambiguous')
		return {
			match: 'ambiguous',
			explanation:
				'The website has multiple location signals. No listing is asserted to match until the exact office is confirmed.'
		};
	const address = practice.facts.find((f) => f.key === 'address')?.value;
	const phone = practice.facts.find((f) => f.key === 'phone')?.value;
	const matches = places.filter((p) => {
		const addressParts = address?.split(',').slice(0, 2) ?? [];
		const streetAndLocality =
			addressParts.length === 2 &&
			addressParts.every((part) => normal(p.formattedAddress ?? '').includes(normal(part)));
		const phoneMatch =
			phone &&
			[p.nationalPhoneNumber, p.internationalPhoneNumber].some(
				(v) => v && digits(v).slice(-10) === digits(phone).slice(-10)
			);
		return (
			normal(p.displayName?.text ?? '') === normal(practice.name) &&
			domain(p.websiteUri ?? '') === domain(practice.websiteUrl) &&
			streetAndLocality &&
			phoneMatch
		);
	});
	if (matches.length === 1) {
		const place = matches[0]!;
		const requestedId = providedMaps && new URL(providedMaps).searchParams.get('query_place_id');
		if (requestedId && requestedId !== place.id)
			return {
				match: 'ambiguous',
				explanation:
					'The supplied Maps place ID conflicts with the listing matching the website, street/locality and phone.'
			};
		return {
			match: 'matched',
			place,
			explanation:
				'One public Places result agrees with the website domain, visible street/locality, and phone. This cross-check is not owner authorization or proof of ownership; confirm the office before making changes.'
		};
	}
	return {
		match:
			matches.length > 1 || places.length > 1
				? 'ambiguous'
				: places.length
					? 'candidate'
					: 'unresolved',
		explanation: places.length
			? 'A unique match was not established using website domain, street/locality and phone. Candidate listing facts are withheld to avoid auditing a different office.'
			: 'No public Places candidate was returned; no conclusion about whether a GBP exists is made.'
	};
}

export async function analyzeGoogle(
	practice: Report['practice'],
	pages: Page[],
	providedMaps: string | undefined,
	fetcher: SafeFetcher,
	signal: AbortSignal,
	provider?: PlacesProvider
): Promise<{ google: Report['google']; findings: Finding[] }> {
	const google: Report['google'] = {
		source: 'website_public',
		match: 'unresolved',
		explanation:
			'Public website facts can be assessed without account connection. A website Maps link by itself does not establish the identity of a Google Business Profile.',
		fields: [],
		attributions: [],
		ownerAccessPath: [
			'Obtain owner consent and use a Google Cloud project approved for the Business Profile APIs; Places access does not authorize Business Profile management.',
			'Configure a Google OAuth consent screen and OAuth 2.0 authorization-code flow with business.manage. Select the owner-managed account and exact location ID, then verify it against the website.',
			'Add a read-only provider implementing this report contract: Business Information for location facts/categories/hours, supported Place Actions for appointment links, and supported reviews/media endpoints for reviews, owner replies and photos. Do not expose write actions in this audit.',
			'Use the Business Profile Performance API only with owner authorization and approved access. Report the supported metrics/date windows; unavailable metrics stay not tested. No private performance data is accessed in V0.',
			'Store tokens encrypted on the server with revocation, least privilege, retention/deletion controls and an OAuth 2.1 MCP authorization layer for the linked plugin account. This V0 intentionally has no token connection endpoint.'
		]
	};
	const out: Finding[] = [];
	let place: Place | undefined;
	const siteMaps = pages.flatMap((p) => p.links.filter((l) => l.kind === 'maps'))[0]?.url;
	let link = providedMaps ?? siteMaps;
	if (link) {
		try {
			link = mapsUrl(link).href;
			const r = await fetcher(link, { signal, maxBytes: 1_000_000, preserveQuery: true });
			google.mapsUrl = mapsUrl(r.url).href;
			out.push(
				finding(
					'google-link',
					'google',
					'Public Maps destination',
					r.status >= 400 ? 'failed' : 'needs_confirmation',
					{
						evidence: [
							evidence(
								r.url,
								`HTTP ${r.status}; public Maps page fetched. Interactive listing fields are not reliably exposed to a bounded anonymous HTML fetch.`,
								'Public Maps link request',
								r.fetchedAt
							)
						],
						impact: 'The directions/listing link should lead to the intended office.',
						fix: 'Confirm this Maps destination is the exact office, including address and phone. JavaScript, consent walls and blocked fields cannot be treated as missing listing content.',
						effort: '15–30 minutes: office identity verification',
						severity: 'info'
					}
				)
			);
		} catch (e) {
			out.push(
				finding('google-link', 'google', 'Public Maps destination', 'not_tested', {
					evidence: [evidence(link, safeError(e), 'Public Maps link request')],
					impact: 'The supplied listing could not be inspected automatically.',
					fix: 'Verify the share link and office manually; keep the public website assessment.',
					effort: '15–30 minutes: verify public link'
				})
			);
		}
	}
	if (provider) {
		try {
			const match = matchPlace(practice, await provider.search(practice, signal), providedMaps);
			google.source = 'places_api';
			google.match = match.match;
			google.explanation = match.explanation;
			place = match.place;
		} catch (e) {
			google.explanation = `The Places provider did not complete (${safeError(e)}). Website observations remain available; no GBP field is classified as missing.`;
		}
	}
	if (place) {
		if (place.googleMapsUri) google.mapsUrl = place.googleMapsUri;
		const url = google.mapsUrl ?? practice.websiteUrl;
		const at = new Date().toISOString();
		const field = (
			name: string,
			value: string | undefined,
			availability: 'observed' | 'not_exposed' | 'owner_access_required' = 'not_exposed'
		) =>
			google.fields.push({
				name,
				availability: value ? 'observed' : availability,
				value,
				evidence: value
					? [evidence(url, `${name}: ${value}`, 'Google Places API public result', at)]
					: []
			});
		field('Business name', place.displayName?.text);
		field('Address', place.formattedAddress);
		field('Phone', place.internationalPhoneNumber ?? place.nationalPhoneNumber);
		field('Public place types', place.types?.join(', '));
		field('Primary place type', place.primaryType);
		field('GBP primary/additional categories', undefined, 'owner_access_required');
		field('Regular hours', place.regularOpeningHours?.weekdayDescriptions?.join('; '));
		field('Business status', place.businessStatus);
		field('Website link', place.websiteUri);
		field('Appointment links', undefined, 'owner_access_required');
		field(
			'Photo metadata sample',
			place.photos
				? `${place.photos.length} photo metadata entries returned; not a complete library and images were not downloaded.`
				: undefined
		);
		field(
			'Aggregate reviews',
			place.rating === undefined
				? undefined
				: `Rating ${place.rating}; ${place.userRatingCount ?? 'unavailable'} total ratings reported by Google.`
		);
		field(
			'Public review sample',
			place.reviews
				? `${place.reviews.length} provider-selected reviews returned (up to 5, relevance-selected). No sentiment, completeness or response-rate inference is made; review text is not retained.`
				: undefined
		);
		field('Owner responses', undefined, 'owner_access_required');
		field('Private performance metrics', undefined, 'owner_access_required');
		google.attributions.push({ name: 'Google Maps', url });
		// No review text/photos are displayed. Preserve relevant source attribution only.
		const homepage = pages[0];
		if (place.websiteUri) {
			try {
				const r = await fetcher(place.websiteUri, { signal, maxBytes: 1_500_000 });
				const relevant = domain(r.url) === domain(practice.websiteUrl);
				out.push(
					finding(
						'google-landing',
						'google',
						'Listing website landing page',
						r.status >= 400 ? 'failed' : relevant ? 'passed' : 'needs_confirmation',
						{
							evidence: [
								evidence(
									r.url,
									`Places website link ${place.websiteUri} resolves to HTTP ${r.status}; expected domain agreement ${relevant}. Service/office relevance still needs a rendered review.`,
									'Public listing landing-page request',
									r.fetchedAt
								)
							],
							impact:
								'People arriving from Maps should immediately recognize the same office and find a useful contact route.',
							fix: 'Point the listing website to a fast, accurate office landing page and the appointment action to a useful booking destination for that office.',
							effort: '1–3 hours: routing, landing page and handoff checks'
						}
					)
				);
			} catch (e) {
				out.push(
					finding('google-landing', 'google', 'Listing website landing page', 'not_tested', {
						evidence: [evidence(place.websiteUri, safeError(e))],
						impact: 'The listing destination could not be checked.',
						fix: 'Verify landing-page availability manually.',
						effort: '30–60 minutes'
					})
				);
			}
		}
		const websiteHours = practice.facts.find((f) => f.key === 'hours_wording');
		out.push(
			finding(
				'google-consistency',
				'google',
				'Website/listing consistency',
				websiteHours && place.regularOpeningHours ? 'needs_confirmation' : 'not_tested',
				{
					evidence: [
						...practice.facts
							.filter((f) => ['practice_name', 'address', 'phone', 'hours_wording'].includes(f.key))
							.flatMap((f) => f.evidence),
						evidence(
							url,
							'Website, street/locality and phone matched; compare exact business name, every weekday, exceptions and appointment routing before declaring full consistency.',
							'Google Places cross-check',
							at
						)
					],
					impact: 'Conflicting office details can misdirect a visitor or cause a wasted trip.',
					fix: 'Review the visible website facts against the selected GBP, including special hours; update only after owner confirmation.',
					effort: '1–2 hours: fact reconciliation',
					section: 'contact'
				}
			)
		);
		if (
			homepage &&
			place.displayName?.text &&
			!homepage.text.toLowerCase().includes(place.displayName.text.toLowerCase())
		)
			out.push(
				finding('google-name', 'google', 'Public practice-name difference', 'needs_confirmation', {
					evidence: [
						evidence(
							url,
							`Public listing name: ${place.displayName.text}; website name: ${practice.name}.`
						)
					],
					impact: 'Name differences can confuse patients.',
					fix: 'Confirm the approved real-world business name before changing either source.',
					effort: '30–60 minutes: owner check',
					section: 'homepage'
				})
			);
	} else {
		for (const name of [
			'Business name',
			'Address',
			'Phone',
			'GBP primary/additional categories',
			'Regular hours',
			'Website link',
			'Appointment links',
			'Photos',
			'Reviews',
			'Owner responses',
			'Private performance metrics'
		])
			google.fields.push({
				name,
				availability:
					name === 'Private performance metrics' ? 'owner_access_required' : 'unresolved',
				evidence: []
			});
		const facts = practice.facts.filter((f) =>
			['practice_name', 'address', 'phone', 'hours_wording'].includes(f.key)
		);
		out.push(
			finding(
				'google-public',
				'google',
				'Public Google presence readiness',
				facts.length ? 'needs_confirmation' : 'not_tested',
				{
					evidence: facts.flatMap((f) => f.evidence),
					impact:
						'A consistent name, address, phone, hours and useful landing page let patients recognize the same office across the website and Maps.',
					fix: 'Use the observed website facts as a comparison checklist for the exact public listing. Public HTML does not reliably expose Google categories, owner replies or appointment links. Configure the optional Places API for a richer public comparison.',
					effort: '1–2 hours: public listing verification',
					section: 'contact',
					priority: facts.length ? 'improvement' : 'none'
				}
			)
		);
	}
	out.push(
		finding(
			'google-owner-access',
			'google',
			'Owner-authorized profile and performance checks',
			'not_tested',
			{
				impact:
					'An owner connection can expose supported profile details and performance windows beyond public sources.',
				fix: google.ownerAccessPath.join(' '),
				effort:
					'Separate integration: approved Google API project, OAuth review, account/location selection and security work',
				evidence: [],
				severity: 'info'
			}
		)
	);
	return { google, findings: out };
}
