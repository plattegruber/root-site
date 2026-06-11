<!--
@component
Boring-stuff list — a quiet spec sheet. Each row pairs a plain-language
term (serif) and the industry's jargon for it (grey mono, in quotes) on
the left, with a two-paragraph explanation on the right. Hairline dividers
do the structural work. Closes with a mono line on pricing.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';

	const items = [
		{
			term: 'Showing up on Google',
			jargon: '“local SEO”',
			paras: [
				'When someone in your town searches for a dentist, you should show up. I write the page titles and descriptions Google displays, structure the site the way search engines like, and mark up your address, hours, and services in the format Google reads directly.',
				'I also make sure the site and your Google Business Profile agree with each other — that’s what moves you up in the map results. Agencies sell this as a separate monthly retainer. Here it’s just part of the website.'
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
				'Google measures speed with a scorecard called Core Web Vitals, and it quietly ranks fast sites above slow ones. Yours passes. Patients don’t wait for slow websites, so I don’t build them.'
			]
		},
		{
			term: 'Hosting & backups',
			jargon: '“managed hosting”',
			paras: [
				'The site lives on servers I manage and monitor around the clock. If it ever goes down — rare, but the internet is the internet — I know within a minute, usually before anyone else notices.',
				'A complete copy of everything is saved daily and stored separately, so if the worst happens, the site comes back exactly as it was. If something breaks at 2 a.m., I get the alert; you get to keep sleeping.'
			]
		},
		{
			term: 'Security',
			jargon: '“SSL / HTTPS”',
			paras: [
				'The padlock in the browser bar is an SSL certificate. It encrypts everything between your patients and your site, and it renews automatically — browsers mark sites without one as “not secure,” which is not a great look for a medical practice.',
				'Software updates and security patches are applied as they’re released, not when someone remembers. And the contact form collects a name and a phone number — nothing clinical — so there’s no patient health information sitting in a database.'
			]
		},
		{
			term: 'Accessibility',
			jargon: '“ADA / WCAG”',
			paras: [
				'The site works for patients who use screen readers, larger text, or a keyboard instead of a mouse. The standard is called WCAG — it’s what people mean by an “ADA-compliant website.”',
				'Practices really do get demand letters over inaccessible sites. Building it right from day one is far easier than retrofitting, so that’s what I do.'
			]
		},
		{
			term: 'Changes',
			jargon: '“maintenance plan”',
			paras: [
				'New hours, a new associate, a new service — email me, and it’s usually live the same day. No ticket system, no support portal, no “your request has been received.”',
				'The big companies sell this as a website maintenance plan. Here it’s just me, maintaining your website.'
			]
		},
		{
			term: 'Your domain',
			jargon: '“domain ownership”',
			paras: [
				'yourpractice.com is registered in your name, not mine. You own it outright — the domain, the design, the words, all of it.',
				'Some web companies register the domain themselves, then hold it hostage when a practice tries to leave. I think that’s shabby. If we ever part ways, everything goes with you.'
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
