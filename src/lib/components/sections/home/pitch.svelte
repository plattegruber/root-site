<!--
@component
Pitch — the one-sentence value proposition, plus pricing aside.

Two paragraphs at most. The `$250` is rendered in mono to give the
number a tactile, ledger-like weight against the surrounding sans serif.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
</script>

<section class="section-py">
	<Container>
		<h2 class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink">
			I make websites for dental practices.
		</h2>
		<div class="max-w-[560px]">
			<p class="mb-5 font-sans text-hero-sub text-clay">
				Custom design, reliable hosting, updates whenever you need them. One person doing one thing
				well.
			</p>
			<p class="m-0 font-sans text-hero-sub text-clay">
				You pay
				<span class="font-mono text-charcoal">$250</span>
				a month. No setup fee. No contract. Cancel anytime.
			</p>
		</div>
	</Container>
</section>
