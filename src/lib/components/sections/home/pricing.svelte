<!--
@component
Pricing — one product, one card.

The numeral and the ledger of what's included, then "no setup fee, no
contract" in mono. When the founding offer is active, a hairline and the
founding block follow: same service, lower price, first N practices. The
normal price stays visible above it so the offer reads as an early-customer
deal, not a discount brand.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { Button, Divider } from '$lib/components/ui';
	import { pricing } from '$lib/config/site';
	import { cn } from '$lib/utils';

	const { monthly, founding } = pricing;

	const included = [
		'Custom website',
		'Hosting',
		'Maintenance',
		'Website updates',
		'Google Business Profile management',
		'Local SEO fundamentals',
		'Analytics',
		'Human support'
	];

	const heading =
		'mb-8 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink';
	const para = 'm-0 max-w-[520px] font-sans text-[15px] leading-[1.6] text-pretty text-clay';
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
		<p class="mt-3.5 mb-0 font-mono text-[14px] leading-[1.6] text-clay">{note}</p>
	</div>
{/snippet}

<section id="pricing" class="bg-linen section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="tag" label="pricing">
				<h2 class={heading}>Everything root does.</h2>

				<div class={priceGrid}>
					{@render priceBlock(`$${monthly}`, '/month', 'No setup fee. No contract.')}

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
			</MarginRow>
		</Reveal>

		{#if founding.active}
			<Reveal class="my-12">
				<MarginRow>
					<Divider />
				</MarginRow>
			</Reveal>

			<Reveal delay={80}>
				<MarginRow icon="user-round" label="founding practices">
					<h2 class={cn(heading, 'mb-7')}>First {founding.limit} practices.</h2>

					<div class={priceGrid}>
						{@render priceBlock(
							`$${founding.monthly}`,
							'/month',
							'Forever. Same service. No reduced tier.'
						)}

						<div class="flex flex-col gap-4">
							<p class={para}>
								We’re rebuilding root around independent solo practices. The first {founding.limit}
								practices get the complete service for ${founding.monthly} a month, locked in for as long
								as they remain customers.
							</p>
							<p class={para}>
								Everything above is included. The price is the only thing that’s different, and it
								doesn’t go up later.
							</p>
							<div class="mt-2">
								<Button href="#contact">
									Claim a founding spot
									<span aria-hidden="true">→</span>
								</Button>
							</div>
						</div>
					</div>
				</MarginRow>
			</Reveal>
		{:else}
			<Reveal delay={80} class="mt-10">
				<MarginRow>
					<Button href="#contact">
						Get started
						<span aria-hidden="true">→</span>
					</Button>
				</MarginRow>
			</Reveal>
		{/if}
	</EdWrap>
</section>
