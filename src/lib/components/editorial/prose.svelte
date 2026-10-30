<!--
@component
Prose — long-form text (rendered Markdown or hand-written legal copy) in the
site's editorial typography, without the page needing to know heading levels.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="prose">
	{@render children()}
</div>

<style>
	/*
	 * Prose typography for the rendered Markdown body. Mirrors the rest
	 * of the design system: serif headings, sans body, mono code,
	 * warm-leather links.
	 *
	 * Scoped to this component (Svelte's :global escape hatch) so the
	 * tokens only apply inside <Prose>. Anything under a `.not-prose`
	 * element (the guide form card, figures) is left alone, so a
	 * component dropped into a post keeps its own spacing.
	 */
	.prose {
		font-family: var(--font-sans);
		font-size: 17px;
		line-height: 1.7;
		color: var(--color-charcoal);
		max-width: 640px;
	}

	.prose :global(p:not(.not-prose *)) {
		margin: 0 0 1.25rem;
	}

	.prose :global(h2:not(.not-prose *)) {
		margin: 2.5rem 0 1rem;
		font-family: var(--font-serif);
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1.3;
		letter-spacing: -0.01em;
		color: var(--color-ink);
	}

	.prose :global(h3:not(.not-prose *)) {
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

	.prose :global(a:not(.not-prose *)) {
		color: var(--color-root);
		text-decoration: underline;
		text-underline-offset: 2px;
		text-decoration-color: rgb(124 94 68 / 0.4);
		transition:
			color 150ms ease,
			text-decoration-color 150ms ease;
	}

	.prose :global(a:hover:not(.not-prose *)) {
		color: var(--color-root-dark);
		text-decoration-color: var(--color-root-dark);
	}

	.prose :global(ul:not(.not-prose *)),
	.prose :global(ol:not(.not-prose *)) {
		margin: 0 0 1.25rem;
		padding-left: 1.5rem;
	}

	.prose :global(li:not(.not-prose *)) {
		margin-bottom: 0.5rem;
	}

	.prose :global(blockquote:not(.not-prose *)) {
		margin: 1.75rem 0;
		padding-left: 1.25rem;
		border-left: 2px solid var(--color-stone);
		color: var(--color-clay);
		font-style: italic;
	}

	.prose :global(code:not(.not-prose *)) {
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

	/*
	 * Tables are authored as raw HTML in the Markdown (mdsvex doesn't parse
	 * GFM pipe tables). The wrapper scrolls horizontally on narrow phones so
	 * a wide pricing table never forces the whole page to overflow.
	 */
	.prose :global(.table-wrap) {
		margin: 1.75rem 0;
		overflow-x: auto;
	}

	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9375rem;
	}

	.prose :global(th),
	.prose :global(td) {
		padding: 0.625rem 0.875rem;
		text-align: left;
		vertical-align: top;
		border-bottom: 1px solid var(--color-stone);
	}

	.prose :global(th) {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: var(--color-clay);
	}

	.prose :global(thead th) {
		border-bottom-width: 2px;
	}
</style>
