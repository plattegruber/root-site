import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interpretPsi, type PsiPayload } from '../src/providers/performance.js';
import {
	matchPlace,
	analyzeGoogle,
	createPlacesProvider,
	type Place
} from '../src/providers/google.js';
import { practiceFromPages } from '../src/audit/practice.js';
import { parsePage } from '../src/audit/pages.js';
import { fixture, response, fixtureFetcher } from './helpers.js';
const home = parsePage(response('https://maple-grove.example/', fixture('home.html')));
const practice = practiceFromPages([home], home.url);
const place = JSON.parse(fixture('google.json')) as Place;
test('separates Lighthouse lab and CrUX origin field data and converts CLS provider scaling', () => {
	const m = interpretPsi(JSON.parse(fixture('psi.json')) as PsiPayload, home.url, 'mobile');
	assert.equal(m.lab?.metrics['largest-contentful-paint'], 4800);
	assert.equal(m.field?.scope, 'origin');
	assert.equal(m.field?.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile, 0.08);
	assert.equal(m.field?.metrics.INTERACTION_TO_NEXT_PAINT?.percentile, 220);
	assert.ok(m.field?.explanation.includes('not specific'));
	assert.ok(m.limitation.includes('not INP'));
});
test('URL field data takes precedence; absent field data stays unavailable', () => {
	const p = JSON.parse(fixture('psi.json')) as PsiPayload;
	p.loadingExperience = {
		metrics: { LARGEST_CONTENTFUL_PAINT_MS: { percentile: 2000, category: 'FAST' } }
	};
	assert.equal(interpretPsi(p, home.url, 'mobile').field?.scope, 'url');
	delete p.loadingExperience;
	delete p.originLoadingExperience;
	assert.equal(interpretPsi(p, home.url, 'mobile').field?.scope, 'unavailable');
});
test('a Google match needs a unique website, street/locality and phone agreement', () => {
	assert.equal(matchPlace(practice, [place]).match, 'matched');
	assert.equal(
		matchPlace(practice, [{ ...place, formattedAddress: '999 Elsewhere, Other City' }]).match,
		'candidate'
	);
	assert.equal(
		matchPlace(practice, [
			{ ...place, nationalPhoneNumber: '5551111111', internationalPhoneNumber: '5551111111' }
		]).match,
		'candidate'
	);
	assert.equal(matchPlace(practice, [place, place]).match, 'ambiguous');
	assert.equal(matchPlace({ ...practice, resolution: 'ambiguous' }, [place]).match, 'ambiguous');
	assert.equal(
		matchPlace(practice, [place], 'https://www.google.com/maps/search/?query_place_id=DIFFERENT')
			.match,
		'ambiguous'
	);
});
test('Places public types are not asserted to be GBP categories or owner replies', async () => {
	const { google } = await analyzeGoogle(
		practice,
		[home],
		undefined,
		fixtureFetcher(),
		AbortSignal.timeout(10_000),
		{
			async search() {
				return [place];
			}
		}
	);
	assert.equal(google.fields.find((f) => f.name === 'Primary place type')?.value, 'dentist');
	for (const name of [
		'GBP primary/additional categories',
		'Appointment links',
		'Owner responses',
		'Private performance metrics'
	])
		assert.equal(google.fields.find((f) => f.name === name)?.availability, 'owner_access_required');
	assert.ok(
		google.fields
			.find((f) => f.name === 'Public review sample')
			?.value?.includes('relevance-selected')
	);
});
test('Places request uses a fixed provider endpoint, limited field mask and no raw patient/context data', async () => {
	let urlSeen = '',
		bodySeen = '',
		mask = '';
	const provider = createPlacesProvider(async (url, options) => {
		urlSeen = url;
		bodySeen = options?.body ?? '';
		mask = options?.headers?.['X-Goog-FieldMask'] ?? '';
		return response(url, JSON.stringify({ places: [place] }), 200, {
			'content-type': 'application/json'
		});
	}, 'test-secret');
	await provider.search(practice, AbortSignal.timeout(5000));
	assert.equal(urlSeen, 'https://places.googleapis.com/v1/places:searchText');
	assert.ok(mask.includes('places.websiteUri'));
	assert.equal(JSON.parse(bodySeen).maxResultCount, 5);
	assert.equal(bodySeen.includes('test-secret'), false);
});
