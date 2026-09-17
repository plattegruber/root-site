import { breadcrumbSchema, PERSON_ID } from '$lib/seo';
import { site } from '$lib/config/site';

export const prerender = true;

export const load = () => ({
	title: `About ${site.person.name} — root.`,
	description: `${site.person.name} builds and looks after every root site from ${site.person.location}. root is the dental web agency for solo practices: custom websites and Google presence, taken care of, with no agency middlemen.`,
	jsonld: [
		breadcrumbSchema([{ name: 'About', path: '/about' }]),
		// Marks this page as being about the founder node the layout emits.
		{
			'@context': 'https://schema.org',
			'@type': 'AboutPage',
			'@id': `${site.url}/about#page`,
			url: `${site.url}/about`,
			name: `About ${site.person.name}`,
			mainEntity: { '@id': PERSON_ID }
		}
	]
});
