<!--
@component
Free resources hero — a mono eyebrow, a confident headline, the framing
paragraph, and a short contents list that jumps to each tool.

The paragraph does the positioning work for the whole page: these are
pieces of root's own tooling that stand on their own, and the parts that
only make sense together are what the service is. The contents list is
there so the page reads as a small catalogue rather than a lone list.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import type { Resource } from '$lib/config/resources';

	type Props = { resources: Resource[] };

	let { resources }: Props = $props();
</script>

<section class="hero-py" style="padding-bottom: var(--section-sm-v-padding)">
	<Container wide>
		<div class="mb-[26px] font-mono text-[13px] tracking-[0.04em] text-root-light">
			Free resources · from root’s own workbench
		</div>
		<h1 class="m-0 max-w-[760px] font-serif text-hero font-normal text-balance text-ink">
			The guide and the tools we use on every dental site. Free for anyone.
		</h1>
		<p class="mt-7 mb-0 max-w-[580px] font-sans text-hero-sub text-pretty text-clay">
			Everything here began as something we built to do our own job better: making a practice’s
			website work for the people who actually visit it. Each one turned out to stand on its own, so
			we opened it up. Start with the guide if you want the thinking; use the tools on your site, on
			a client’s, or just to see how we work.
		</p>

		<ol class="mt-12 flex max-w-[640px] list-none flex-col border-t border-stone p-0">
			{#each resources as tool, i (tool.id)}
				<li class="border-b border-stone">
					<a
						href={`#${tool.id}`}
						class="group flex items-baseline gap-5 py-4 no-underline transition-colors duration-150"
					>
						<span class="w-6 shrink-0 font-mono text-[13px] text-root-light"
							>{String(i + 1).padStart(2, '0')}</span
						>
						<span class="font-serif text-[22px] leading-[1.3] text-ink group-hover:text-root"
							>{tool.name}</span
						>
						<span class="ml-auto hidden shrink-0 font-mono text-[12px] text-drift sm:inline"
							>{tool.kind}</span
						>
						<span
							aria-hidden="true"
							class="shrink-0 font-sans text-[15px] text-drift transition-transform duration-150 group-hover:translate-y-0.5 group-hover:text-root"
							>↓</span
						>
					</a>
				</li>
			{/each}
		</ol>
	</Container>
</section>
