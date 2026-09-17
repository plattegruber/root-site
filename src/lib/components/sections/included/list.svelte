<!--
@component
What's-included list — a quiet spec sheet. Each row pairs a plain-language
term (serif) and the industry's jargon for it (grey mono, in quotes) on
the left, with a two-paragraph explanation on the right. Hairline dividers
do the structural work. Closes with a mono line on pricing.

Grouped the way the offer is described: the website itself, the updates,
the Google presence, then the fundamentals underneath. Nothing here promises
rankings or a response-time SLA; it describes what gets done.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';

	const groups = [
		{
			heading: 'Your website',
			items: [
				{
					term: 'Designed around your practice',
					jargon: 'not “a dental template”',
					paras: [
						'Your site is designed from your actual practice: the doctors, the team, the tone of the office, the services you want to be known for, and the town you’re in. Not a theme with your logo swapped in.',
						'Patients can tell the difference. A template feels like a brochure; a site built around the real place feels like the front door.'
					]
				},
				{
					term: 'Real photos, not stock',
					jargon: '“brand photography”',
					paras: [
						'A practice site should look like the practice. We build around your real photos: the team, the space, the front door, the small details that make a patient feel like they already know where they’re going.',
						'If you don’t have photos yet, we’ll tell you exactly which eight to get and help you plan the shoot.'
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
					term: 'Copy, written for you',
					jargon: '“content”',
					paras: [
						'You don’t have to write anything. We interview you, then write the pages in plain English a patient can read on a phone in a parking lot.',
						'You review it and tell us what’s off. We fix it. Nothing goes live without your okay.'
					]
				}
			]
		},
		{
			heading: 'Updates',
			items: [
				{
					term: 'Changes, whenever',
					jargon: '“maintenance plan”',
					paras: [
						'New hours, a new associate, a new service, a new insurance note: email us, and we make the change. Most are done the same day. No ticket system, no support portal, no CMS to learn.',
						'The big companies sell this as a website maintenance plan. Here it’s just part of the service.'
					]
				},
				{
					term: 'One person who knows your practice',
					jargon: '“dedicated account manager”',
					paras: [
						'root is intentionally small. The person who built your site is the person who answers when you write. There’s no handoff and nobody you have to re-explain your practice to.',
						'You’ll get a reply within a day, usually sooner.'
					]
				}
			]
		},
		{
			heading: 'Your Google presence',
			items: [
				{
					term: 'Google Business Profile, managed',
					jargon: '“GBP management”',
					paras: [
						'Your Google Business Profile is what most patients see first, before they ever reach your website. We keep it accurate and complete: business information, hours, services, categories, photos, and the fixes when Google gets something wrong.',
						'We also handle routine upkeep and post updates where they make sense. Reviews stay yours to answer; we’ll show you how if you want.'
					]
				},
				{
					term: 'Local search fundamentals',
					jargon: '“local SEO”',
					paras: [
						'Your website and your Google Business Profile agree on your name, address, phone, hours, and services. Page titles, descriptions, and the structured markup Google reads are built in. Search Console and analytics are set up and watched.',
						'This is the groundwork Google expects from a practice website. It is not an aggressive SEO campaign, and we won’t promise you a ranking. We’ll make sure nothing about your site is holding you back.'
					]
				}
			]
		},
		{
			heading: 'The fundamentals',
			items: [
				{
					term: 'Phones',
					jargon: '“mobile responsive”',
					paras: [
						'More than half of new patients will meet your practice on a phone, in a parking lot or a school pickup line. So the phone version is designed first and the desktop version follows.',
						'Every layout, form, and button is sized for thumbs, and calling your office is one tap from any page.'
					]
				},
				{
					term: 'Speed',
					jargon: '“Core Web Vitals”',
					paras: [
						'Your site loads in about a second. No page builders, no plugin stacks: hand-written code, served from servers close to your patients.',
						'Google quietly prefers fast sites. Patients don’t wait for slow ones. So we don’t build them.'
					]
				},
				{
					term: 'Hosting & backups',
					jargon: '“managed hosting”',
					paras: [
						'The site lives on infrastructure we manage and monitor around the clock. If it ever goes down, we know within a minute, usually before anyone else notices.',
						'A complete copy of everything is saved daily and stored separately. If something breaks at 2 a.m., we get the alert. You keep sleeping.'
					]
				},
				{
					term: 'Security',
					jargon: '“SSL / HTTPS”',
					paras: [
						'Encryption between your patients and your site, renewed automatically. Software updates and security patches applied as they’re released, not when someone remembers.',
						'The contact form collects a name and a phone number, nothing clinical, so there’s no patient health information sitting in a database.'
					]
				},
				{
					term: 'Accessibility',
					jargon: '“ADA / WCAG”',
					paras: [
						'The site works for patients who use screen readers, larger text, or a keyboard instead of a mouse. Practices really do get demand letters over inaccessible sites.',
						'Building it right from day one is far easier than retrofitting, so that’s what we do.'
					]
				},
				{
					term: 'Your domain, your site',
					jargon: '“domain ownership”',
					paras: [
						'yourpractice.com is registered in your name, not ours. You own it outright: the domain, the design, the words, all of it.',
						'Some web companies hold domains hostage when a practice tries to leave. We think that’s shabby. If we ever part ways, everything goes with you.'
					]
				}
			]
		}
	];
</script>

<section style="padding-bottom: var(--section-v-padding)">
	<Container>
		<div class="flex flex-col">
			{#each groups as group (group.heading)}
				<h2
					class="mt-12 mb-4 font-mono text-[12px] tracking-[0.04em] text-root-light uppercase first:mt-0"
				>
					{group.heading}
				</h2>
				{#each group.items as item (item.term)}
					<div class="flex flex-wrap gap-6 border-t border-stone py-8">
						<div class="w-[210px] shrink-0">
							<h3 class="m-0 mb-1.5 font-serif text-[22px] leading-[1.3] font-normal text-ink">
								{item.term}
							</h3>
							<span class="block font-mono text-[13px] leading-[1.5] text-drift">{item.jargon}</span
							>
						</div>
						<div class="flex max-w-[480px] min-w-[260px] flex-1 flex-col gap-3">
							{#each item.paras as para (para)}
								<p class="m-0 font-sans text-[15px] leading-[1.65] text-pretty text-clay">{para}</p>
							{/each}
						</div>
					</div>
				{/each}
			{/each}

			<div class="mt-12 border-t border-stone pt-7">
				<p class="m-0 max-w-[520px] font-mono text-[15px] leading-[1.6] text-charcoal">
					Everything on this page comes with the one plan root offers. There is no version of root
					where the fundamentals are an upgrade.
				</p>
			</div>
		</div>
	</Container>
</section>
