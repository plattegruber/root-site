import { breadcrumbSchema, faqSchema } from '$lib/seo';
import { buyingFaq } from '$lib/config/faq';
import { price } from '$lib/config/site';

export const prerender = true;

export const load = () => ({
	title: 'What’s included — root.',
	description: `Everything that comes with root for ${price} a month: a custom website, hosting and maintenance, updates handled for you, Google Business Profile management, and local search fundamentals. No setup fee, no contract. Plus straight answers on pricing, cancelling, launch timing, and who qualifies.`,
	// The buying FAQ is emitted as FAQPage schema so the answers on this page
	// are the machine-readable source for what root costs and includes.
	jsonld: [
		breadcrumbSchema([{ name: 'What’s included', path: '/whats-included' }]),
		faqSchema(buyingFaq)
	]
});
