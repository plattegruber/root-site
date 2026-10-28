<!--
@component
Final CTA — the ask, once, just above the form.

Two ways to find out where the current website stands, both free: run it
through Dental Website Review in ChatGPT yourself, or send the address and
we go through it by hand before replying. The second path is the contact
form, so there is still one button on the page; the first is a text link.
The human review is not sold as a product: it is what reaching out gets
you, and it makes the form worth filling in even for someone not ready to
buy.

Linen band between the cream Human section and the ink Contact section so
the eye lands on the button rather than a color change.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { Button } from '$lib/components/ui';

	const para = 'm-0 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay';
	const link =
		'text-root underline decoration-root/30 underline-offset-[3px] transition-colors hover:text-root-dark';
</script>

<section class="bg-linen section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="send" label="next step">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					Start with the website you have.
				</h2>
				<div class="flex flex-col gap-4">
					<p class={para}>
						Before anyone builds you anything, it’s worth knowing where your current site stands.
						Two ways to find out, both free.
					</p>
					<p class={para}>
						<strong class="font-medium text-charcoal">Check it yourself.</strong>
						<a href="/dental-website-review" class={link}>Dental Website Review</a> is the framework we
						review sites with, as a free ChatGPT plugin. Give it your address and it walks through your
						site as eight kinds of patient and tells you what to fix first. A few minutes, no sign-up,
						nobody calls you.
					</p>
					<p class={para}>
						<strong class="font-medium text-charcoal">Or have us look.</strong>
						Tell us about your practice and include your website. We go through it by hand, the same way,
						and come back with what we’d fix or what we’d build. No pitch deck, no obligation.
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
