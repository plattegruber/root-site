<!--
@component
Free resources list — one row per tool, separated by hairlines, in the
same editorial rhythm as the demos and writing lists.

The row is a div rather than one big link because a row can carry two
links: the tool itself and an optional "more" link (an announcement post).
External tools open in a new tab and show the ↗; a tool that hasn't
shipped yet shows its status in place of the arrow and still links to its
page on this site, so there is somewhere to send people today.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import type { Resource } from '$lib/config/resources';

	type Props = { resources: Resource[] };

	let { resources }: Props = $props();

	const isExternal = (href: string) => /^https?:\/\//.test(href);
</script>

<section style="padding-bottom: var(--section-v-padding)">
	<Container>
		<ul class="m-0 flex list-none flex-col p-0">
			{#each resources as tool (tool.name)}
				<li class="border-t border-stone py-7">
					<span class="mb-2 block font-mono text-[13px] text-drift">{tool.kind}</span>
					<h2 class="m-0 mb-2 font-serif text-[22px] leading-[1.3] font-normal text-ink">
						<a
							href={tool.href}
							target={isExternal(tool.href) ? '_blank' : undefined}
							rel={isExternal(tool.href) ? 'noopener noreferrer' : undefined}
							class="group inline-flex items-center gap-2 text-ink no-underline transition-colors duration-150 hover:text-root"
						>
							{tool.name}
							{#if tool.status === 'live'}
								<span
									aria-hidden="true"
									class="font-sans text-[15px] text-drift transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-root"
									>{isExternal(tool.href) ? '↗' : '→'}</span
								>
							{/if}
						</a>
					</h2>
					{#if tool.status === 'soon'}
						<p class="m-0 mb-2 font-sans text-[13px] text-drift">
							{tool.statusLabel ?? 'Coming soon'}
						</p>
					{/if}
					<p class="m-0 max-w-[560px] font-sans text-[15px] leading-[1.55] text-clay">
						{tool.blurb}
					</p>
					{#if tool.more}
						<p class="m-0 mt-3 font-sans text-[14px]">
							<a
								href={tool.more.href}
								class="text-clay underline decoration-stone underline-offset-4 transition-colors duration-150 hover:text-ink hover:decoration-ink"
								>{tool.more.label}</a
							>
						</p>
					{/if}
				</li>
			{/each}
		</ul>

		<div class="mt-10 border-t border-stone pt-7">
			<p class="m-0 max-w-[560px] font-sans text-[15px] leading-[1.55] text-clay">
				The rest is what the monthly service is for.
				<a
					href="/whats-included"
					class="text-ink underline decoration-stone underline-offset-4 transition-colors duration-150 hover:decoration-ink"
					>See what’s included →</a
				>
			</p>
		</div>
	</Container>
</section>
