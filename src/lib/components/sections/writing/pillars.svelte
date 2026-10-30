<!--
@component
Pillars — the long guides, up front.

The newest pillar leads as a wide feature (image beside the words); the
rest sit under it as cards. Each carries its reading time, because the
point of a pillar is that it is the long, kept-current answer, and a
number says that better than the word "guide" does. Rendered only when
at least one post has `pillar: true`.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import type { PostCard } from '$lib/config/blog';

	type Props = { pillars: PostCard[] };

	let { pillars }: Props = $props();

	const lead = $derived(pillars[0]);
	const rest = $derived(pillars.slice(1));

	const kicker =
		'flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] tracking-[0.03em]';
	const frame =
		'block overflow-hidden rounded-md border border-stone bg-linen transition-[border-color,transform] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-drift';
</script>

{#if lead}
	<section style="padding-bottom: var(--section-v-padding)">
		<Container wide>
			<div class="mb-7 flex items-center gap-3 font-mono text-[13px] tracking-[0.03em]">
				<span class="shrink-0 whitespace-nowrap text-root-light">Start here</span>
				<span class="h-px w-6 shrink-0 bg-stone"></span>
				<span class="text-drift">The long guides, kept current</span>
			</div>

			<a
				href={`/writing/${lead.slug}`}
				class="group grid grid-cols-1 gap-7 border-t border-stone pt-8 no-underline md:grid-cols-12 md:items-center md:gap-x-12"
			>
				<figure class="m-0 md:col-span-7">
					<span class={frame}>
						<img
							src={lead.image ?? '/og.png'}
							alt={lead.imageAlt ?? ''}
							width="1200"
							height="630"
							decoding="async"
							class="block h-auto w-full"
						/>
					</span>
				</figure>
				<div class="md:col-span-5">
					<p class={`${kicker} m-0 text-drift`}>
						<span class="text-root">Pillar guide</span>
						<span aria-hidden="true">·</span>
						<span>{lead.minutes} min read</span>
						{#if lead.updated !== lead.date}
							<span aria-hidden="true">·</span>
							<span>Updated {lead.updatedDisplay}</span>
						{/if}
					</p>
					<h2
						class="mt-3 mb-0 font-serif text-[32px] leading-[1.15] font-normal tracking-[-0.015em] text-balance text-ink transition-colors duration-150 group-hover:text-root"
					>
						{lead.title}
					</h2>
					<p class="mt-4 mb-0 font-sans text-[16px] leading-[1.6] text-pretty text-clay">
						{lead.excerpt}
					</p>
					<p class="mt-5 mb-0 font-sans text-[15px] font-medium text-root">
						Read the guide <span aria-hidden="true">→</span>
					</p>
				</div>
			</a>

			{#if rest.length}
				<ul
					class="m-0 mt-10 grid list-none grid-cols-1 gap-x-8 gap-y-10 border-t border-stone p-0 pt-8 sm:grid-cols-2 lg:grid-cols-3"
				>
					{#each rest as post (post.slug)}
						<li>
							<a href={`/writing/${post.slug}`} class="group block no-underline">
								<span class={frame}>
									<img
										src={post.image ?? '/og.png'}
										alt={post.imageAlt ?? ''}
										width="1200"
										height="630"
										loading="lazy"
										decoding="async"
										class="block h-auto w-full"
									/>
								</span>
								<p class={`${kicker} mt-4 mb-0 text-drift`}>
									<span class="text-root">Pillar guide</span>
									<span aria-hidden="true">·</span>
									<span>{post.minutes} min read</span>
								</p>
								<h3
									class="mt-2 mb-0 font-serif text-[22px] leading-[1.25] font-normal text-balance text-ink transition-colors duration-150 group-hover:text-root"
								>
									{post.title}
								</h3>
								<p class="mt-2 mb-0 font-sans text-[14.5px] leading-[1.55] text-clay">
									{post.excerpt}
								</p>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</Container>
	</section>
{/if}
