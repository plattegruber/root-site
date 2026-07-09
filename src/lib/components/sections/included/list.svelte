<!--
@component
What's-included list — a quiet spec sheet. Each row pairs a plain-language
term (serif) and the industry's jargon for it (grey mono, in quotes) on
the left, with a two-paragraph explanation on the right. Hairline dividers
do the structural work. Closes with a mono line on pricing.

The craft items lead — design, photography, and the page structure that
answers patient questions — so the page reads as the work rather than as a
utilities bill. The infrastructure follows.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';

	const items = [
		{
			term: 'Design around your practice',
			jargon: 'not “a dental template”',
			paras: [
				'Your site is designed from your actual practice — the doctors, the team, the tone of the office, the services you want to be known for, and the town you’re in. Not a theme with your logo swapped in.',
				'Patients can tell the difference. A template feels like a brochure; a site built around the real place feels like the front door.'
			]
		},
		{
			term: 'Photography, coordinated',
			jargon: '“brand photography”',
			paras: [
				'Your site needs real photos — the team, the space, the front door, the small details that make a patient feel like they already know where they’re going. If you want, I’ll coordinate the shoot: find the photographer, plan the shot list, schedule it around your patient hours.',
				'You don’t need a big production. You need the right eight photos, and I’ll make sure you get them.'
			]
		},
		{
			term: 'Pages that answer patient questions',
			jargon: '“information architecture”',
			paras: [
				'Dental sites have a specific job: Can I book? Do you take my insurance? Where do I park? Do you see kids? What happens at my first visit? Can you help if I’m nervous?',
				'Every page is structured around those questions, in that order of urgency. Pretty is good; answered is better.'
			]
		},
		{
			term: 'Showing up on Google',
			jargon: '“local SEO”',
			paras: [
				'Your website and your Google Business Profile should agree on your name, address, phone, hours, and services. When they do, you move up in the map results. I set both up to match and keep them matching.',
				'Page titles, descriptions, and the structured markup Google reads directly are all part of the build. Agencies sell this as a separate monthly retainer. Here it’s just part of the website.'
			]
		},
		{
			term: 'Phones',
			jargon: '“mobile responsive”',
			paras: [
				'More than half of new patients will meet your practice on a phone — in a parking lot, in a school pickup line. So I design the phone version first and let the desktop version follow.',
				'Every layout, form, and button is sized for thumbs, and calling your office is one tap from any page.'
			]
		},
		{
			term: 'Speed',
			jargon: '“Core Web Vitals”',
			paras: [
				'Your site loads in about a second. No page builders, no plugin stacks — hand-written code, served from servers close to your patients.',
				'Google quietly ranks fast sites above slow ones. Yours passes. Patients don’t wait for slow websites, so I don’t build them.'
			]
		},
		{
			term: 'Hosting & backups',
			jargon: '“managed hosting”',
			paras: [
				'The site lives on servers I manage and monitor around the clock. If it ever goes down, I know within a minute — usually before anyone else notices.',
				'A complete copy of everything is saved daily and stored separately. If something breaks at 2 a.m., I get the alert; you get to keep sleeping.'
			]
		},
		{
			term: 'Security',
			jargon: '“SSL / HTTPS”',
			paras: [
				'Encryption between your patients and your site, renewed automatically. Software updates and security patches applied as they’re released, not when someone remembers.',
				'The contact form collects a name and a phone number — nothing clinical — so there’s no patient health information sitting in a database.'
			]
		},
		{
			term: 'Accessibility',
			jargon: '“ADA / WCAG”',
			paras: [
				'The site works for patients who use screen readers, larger text, or a keyboard instead of a mouse. Practices really do get demand letters over inaccessible sites.',
				'Building it right from day one is far easier than retrofitting, so that’s what I do.'
			]
		},
		{
			term: 'Changes, whenever',
			jargon: '“maintenance plan”',
			paras: [
				'New hours, a new associate, a new service, a new insurance note — email me, and it’s usually live the same day. No ticket system, no support portal.',
				'The big companies sell this as a website maintenance plan. Here it’s just me, maintaining your website.'
			]
		},
		{
			term: 'Your domain, your site',
			jargon: '“domain ownership”',
			paras: [
				'yourpractice.com is registered in your name, not mine. You own it outright — the domain, the design, the words, all of it.',
				'Some web companies hold domains hostage when a practice tries to leave. I think that’s shabby. If we ever part ways, everything goes with you.'
			]
		}
	];
</script>

<section style="padding-bottom: var(--section-v-padding)">
	<Container>
		<div class="flex flex-col">
			{#each items as item (item.term)}
				<div class="flex flex-wrap gap-6 border-t border-stone py-8">
					<div class="w-[210px] shrink-0">
						<h3 class="m-0 mb-1.5 font-serif text-[22px] leading-[1.3] font-normal text-ink">
							{item.term}
						</h3>
						<span class="block font-mono text-[13px] leading-[1.5] text-drift">{item.jargon}</span>
					</div>
					<div class="flex max-w-[480px] min-w-[260px] flex-1 flex-col gap-3">
						{#each item.paras as para (para)}
							<p class="m-0 font-sans text-[15px] leading-[1.65] text-pretty text-clay">{para}</p>
						{/each}
					</div>
				</div>
			{/each}

			<div class="border-t border-stone pt-7">
				<p class="m-0 max-w-[520px] font-mono text-[15px] leading-[1.6] text-charcoal">
					Everything on this page comes with every plan. There is no version of root where the
					boring stuff is an upgrade.
				</p>
			</div>
		</div>
	</Container>
</section>
