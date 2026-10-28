<!--
@component
Final CTA — the ask, once, just above the form.

A low-pressure invitation: send the current website, we go through it by
hand and say what we'd fix or build. The human look is not sold as a
product; it is what reaching out gets you, and it makes the form worth
filling in even for someone not ready to buy. Nothing here promises an
automated review, because the plugin isn't public yet.

Cream band between the linen pricing section and the ink Contact section,
so the eye lands on the button rather than on a color change.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { Button } from '$lib/components/ui';

	const para = 'm-0 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay';
</script>

<section class="section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="send" label="next step">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					Let’s take a look at your website.
				</h2>
				<div class="flex flex-col gap-4">
					<p class={para}>
						Before anyone builds you anything, it’s worth knowing where your current site stands.
					</p>
					<p class={para}>
						Send us the address. We go through it the way a patient would, by hand, and write back
						with what we’d fix, or what we’d build instead. If the honest answer is “keep what you
						have,” we’ll say so.
					</p>
					<p class={para}>
						No pitch deck, no obligation, and you’ll be talking to the person who would do the work.
					</p>
				</div>
				<div class="mt-8">
					<Button href="#contact">
						Tell us about your practice
						<span aria-hidden="true">→</span>
					</Button>
				</div>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
