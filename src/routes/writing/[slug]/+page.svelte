<!--
@component
Post detail — one Markdown post rendered as a long-form article.

Layout: same header/footer as the rest of the site. The article body
uses a scoped .prose treatment so the mdsvex output (h1-h4, p, ul, ol,
blockquote, code, a) reads as continuous editorial text without the
section having to know about heading levels in advance.
-->
<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { Container } from '$lib/components/ui';
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
			</header>

			<div class="prose">
				<Body />
			</div>

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

<style>
	/*
	 * Prose typography for the rendered Markdown body. Mirrors the rest
	 * of the design system: serif headings, sans body, mono code,
	 * warm-leather links.
	 *
	 * Scoped to this component (Svelte's :global escape hatch) so the
	 * tokens don't leak to other Markdown the project might render
	 * later (e.g. an MDX-backed About page).
	 */
	.prose {
		font-family: var(--font-sans);
		font-size: 17px;
		line-height: 1.7;
		color: var(--color-charcoal);
		max-width: 640px;
	}

	.prose :global(p) {
		margin: 0 0 1.25rem;
	}

	.prose :global(h2) {
		margin: 2.5rem 0 1rem;
		font-family: var(--font-serif);
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1.3;
		letter-spacing: -0.01em;
		color: var(--color-ink);
	}

	.prose :global(h3) {
		margin: 2rem 0 0.75rem;
		font-family: var(--font-serif);
		font-size: 1.25rem;
		font-weight: 400;
		line-height: 1.35;
		color: var(--color-ink);
	}

	.prose :global(strong) {
		font-weight: 600;
		color: var(--color-ink);
	}

	.prose :global(em) {
		font-style: italic;
	}

	.prose :global(a) {
		color: var(--color-root);
		text-decoration: underline;
		text-underline-offset: 2px;
		text-decoration-color: rgb(124 94 68 / 0.4);
		transition:
			color 150ms ease,
			text-decoration-color 150ms ease;
	}

	.prose :global(a:hover) {
		color: var(--color-root-dark);
		text-decoration-color: var(--color-root-dark);
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1.25rem;
		padding-left: 1.5rem;
	}

	.prose :global(li) {
		margin-bottom: 0.5rem;
	}

	.prose :global(blockquote) {
		margin: 1.75rem 0;
		padding-left: 1.25rem;
		border-left: 2px solid var(--color-stone);
		color: var(--color-clay);
		font-style: italic;
	}

	.prose :global(code) {
		background: var(--color-linen);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.875em;
	}

	.prose :global(pre) {
		margin: 1.5rem 0;
		padding: 1rem 1.25rem;
		background: var(--color-linen);
		border: 1px solid var(--color-stone);
		border-radius: 6px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.prose :global(pre code) {
		background: none;
		padding: 0;
	}
</style>
