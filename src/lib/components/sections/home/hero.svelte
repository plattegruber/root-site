<!--
@component
Hero — full-bleed ink section with an oversized serif statement.

A mono eyebrow sets the context, the display sentence is given room to
breathe, and a hairline + mono price line anchor the bottom. No CTA up
here on purpose: the page sells craft and calm, so the sentence leads.
-->
<script lang="ts">
	import { EdWrap } from '$lib/components/editorial';
	import { Divider } from '$lib/components/ui';
</script>

<section class="hero-py">
	<EdWrap>
		<div class="mb-[30px] font-mono text-[13px] tracking-[0.04em] text-root-light">
			root.site — websites for dental practices
		</div>

		<h1 class="m-0 max-w-[780px] font-serif text-hero-display font-normal text-balance text-cream">
			Your website is often the first room a patient walks into.
		</h1>

		<div class="mt-[52px] max-w-[600px]">
			<Divider dark />
			<p class="mt-5 font-mono text-[14px] tracking-[0.01em] text-drift">
				<span class="text-cream">$250</span>/month · flat fee · no contract
			</p>
		</div>
	</EdWrap>
</section>
