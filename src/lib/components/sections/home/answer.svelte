<!--
@component
Answer — root.site's reply to the three-way trade-off above, then the price.

Three beats on one linen band. First the positioning ("in between"), which
carries the short version of the engineer's bio. Then the $250 ledger of
what's included. Then, below a hairline, the optional SEO/AEO tier — plainly
elective, never framed as the better choice; the site stands on its own.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { Divider } from '$lib/components/ui';
	import { cn } from '$lib/utils';

	const included = [
		'Custom design — not a template',
		'Dental-specific pages, written for patient questions',
		'Google-ready — site and Business Profile in agreement',
		'Hosting, security, and backups, handled',
		'Edits and updates, anytime — just message me',
		'No setup fee, no contract'
	];

	const heading =
		'mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink';
	const para = 'm-0 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay';
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
		<!-- The position: custom + managed + flat price -->
		<Reveal>
			<MarginRow icon="pencil-ruler" label="the answer">
				<h2 class={heading}>A custom site, managed for you, at a flat price.</h2>
				<p class={cn(para, 'mb-5')}>
					root.site sits in between: designed around your actual practice, written for the questions
					patients actually ask, set up right for Google — and then kept current, month after month,
					by the person who built it.
				</p>
				<p class={para}>
					I’m an engineer with over ten years of building real systems. I chose dentistry on
					purpose: it deserves better websites than it’s been getting.
				</p>
			</MarginRow>
		</Reveal>

		<!-- Tier 1 — the website -->
		<Reveal delay={80} class="mt-16">
			<MarginRow icon="globe" label="what's included">
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

				<p class={cn(para, 'mt-7 text-[15px]')}>
					The full list lives on
					<a
						href="/the-boring-stuff"
						class="text-root underline decoration-root/30 underline-offset-[3px] transition-colors hover:text-root-dark"
					>
						the boring stuff
					</a>
					— everything there comes with every site.
				</p>
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
				<h2 class={cn(heading, 'mb-7')}>Active SEO &amp; AEO management</h2>

				<div class={priceGrid}>
					{@render priceBlock('$1,000', '/month', 'The website comes with it.')}

					<div class="flex flex-col gap-4">
						<p class={para}>
							Some practices want to actively climb the rankings — Google, the map, AI answers. That
							takes ongoing work: reviews, fresh content, keeping your listing active. Every month,
							not once.
						</p>
						<p class={cn(para, 'font-medium text-charcoal')}>
							If that’s you, I do it. You’ll see where you rank.
						</p>
						<p class={para}>
							No contract here either — cancel anytime. Most practices are happy with just the site,
							and that’s good by me. This is here if you want it.
						</p>
					</div>
				</div>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
