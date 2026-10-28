<!--
@component
Post detail — one Markdown post rendered as a long-form article.

Layout: same header/footer as the rest of the site. The article body
uses the shared Prose treatment so the mdsvex output (h1-h4, p, ul, ol,
blockquote, code, a) reads as continuous editorial text without the
section having to know about heading levels in advance.
-->
<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { Container } from '$lib/components/ui';
	import { Prose } from '$lib/components/editorial';
	import { site } from '$lib/config/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { post, Body } = $derived(data);
</script>

<Header currentPage="writing" />

<main id="main">
	<article class="section-py">
		<Container>
			<header class="mb-10">
				<time datetime={post.date} class="mb-3 block font-mono text-[13px] text-drift">
					{post.dateDisplay}
				</time>
				<h1
					class="m-0 font-serif text-[36px] leading-[1.15] font-normal tracking-[-0.015em] text-ink"
				>
					{post.title}
				</h1>
				<p class="mt-4 mb-0 font-sans text-[14px] leading-[1.5] text-clay">
					By <a
						href="/about"
						rel="author"
						class="text-charcoal underline decoration-stone underline-offset-[3px] transition-colors hover:text-root"
						>{site.person.name}</a
					>, {site.person.jobTitle.toLowerCase()} of root.
					{#if post.updated !== post.date}
						<span class="text-drift">
							· Updated <time datetime={post.updated}>{post.updatedDisplay}</time></span
						>
					{/if}
				</p>
			</header>

			<Prose>
				<Body />
			</Prose>

			<footer class="mt-16 border-t border-stone pt-8">
				<a
					href="/writing"
					class="font-sans text-[15px] text-clay no-underline transition-colors hover:text-charcoal"
				>
					← All writing
				</a>
			</footer>
		</Container>
	</article>
</main>

<Footer />
