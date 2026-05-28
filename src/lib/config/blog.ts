/**
 * Editorial post list for the Writing page.
 *
 * Posts are currently placeholders mirroring the design. When real posts
 * land, swap this for an mdsvex collection or a CMS-backed loader — the
 * page component reads from this module so the migration is local.
 */
export type BlogPost = {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
};

export const posts: BlogPost[] = [
	{
		slug: 'why-your-dental-website-loads-too-slowly',
		title: 'Why your dental website probably loads too slowly',
		date: 'May 15, 2026',
		excerpt:
			'Your site is probably running on shared hosting with uncompressed images and three analytics scripts. Here’s what that actually costs you.'
	},
	{
		slug: 'what-patients-actually-look-for',
		title: 'What patients actually look for on your site',
		date: 'April 22, 2026',
		excerpt:
			'It’s not your degrees. It’s not your mission statement. It’s your hours, your location, and whether you look like someone they’d trust.'
	},
	{
		slug: 'against-stock-photos-of-smiling-people',
		title: 'The case against stock photos of smiling people',
		date: 'March 10, 2026',
		excerpt:
			'A wall of beaming faces in scrubs doesn’t make anyone feel at ease. Here’s what to do instead.'
	},
	{
		slug: 'you-dont-need-a-chatbot',
		title: 'You don’t need a chatbot',
		date: 'February 18, 2026',
		excerpt:
			'If a patient has a question at 2am, they’ll email you. They don’t want to talk to a purple bubble in the corner of your screen.'
	},
	{
		slug: 'why-i-charge-250-a-month',
		title: 'Why I charge $250 a month',
		date: 'January 5, 2026',
		excerpt:
			'It’s not the cheapest option. It’s not the most expensive. Here’s what goes into the number and why it works.'
	}
];
