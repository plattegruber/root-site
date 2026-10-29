<!--
@component
The work — the strongest demo, shown once the claims have been made and
just before the price, as proof.

A desktop plate with the phone's first screen overlaid on its corner, so
the two things a dentist should notice (it looks like a real practice; the
book button is where a thumb lands) are both visible at once. Then the
practice name, a "Visit" link, and three short observations about the
decisions behind it. Each observation describes something that is actually
on the demo site; check the demo before changing them.

The demo is a demo, not a client, and the copy says so. The detailed
walk-through belongs on /demos, not here.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { demos } from '$lib/config/demos';
	import { trackClick } from '$lib/analytics';
	import TermList from './term-list.svelte';

	const featured = demos.find((d) => d.url && !d.comingSoon);

	const decisions = [
		{
			term: 'Booking on the first screen',
			text: 'On a phone, “Book your first visit” sits right under the headline, and the phone number is a tap-to-call link.'
		},
		{
			term: 'The first visit, explained',
			text: 'A page for new patients: what to bring, where to park, which bus stops nearby. The things someone actually wonders before they come in.'
		},
		{
			term: 'Answers, not slogans',
			text: 'The questions page covers insurance, sedation and nerves in plain words, written for the patient who has been putting it off.'
		}
	];
</script>

<section id="demos" class="bg-linen section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="eye" label="the work">
				<h2
					class="mb-5 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					Here’s one we built.
				</h2>
				<p class="m-0 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay">
					An example practice, built top to bottom. Click around it the way a patient would. It’s a
					demo, not a client; yours would be designed around your practice, not this one.
				</p>
			</MarginRow>
		</Reveal>

		{#if featured}
			<Reveal delay={100} class="mt-12">
				<figure class="m-0">
					{#if featured.image}
						<div class="relative md:pr-16 md:pb-14">
							<div class="overflow-hidden rounded-md border border-stone bg-cream">
								<img
									src={featured.image}
									alt={`Screenshot of the ${featured.name} demo site on a desktop`}
									width="1440"
									height="900"
									loading="lazy"
									class="block h-auto w-full"
								/>
							</div>
							{#if featured.phoneImage}
								<div
									class="absolute right-0 bottom-0 hidden w-[176px] overflow-hidden rounded-[18px] border-[5px] border-ink bg-ink shadow-[0_24px_48px_-20px_rgba(26,23,21,0.45)] md:block"
								>
									<img
										src={featured.phoneImage}
										alt="The same site on a phone: the book button is on the first screen"
										width="780"
										height="1688"
										loading="lazy"
										class="block h-auto w-full"
									/>
								</div>
							{/if}
						</div>
					{/if}

					<div
						class="mt-[18px] flex items-baseline justify-between gap-4 border-t border-stone pt-[18px]"
					>
						<div>
							<div class="font-serif text-[22px] leading-tight font-normal text-ink">
								{featured.name}
							</div>
							<div class="mt-1.5 font-mono text-[12px] tracking-[0.02em] text-drift">
								{featured.category} · demo
							</div>
						</div>
						<a
							href={featured.url}
							target="_blank"
							rel="noopener noreferrer"
							use:trackClick={{
								event: 'demo_opened',
								properties: { demo: featured.name, from: 'homepage' }
							}}
							class="shrink-0 font-sans text-[15px] font-medium whitespace-nowrap text-root no-underline transition-colors hover:text-root-dark"
						>
							Visit the site ↗
						</a>
					</div>
				</figure>
			</Reveal>
		{/if}

		<Reveal delay={120} class="mt-12">
			<MarginRow label="a few of the decisions">
				<TermList items={decisions} compact />
				<p class="mt-6 mb-0">
					<a
						href="/demos"
						class="font-sans text-[15px] font-medium text-root underline decoration-root/30 underline-offset-2 transition-colors hover:text-root-dark"
					>
						See all demos →
					</a>
				</p>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
