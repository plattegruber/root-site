<!--
@component
Hero — full-bleed ink section that names the niche in the first breath.

A mono eyebrow, then the positioning sentence as the display line, then the
one-sentence version of the offer. A single CTA (no competing buttons), then
a hairline and the price. When the founding offer is active it sits directly
under the price so the visitor sees both numbers before a scroll.
-->
<script lang="ts">
	import { EdWrap } from '$lib/components/editorial';
	import { Button, Divider } from '$lib/components/ui';
	import { pricing } from '$lib/config/site';

	const { monthly, founding } = pricing;
</script>

<section class="hero-py">
	<EdWrap>
		<div class="mb-[30px] font-mono text-[13px] tracking-[0.04em] text-root-light">
			root. — built for independent dentists
		</div>

		<h1 class="m-0 max-w-[780px] font-serif text-hero-display font-normal text-balance text-cream">
			The dental web agency for solo practices.
		</h1>

		<p class="mt-8 mb-0 max-w-[560px] font-sans text-hero-sub text-pretty text-cream/90">
			Your website and Google presence, taken care of.
		</p>
		<p class="mt-3 mb-0 max-w-[560px] font-sans text-hero-sub text-pretty text-drift">
			Custom website, ongoing updates, and Google Business Profile management for one simple monthly
			price.
		</p>

		<div class="mt-10">
			<Button href="#contact">
				See what we’d build for your practice
				<span aria-hidden="true">→</span>
			</Button>
		</div>

		<div class="mt-[52px] max-w-[600px]">
			<Divider dark />
			<p class="mt-5 mb-0 font-mono text-[14px] tracking-[0.01em] text-drift">
				<span class="text-cream">${monthly}</span>/month · no setup fee · no contract
			</p>
			{#if founding.active}
				<p class="mt-2 mb-0 font-mono text-[14px] tracking-[0.01em] text-drift">
					<span class="text-root-light">Founding practices:</span>
					<span class="text-cream">${founding.monthly}</span>/month forever · first {founding.limit}
					only
				</p>
			{/if}
		</div>
	</EdWrap>
</section>
