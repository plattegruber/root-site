<!--
@component
About story — origin story with a 200×240 portrait alongside.

If `site.about.photo.src` is set, renders the photo (lazy-loaded, with
explicit dimensions to prevent layout shift). Otherwise renders a calm
linen-colored placeholder so the page composition is intact.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import { site } from '$lib/config/site';

	const photo = site.about.photo;
</script>

<section style="padding-bottom: var(--section-v-padding)">
	<Container>
		<div class="flex flex-wrap items-start gap-12">
			{#if photo.src}
				<img
					src={photo.src}
					alt={photo.alt}
					width="200"
					height="240"
					loading="lazy"
					decoding="async"
					class="h-[240px] w-[200px] shrink-0 rounded-md border border-stone object-cover"
				/>
			{:else}
				<div
					class="flex h-[240px] w-[200px] shrink-0 items-center justify-center rounded-md border border-stone bg-linen"
					aria-label="Photo placeholder"
					role="img"
				>
					<span class="px-4 text-center font-sans text-[13px] leading-[1.4] text-drift">
						Your photo here
					</span>
				</div>
			{/if}

			<div class="min-w-[280px] flex-1">
				<div class="flex flex-col gap-4">
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-charcoal">
						I started root because dental websites were getting the worst of the web.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						Overpriced agencies. Cookie-cutter templates. “Patient acquisition strategies.” Dentists
						were paying thousands for websites that looked like every other dentist’s website.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						I figured I could do better. Build each site by hand, charge a fair price, and skip all
						the noise. So I did.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						For a long time that was the whole story — just the website, nothing else. But “patient
						acquisition strategy” was never the problem. The problem was the markup, the jargon, and
						the agencies charging four grand a month to do it badly. Helping a practice actually get
						found is fine. So now, for the practices that want it, I do that too — same as
						everything else: by hand, fair price, no noise.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						I’m still one person, and I plan to keep it that way.
					</p>
				</div>
			</div>
		</div>
	</Container>
</section>
