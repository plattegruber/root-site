import { z } from 'zod';
import { reportSchema } from '../model.js';

/**
 * Evidence the server collects for the model to interpret. Every field is something
 * observed in a fetched response; nothing here is a verdict. Text is truncated, never
 * paraphrased, so the model can quote it.
 */
const link = z.object({ url: z.string(), label: z.string(), inHeader: z.boolean() });
export const pageEvidenceSchema = z.object({
	url: z.string(),
	status: z.number(),
	fetchedAt: z.string(),
	title: z.string(),
	metaDescription: z.string(),
	canonical: z.string(),
	lang: z.string(),
	hasViewportMeta: z.boolean(),
	headings: z.array(z.object({ level: z.number(), text: z.string() })),
	/** Visible text inside <header>/<nav>. Empty when identical to the first page in the batch. */
	headerText: z.string(),
	/** Visible text inside <footer>; hours and address often live here. Empty when identical to the first page in the batch. */
	footerText: z.string(),
	/** Visible text of the page's own content, excluding header, nav and footer. */
	mainText: z.string(),
	mainTextTruncated: z.boolean(),
	wordCount: z.number(),
	contact: z.object({
		phoneLinks: z.array(link),
		smsLinks: z.array(link),
		emailLinks: z.array(link),
		/** Phone-number-shaped strings in visible text, whether or not they are links. */
		phoneNumbersInText: z.array(z.string())
	}),
	bookingLinks: z.array(link.extend({ vendor: z.string().optional() })),
	mapsLinks: z.array(link),
	/** Links in the page's own content (menu and footer links are listed by map_site). */
	internalLinks: z.array(link),
	externalLinks: z.array(link),
	buttons: z.array(z.string()),
	forms: z.array(
		z.object({
			action: z.string(),
			method: z.string(),
			/** same-site, a third-party hostname, or mailto. */
			submitsTo: z.string(),
			insecureAction: z.boolean(),
			fields: z.array(
				z.object({ label: z.string(), name: z.string(), type: z.string(), placeholder: z.string() })
			)
		})
	),
	thirdParty: z.object({
		/** Advertising and retargeting scripts (the HHS tracking bulletin's main concern). */
		advertising: z.array(z.string()),
		/** Analytics and tag managers. A tag manager can load anything; its contents are not visible here. */
		analytics: z.array(z.string()),
		/** Tools that can record what visitors type and click. */
		sessionReplay: z.array(z.string()),
		/** Pixels configured in inline script, by vendor name. */
		inlineTags: z.array(z.string()),
		otherHosts: z.array(z.string())
	}),
	structuredData: z.object({
		nodes: z.array(
			z.object({
				types: z.array(z.string()),
				name: z.string().optional(),
				telephone: z.string().optional(),
				address: z.string().optional(),
				openingHours: z.string().optional(),
				url: z.string().optional(),
				hasAggregateRating: z.boolean()
			})
		),
		parseErrors: z.number()
	}),
	images: z.object({
		count: z.number(),
		missingAlt: z.number(),
		examples: z.array(z.object({ file: z.string(), alt: z.string().optional() }))
	}),
	iframeHosts: z.array(z.string()),
	insecureResources: z.array(z.string()),
	copyrightYears: z.array(z.number()),
	datesFound: z.array(z.string()),
	hsts: z.boolean()
});
export type PageEvidence = z.infer<typeof pageEvidenceSchema>;

const navLink = z.object({ url: z.string(), label: z.string() });
export const siteMapSchema = z.object({
	fixture: z.boolean(),
	websiteUrl: z.string(),
	/** Where the homepage ended up after redirects. */
	finalUrl: z.string(),
	collectedAt: z.string(),
	robots: z.object({
		status: z.number().optional(),
		crawlAllowed: z.boolean(),
		/** Disallow rules that apply to every crawler or to this one. */
		disallow: z.array(z.string())
	}),
	/** Links in the header and navigation, in page order: the menu as delivered in HTML. */
	menu: z.array(navLink),
	footerLinks: z.array(navLink),
	sitemap: z.object({
		url: z.string().optional(),
		status: z.number().optional(),
		urlCount: z.number(),
		urls: z.array(z.string())
	}),
	homepage: pageEvidenceSchema.optional(),
	errors: z.array(z.string()),
	notes: z.array(z.string())
});
export type SiteMap = z.infer<typeof siteMapSchema>;

export const pagesSchema = z.object({
	pages: z.array(pageEvidenceSchema),
	/** URLs that served a page already in this batch (for example / and /home/). */
	duplicates: z.array(z.object({ url: z.string(), sameAs: z.string() })),
	errors: z.array(z.string())
});

export const linkCheckSchema = z.object({
	url: z.string(),
	status: z.number().optional(),
	finalUrl: z.string().optional(),
	/** Set when the link could not be fetched, or was not checked (robots.txt). */
	error: z.string().optional(),
	checked: z.boolean()
});

export const sampleSchema = z.object({ site: siteMapSchema, pages: z.array(pageEvidenceSchema) });

export const renderedEvidenceSchema = reportSchema.shape.browser;
export const performanceEvidenceSchema = reportSchema.shape.performance;

/** The model's own assessment, written after reading the evidence; rendered as-is. */
const text = (max: number) => z.string().max(max);
const findingSchema = z.object({
	title: text(160),
	priority: z.enum(['fix_first', 'next', 'polish']),
	/** observed = seen in the evidence; judgement = an opinion about what was seen. */
	basis: z.enum(['observed', 'judgement']),
	observation: text(800),
	forPractice: text(800),
	forDeveloper: text(800),
	evidence: z.array(z.object({ url: text(2048), detail: text(400) })).max(4)
});
export const assessmentSchema = z.object({
	practiceName: text(200),
	websiteUrl: text(2048),
	fixture: z.boolean().default(false),
	/** Two or three sentences: the overall judgement. */
	verdict: text(900),
	/** At most three actions, in order. */
	doFirst: z.array(text(300)).max(3),
	journeys: z
		.array(
			z.object({
				/** The patient's words, e.g. “I’m in pain and need help now”. */
				name: text(120),
				verdict: z.enum(['works', 'friction', 'blocked', 'not_applicable']),
				walkthrough: text(1200),
				findings: z.array(findingSchema).max(6)
			})
		)
		.max(8),
	technical: z.array(findingSchema).max(10),
	googleProfile: z.object({
		status: z.enum(['assessed', 'partial', 'not_found', 'not_checked']),
		summary: text(1200),
		/** Where the listing was seen (Maps link or search result URL). */
		source: text(2048).optional(),
		findings: z.array(findingSchema).max(6)
	}),
	strengths: z.array(text(300)).max(6),
	/** One short paragraph: where to start, and what not to spend money on yet. */
	bottomLine: text(900).optional(),
	notChecked: z.array(text(300)).max(10)
});
export type Assessment = z.infer<typeof assessmentSchema>;
