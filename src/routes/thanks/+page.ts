export const prerender = true;

export const load = () => ({
	title: 'Thanks — root.',
	description: 'Your message reached me. I’ll be in touch within a day.',
	// Transactional confirmation page — keep it out of the index (it's
	// also absent from the sitemap), but let crawlers follow its links.
	noindex: true
});
