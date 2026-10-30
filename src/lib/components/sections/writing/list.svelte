<!--
@component
Writing list — every post, newest first, separated by hairlines.

No thumbnails, no card chrome: a date and reading time, a title, an
excerpt. Pillar guides, which also lead the page as cards, keep their
place in the archive here with a small badge so the chronology stays
complete. The title flips to the warm accent on hover.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import type { PostCard } from '$lib/config/blog';

	type Props = { posts: PostCard[]; heading?: string };

	let { posts, heading = 'All writing' }: Props = $props();
</script>

<section style="padding-bottom: var(--section-v-padding)">
	<Container>
		<div class="mb-2 flex items-baseline justify-between gap-4">
			<h2 class="m-0 font-serif text-[22px] leading-[1.3] font-normal text-ink">{heading}</h2>
			<span class="font-mono text-[12px] tracking-[0.03em] text-drift">{posts.length} posts</span>
		</div>
		<ul class="m-0 flex list-none flex-col p-0">
			{#each posts as post (post.slug)}
				<li>
					<a
						href={`/writing/${post.slug}`}
						class="group block border-t border-stone py-7 no-underline"
					>
						<p
							class="m-0 mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-drift"
						>
							<time datetime={post.date}>{post.dateDisplay}</time>
							<span aria-hidden="true">·</span>
							<span>{post.minutes} min read</span>
							{#if post.pillar}
								<span
									class="rounded-full border border-root-light/50 px-2 py-px text-[10.5px] tracking-[0.06em] text-root uppercase"
									>Pillar guide</span
								>
							{/if}
						</p>
						<h3
							class="m-0 mb-2 font-serif text-[22px] leading-[1.3] font-normal text-ink transition-colors duration-150 group-hover:text-root"
						>
							{post.title}
						</h3>
						<p class="m-0 max-w-[520px] font-sans text-[15px] leading-[1.55] text-clay">
							{post.excerpt}
						</p>
					</a>
				</li>
			{/each}
		</ul>
	</Container>
</section>
