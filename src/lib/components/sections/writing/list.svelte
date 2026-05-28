<!--
@component
Writing list — editorial post links separated by hairlines.

No thumbnails, no card chrome. Each post is a date, a title, an excerpt;
the title flips to the warm accent on hover so the row feels alive without
visual noise.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import type { PostSummary } from '$lib/config/blog';

	type Props = { posts: PostSummary[] };

	let { posts }: Props = $props();
</script>

<section style="padding-bottom: var(--section-v-padding)">
	<Container>
		<ul class="m-0 flex list-none flex-col p-0">
			{#each posts as post (post.slug)}
				<li>
					<a
						href={`/writing/${post.slug}`}
						class="group block border-t border-stone py-7 no-underline"
					>
						<time datetime={post.date} class="mb-2 block font-mono text-[13px] text-drift">
							{post.dateDisplay}
						</time>
						<h2
							class="m-0 mb-2 font-serif text-[22px] leading-[1.3] font-normal text-ink transition-colors duration-150 group-hover:text-root"
						>
							{post.title}
						</h2>
						<p class="m-0 max-w-[520px] font-sans text-[15px] leading-[1.55] text-clay">
							{post.excerpt}
						</p>
					</a>
				</li>
			{/each}
		</ul>
	</Container>
</section>
