<!--
@component
About story — photo placeholder beside a four-paragraph origin story.

Photo placeholder is sized to match the design's 200×240 frame. When the
real headshot lands, replace the inner span with an `<img>` and an alt
description.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
</script>

<section style="padding-bottom: var(--section-v-padding)">
	<Container>
		<div class="flex flex-wrap items-start gap-12">
			<div
				class="flex h-[240px] w-[200px] shrink-0 items-center justify-center rounded-md border border-stone bg-linen"
				aria-label="Photo placeholder"
				role="img"
			>
				<span
					class="px-4 text-center font-sans text-[13px] leading-[1.4] text-drift"
				>
					Your photo here
				</span>
			</div>

			<div class="min-w-[280px] flex-1">
				<div class="flex flex-col gap-4">
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-charcoal">
						I started root because dental websites were getting the worst of
						the web.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						Overpriced agencies. Cookie-cutter templates. “Patient acquisition
						strategies.” Dentists were paying thousands for websites that
						looked like every other dentist’s website.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						I figured I could do better. Build each site by hand, charge a
						fair price, and skip all the noise. So I did.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						I’ve built websites for practices in 14 states. I’m still one
						person, and I plan to keep it that way.
					</p>
				</div>
			</div>
		</div>
	</Container>
</section>
