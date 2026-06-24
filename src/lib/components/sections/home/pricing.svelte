<!--
@component
Pricing — two calm, parallel tiers on a shared linen band.

Tier one ($250) is the whole job for most practices: a numbered ledger of
what's included. Tier two ($1,000, the website comes with it) is active
SEO/AEO management — plainly optional, never framed as the better choice.
A hairline separates them; the site stands on its own.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { Button, Divider } from '$lib/components/ui';
	import { cn } from '$lib/utils';

	const included = [
		'Custom design — not a template',
		'Fast, reliable hosting',
		'Mobile-friendly, always',
		'Edits and updates, anytime — just message me',
		'Built to be found — set up right for search and AI from day one',
		'No setup fee, no contract'
	];

	const tierHeading =
		'mb-7 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink';
	const tierPara = 'm-0 max-w-[540px] font-sans text-[17px] leading-[1.65] text-clay';
	const priceGrid =
		'pricing-grid grid grid-cols-[minmax(0,200px)_minmax(0,1fr)] items-start gap-10';
</script>

{#snippet priceBlock(amount: string, unit: string, note: string)}
	<div>
		<div class="flex items-baseline gap-1.5">
			<span class="font-serif text-(length:--price-numeral-size) leading-none text-ink"
				>{amount}</span
			>
			<span class="font-mono text-[15px] text-drift">{unit}</span>
		</div>
		<p class="mt-3.5 mb-0 font-sans text-[15px] leading-[1.55] text-clay">{note}</p>
	</div>
{/snippet}

<section class="bg-linen section-py">
	<EdWrap>
		<!-- Tier 1 — the website -->
		<Reveal>
			<MarginRow icon="globe" label="the site">
				<h2 class={tierHeading}>Your site, built right</h2>

				<div class={priceGrid}>
					{@render priceBlock('$250', '/month', 'Everything included. One flat fee.')}

					<ul class="m-0 list-none p-0">
						{#each included as item, i (item)}
							<li
								class={cn(
									'flex items-start gap-3.5 py-3 font-sans text-[15px] leading-[1.5] text-charcoal',
									i > 0 && 'border-t border-stone'
								)}
							>
								<span class="w-[18px] shrink-0 pt-0.5 font-mono text-[12px] text-root-light">
									{String(i + 1).padStart(2, '0')}
								</span>
								{item}
							</li>
						{/each}
					</ul>
				</div>

				<div class="mt-8 flex flex-col gap-4">
					<p class={tierPara}>
						That’s your Google listing plus the markup that lets search engines and AI find you.
						Most shops skip it. I don’t.
					</p>
					<p class={tierPara}>
						For most practices, this is the whole job. A great site, handled — no dashboard to
						learn, no password to dig up. When something needs changing, you message me and it’s
						done. Same person who built it, every time.
					</p>
				</div>
			</MarginRow>
		</Reveal>

		<Reveal class="my-12">
			<MarginRow>
				<Divider />
			</MarginRow>
		</Reveal>

		<!-- Tier 2 — optional SEO/AEO -->
		<Reveal delay={80}>
			<MarginRow icon="chart-line" label="going further">
				<h2 class={tierHeading}>Active SEO &amp; AEO management</h2>

				<div class={priceGrid}>
					{@render priceBlock('$1,000', '/month', 'The website comes with it.')}

					<div class="flex flex-col gap-4">
						<p class={tierPara}>
							Some practices want to actively climb the rankings — Google, the map, AI answers. That
							takes ongoing work: reviews, fresh content, keeping your listing active. Every month,
							not once.
						</p>
						<p class={cn(tierPara, 'font-medium text-charcoal')}>
							If that’s you, I do it. You’ll see where you rank.
						</p>
						<p class={tierPara}>
							No contract here either — cancel anytime. Most practices are happy with just the site,
							and that’s good by me. This is here if you want it.
						</p>
					</div>
				</div>
			</MarginRow>
		</Reveal>

		<Reveal delay={120} class="mt-14">
			<MarginRow>
				<Button href="#contact">
					Get a free mockup
					<span aria-hidden="true">→</span>
				</Button>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
