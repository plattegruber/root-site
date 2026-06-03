<!--
@component
Demos list — example practices separated by hairlines.

Mirrors the writing list's editorial rhythm: a category, a name, a blurb.
Live demos are links that open the practice site in a new tab; entries still
in progress render as a muted, non-interactive row so the shape of what's
coming is visible without a dead link.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import type { Demo } from '$lib/config/demos';

	type Props = { demos: Demo[] };

	let { demos }: Props = $props();
</script>

<section style="padding-bottom: var(--section-v-padding)">
	<Container>
		<ul class="m-0 flex list-none flex-col p-0">
			{#each demos as demo (demo.name)}
				<li>
					{#if demo.url && !demo.comingSoon}
						<a
							href={demo.url}
							target="_blank"
							rel="noopener noreferrer"
							class="group block border-t border-stone py-7 no-underline"
						>
							<span class="mb-2 block font-mono text-[13px] text-drift">{demo.category}</span>
							<h2
								class="m-0 mb-2 flex items-center gap-2 font-serif text-[22px] leading-[1.3] font-normal text-ink transition-colors duration-150 group-hover:text-root"
							>
								{demo.name}
								<span
									aria-hidden="true"
									class="font-sans text-[15px] text-drift transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-root"
									>↗</span
								>
							</h2>
							<p class="m-0 max-w-[520px] font-sans text-[15px] leading-[1.55] text-clay">
								{demo.blurb}
							</p>
						</a>
					{:else}
						<div class="block border-t border-stone py-7">
							<span class="mb-2 block font-mono text-[13px] text-drift">{demo.category}</span>
							<h2 class="m-0 mb-2 font-serif text-[22px] leading-[1.3] font-normal text-drift">
								{demo.name}
							</h2>
							<p class="m-0 max-w-[520px] font-sans text-[15px] leading-[1.55] text-drift">
								{demo.blurb}
							</p>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</Container>
</section>
