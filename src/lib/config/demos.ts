/**
 * Demo sites — fully-designed example practices that show prospective
 * clients what a root. site looks and feels like. Each lives on its own
 * `*.demo.root.site` subdomain so people can click around a real site
 * (they just can't actually book an appointment).
 *
 * This is the single source of truth, surfaced in two places:
 *   - the homepage teaser (src/lib/components/sections/home/demos.svelte)
 *   - the /demos index page (src/lib/components/sections/demos/*)
 *
 * Adding a demo is one entry here — no manual index. To bring a
 * placeholder live, fill in its `url` and drop the `comingSoon` flag.
 */
export type Demo = {
	/** Practice name as it appears on the demo site. */
	name: string;
	/** Short category line, e.g. "Family dentistry". */
	category: string;
	/** One sentence on what the demo shows off. */
	blurb: string;
	/** Full URL to the live demo. Omit while it's still being built. */
	url?: string;
	/** Screengrab under static/ (e.g. /screens/stillwater.webp), used as the homepage teaser visual. */
	image?: string;
	/** Hides the link and shows a muted "In progress" state instead. */
	comingSoon?: boolean;
};

export const demos: Demo[] = [
	{
		name: 'Stillwater Dental',
		category: 'Family & general dentistry',
		blurb:
			'A calm, modern practice site — services, team, and an online booking flow, all in the warm, unhurried voice a family practice wants.',
		url: 'https://stillwater.demo.root.site',
		image: '/screens/stillwater.webp'
	},
	{
		name: 'Treehouse Pediatric Dentistry',
		category: 'Pediatric dentistry',
		blurb:
			'A bright, playful pediatric site — services, a friendly intro to Dr. Priya, and easy booking, built to put nervous first-timers (and the parents booking for them) at ease.',
		url: 'https://treehouse.demo.root.site'
		// image: '/screens/treehouse.webp' — add once a 1440-wide screengrab lands.
	},
	{
		name: 'Demo three',
		category: 'Coming soon',
		blurb: 'A third example practice, in the works.',
		comingSoon: true
	}
];
