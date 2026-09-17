<!--
@component
Final CTA — the ask, once, just above the form.

Linen band between the cream Human section and the ink Contact section so
the eye lands on the button rather than a color change.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { Button } from '$lib/components/ui';
</script>

<section class="bg-linen section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="send" label="next step">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					Want us to take your website off your plate?
				</h2>
				<p class="mb-8 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay">
					Tell us about your practice. We’ll come back with what we’d build and how it would work.
					No pitch deck, no obligation.
				</p>
				<Button href="#contact">
					Get started
					<span aria-hidden="true">→</span>
				</Button>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
