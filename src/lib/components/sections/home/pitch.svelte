<!--
@component
Pitch — why a website matters, the free-mockup offer, and a single call to
action. Leads with the patient's quiet look-up rather than the service spec;
the "what's included" detail lives in the Pricing section below.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { Button } from '$lib/components/ui';
</script>

<section class="section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="door-open" label="why it matters">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					Most patients look you up before they ever call.
				</h2>
				<p class="mb-8 max-w-[520px] font-sans text-hero-sub text-clay">
					A calm, clear website is what turns that quiet look into a booking — and makes your
					practice look like the place it already is. That’s the whole job, and it’s all I do.
				</p>
				<p class="mb-8 max-w-[520px] font-sans text-hero-sub font-medium text-ink">
					I’ll mock up your website for free.
				</p>
				<Button href="#contact">
					Get a free mockup
					<span aria-hidden="true">→</span>
				</Button>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
