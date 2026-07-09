<!--
@component
Final CTA — the ask, restated once, just above the form.

Repeats the hero's offer now that the page has earned it. Sits on cream
between the linen Demos band and the ink Contact section, so the eye lands
on the button rather than a color change.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { Button } from '$lib/components/ui';
</script>

<section class="section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="send" label="start here">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					Send me your current site.
				</h2>
				<p class="mb-8 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay">
					I’ll tell you what I’d keep, what I’d change, and why. Free, useful either way, and no
					obligation to go further.
				</p>
				<Button href="#contact">
					Get a free website review
					<span aria-hidden="true">→</span>
				</Button>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
