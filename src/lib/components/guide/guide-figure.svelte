<!--
@component
GuideFigure — one or two pages of the guide, shown as paper on a linen
mat with a caption underneath. Used inside the pillar post so a reader
sees the actual spreads before deciding whether to ask for the PDF.

Each page is a render from scripts/generate-guide-pages.mjs (816×1056
US Letter, so every image shares the 1224×1584 size). Two pages sit side
by side from `sm` up and stack on phones.
-->
<script lang="ts">
	type Page = { src: string; alt: string; n: number };
	type Props = { pages: Page[]; caption?: string };

	let { pages, caption }: Props = $props();
</script>

<figure class="not-prose my-10">
	<div
		class="grid gap-5 rounded-md border border-stone bg-linen p-5 sm:p-7"
		style={`grid-template-columns: repeat(${pages.length}, minmax(0, 1fr))`}
	>
		{#each pages as page (page.src)}
			<div class="relative">
				<img
					src={page.src}
					alt={page.alt}
					width="1224"
					height="1584"
					loading="lazy"
					decoding="async"
					class="block h-auto w-full rounded-[3px] shadow-[0_24px_40px_-24px_rgba(26,23,21,0.5)]"
				/>
				<span
					class="absolute -top-2.5 -left-2 rounded-full bg-ink px-2 py-0.5 font-mono text-[11px] tracking-[0.03em] text-cream"
					aria-hidden="true">p. {page.n}</span
				>
			</div>
		{/each}
	</div>
	{#if caption}
		<figcaption class="mt-3 font-sans text-[14px] leading-[1.5] text-clay">{caption}</figcaption>
	{/if}
</figure>

<style>
	@media (max-width: 480px) {
		figure > div {
			grid-template-columns: minmax(0, 1fr) !important;
		}
	}
</style>
