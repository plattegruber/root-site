import { pricing, price, foundingPrice } from './site';
import type { FaqItem } from '$lib/seo';

/**
 * Buying questions — the single source for the commercial facts about root:
 * price, founding offer, Google Business Profile scope, cancellation, launch
 * timing, migration, and who qualifies. Rendered on /whats-included and
 * emitted there as FAQPage JSON-LD, so a person and a search or AI engine
 * read the same answer. Prices come from `pricing` so a change there
 * propagates here without a rewrite.
 *
 * Keep each answer self-contained: an AI assistant may quote one on its own.
 */
const founding = pricing.founding;

export const buyingFaq: FaqItem[] = [
	{
		q: 'What does root cost?',
		a:
			`${price} a month, flat. No setup fee, no contract, no per-page or per-edit charges. ` +
			(founding.active
				? `While the founding offer is open, the first ${founding.limit} independent practices get the complete service for ${foundingPrice} a month, locked in for as long as they remain customers. Same service, not a reduced tier.`
				: 'Everything on this page is included at that price.')
	},
	{
		q: 'What does Google Business Profile management include?',
		a: 'We keep your Google Business Profile accurate and complete: business information, hours, holiday hours, services, categories, photos, and the fixes when Google changes or “suggests” something wrong. We check it routinely, post updates where they make sense, and make changes the same way as on the site — you email, we do it. Replying to reviews stays with you, because replies land better in your own voice; we’ll show you how if you want.'
	},
	{
		q: 'What happens when I cancel?',
		a: 'You email us and stop paying. There is no notice period, no termination fee, and no remaining term to pay out. The domain is already registered in your name, so nothing has to be transferred. We hand over the site files and help move everything wherever you are going, and the site stays live while you do.'
	},
	{
		q: 'How long does launch take?',
		a: 'About two to three weeks from kickoff. We interview you about the practice, write the pages, and design the site around your real photos. You review drafts along the way, and nothing goes live without your okay. The things we need from you: a short conversation, your photos (or a plan to get them), and a review of the copy.'
	},
	{
		q: 'Can I move my existing website to root?',
		a: 'Yes. We carry over whatever is worth keeping — pages, copy, photos, reviews — and rebuild the rest. If your domain is held by your current vendor, we help get it into your own account first. Old addresses redirect to the new pages so links and search rankings carry over, and the switch happens in one step once the new site is approved.'
	},
	{
		q: 'What counts as a solo practice?',
		a: 'A practice that is owned and run by the dentist. Associates, hygienists, and a second location under the same owner all qualify. Multi-location groups and DSOs are not who root is built for; they need more than a few hours a month and a different kind of vendor.'
	}
];
