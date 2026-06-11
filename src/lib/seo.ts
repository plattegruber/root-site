/**
 * Structured data (JSON-LD) builders.
 *
 * Search engines and AI assistants (which increasingly cite sources) lean
 * on Schema.org JSON-LD to understand who publishes a site and what each
 * page is. These helpers produce a small, valid `@graph`:
 *
 *   - a sitewide `Organization` + `WebSite` pair (emitted by the root
 *     layout on every page),
 *   - an `Article` per blog post,
 *   - a `BreadcrumbList` for inner pages.
 *
 * Nodes are linked by `@id` so the graph stays normalized — the Article's
 * author/publisher point at the same Organization node the layout emits,
 * rather than restating it. We deliberately model root. as an
 * `Organization` (not `LocalBusiness`/`ProfessionalService`): it's a
 * remote one-person studio with no storefront, so claiming a physical
 * location would be invalid structured data.
 */
import { site } from '$lib/config/site';

/** Stable @id anchors for the sitewide nodes, referenced across the graph. */
export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;
export const PERSON_ID = `${site.url}/#founder`;

type JsonLdNode = Record<string, unknown>;

/**
 * The sitewide graph: who runs root. and what the site is. Emitted once,
 * on every page, from the root layout.
 */
export function siteGraph(): JsonLdNode {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': ORG_ID,
				name: site.name,
				alternateName: 'root.site',
				url: site.url,
				description: site.description,
				email: site.email,
				image: `${site.url}/og.png`,
				logo: {
					'@type': 'ImageObject',
					url: `${site.url}/favicon.svg`
				},
				founder: { '@id': PERSON_ID },
				areaServed: { '@type': 'Country', name: 'United States' },
				knowsAbout: ['Dental practice websites', 'Web design', 'Web development']
			},
			{
				'@type': 'Person',
				'@id': PERSON_ID,
				name: site.author,
				url: `${site.url}/about`
			},
			{
				'@type': 'WebSite',
				'@id': WEBSITE_ID,
				url: site.url,
				name: site.name,
				description: site.description,
				publisher: { '@id': ORG_ID },
				inLanguage: 'en-US'
			}
		]
	};
}

/** Minimal post shape needed to describe an Article (matches PostSummary). */
type ArticleInput = {
	title: string;
	excerpt: string;
	/** ISO day, e.g. "2026-05-15". */
	date: string;
	slug: string;
};

/**
 * Article schema for a blog post. References the sitewide Organization as
 * publisher and the founder as author so the nodes resolve against the
 * layout's graph.
 */
export function articleSchema(post: ArticleInput): JsonLdNode {
	const url = `${site.url}/writing/${post.slug}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		'@id': `${url}#article`,
		headline: post.title,
		description: post.excerpt,
		datePublished: post.date,
		dateModified: post.date,
		author: { '@id': PERSON_ID },
		publisher: { '@id': ORG_ID },
		image: `${site.url}/og.png`,
		mainEntityOfPage: url,
		url,
		inLanguage: 'en-US'
	};
}

/** A single question/answer pair, as authored in a post's `faq` frontmatter. */
export type FaqItem = { q: string; a: string };

/**
 * FAQPage schema for a post that ends in a Q&A section. Lets search and
 * AI assistants extract each answer as a self-contained unit. Authored in
 * the post's frontmatter (`faq:`) so the prose and the structured data
 * stay in one file.
 */
export function faqSchema(faqs: FaqItem[]): JsonLdNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};
}

/**
 * BreadcrumbList for an inner page. `trail` is ordered root → leaf; pass
 * paths relative to the site root (the home crumb is added implicitly).
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]): JsonLdNode {
	const items = [{ name: 'Home', path: '/' }, ...trail];
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: `${site.url}${item.path}`
		}))
	};
}

/**
 * Serialize a JSON-LD object into a ready-to-inject <script> tag. The `<`
 * escape prevents a `</script>` sequence inside string values from
 * breaking out of the tag — the one XSS/parse footgun of inline JSON-LD.
 * Rendered via {@html} inside <svelte:head>.
 */
export function jsonLdScript(data: JsonLdNode): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</scr` + `ipt>`;
}
