<!--
@component
Resource feature — one tool, presented like a product: a framed mockup on
one side, and on the other the name, the one-line promise, the blurb, a
short list of specifics, and the way in.

`index` numbers the section (01, 02) to match the contents list in the
hero; `tight` trims the bottom padding when something (the patients grid) hangs
off the section. `flip` swaps the columns and sits the section on linen so two
features in a row read as two beats rather than one long block. The image
comes first on narrow screens, because it is the quickest way to get what
the tool is; on wide screens it pushes past the page rail into the margin,
so the picture is the biggest thing in the section. A tool that hasn't shipped shows its status as a pill and a
secondary button to its page here, so there is somewhere to send people
today.
-->
<script lang="ts">
	import { Button, Container } from '$lib/components/ui';
	import type { Resource } from '$lib/config/resources';
	import { cn } from '$lib/utils';

	type Props = { tool: Resource; index: number; flip?: boolean; tight?: boolean };

	let { tool, index, flip = false, tight = false }: Props = $props();

	const external = $derived(/^https?:\/\//.test(tool.href));
	const number = $derived(String(index).padStart(2, '0'));
</script>

<section
	id={tool.id}
	class={cn('scroll-mt-6', tight ? 'section-tight-py' : 'section-py', flip && 'bg-linen')}
>
	<Container wide>
		<div class="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-x-14">
			<figure
				class={cn(
					'm-0 md:col-span-7',
					flip ? 'md:order-1 xl:-ml-[88px]' : 'md:order-2 xl:-mr-[88px]'
				)}
			>
				<div
					class={cn(
						'overflow-hidden rounded-md border border-stone shadow-[0_32px_64px_-40px_rgba(26,23,21,0.35)]',
						flip ? 'bg-cream' : 'bg-linen'
					)}
				>
					<img
						src={tool.image.src}
						alt={tool.image.alt}
						width={tool.image.width}
						height={tool.image.height}
						loading={index === 1 ? 'eager' : 'lazy'}
						decoding="async"
						class="block h-auto w-full"
					/>
				</div>
			</figure>

			<div class={cn('md:col-span-5', flip ? 'md:order-2' : 'md:order-1')}>
				<div class="mb-5 flex items-center gap-3 font-mono text-[13px] tracking-[0.03em]">
					<span class="text-root-light">{number}</span>
					<span class="h-px w-6 bg-stone"></span>
					<span class="text-drift">{tool.kind}</span>
				</div>

				<h2
					class="m-0 font-serif text-[36px] leading-[1.1] font-normal tracking-[-0.015em] text-ink"
				>
					{tool.name}
				</h2>
				<p
					class="mt-3 mb-0 max-w-[440px] font-sans text-[19px] leading-[1.45] text-pretty text-ink"
				>
					{tool.tagline}
				</p>
				<p
					class="mt-5 mb-0 max-w-[460px] font-sans text-[15px] leading-[1.6] text-pretty text-clay"
				>
					{tool.blurb}
				</p>

				<ul class="mt-7 mb-0 flex max-w-[460px] list-none flex-col border-t border-stone p-0">
					{#each tool.details as detail (detail)}
						<li class="flex gap-4 border-b border-stone py-3.5">
							<span
								aria-hidden="true"
								class="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-root-light"
							></span>
							<span class="font-sans text-[14.5px] leading-[1.55] text-pretty text-clay"
								>{detail}</span
							>
						</li>
					{/each}
				</ul>

				<div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
					{#if tool.status === 'live'}
						<Button
							href={tool.href}
							target={external ? '_blank' : undefined}
							rel={external ? 'noopener noreferrer' : undefined}
						>
							{tool.cta}
							<span aria-hidden="true">{external ? '↗' : '→'}</span>
						</Button>
					{:else}
						<Button href={tool.href} variant="secondary">
							{tool.cta}
							<span aria-hidden="true">→</span>
						</Button>
						<span
							class="inline-flex items-center gap-2 rounded-full border border-stone px-3 py-1.5 font-mono text-[12px] tracking-[0.02em] text-clay"
						>
							<span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-root-light"></span>
							{tool.statusLabel ?? 'Coming soon'}
						</span>
					{/if}
					{#if tool.more}
						<a
							href={tool.more.href}
							class="font-sans text-[15px] font-medium text-root underline decoration-root/30 underline-offset-[3px] transition-colors duration-150 hover:text-root-dark"
							>{tool.more.label} →</a
						>
					{/if}
				</div>
			</div>
		</div>
	</Container>
</section>
