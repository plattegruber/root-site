<!--
@component
Dental Website Review — shared frame for the ChatGPT plugin's public pages
(overview, support, privacy, terms). OpenAI's plugin directory links to
each of these, so they share a small section nav back to one another.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { Header, Footer } from '$lib/components/layout';
	import { Container } from '$lib/components/ui';

	let { children }: { children: Snippet } = $props();

	const sections = [
		{ label: 'Overview', href: '/dental-website-review' },
		{ label: 'Support', href: '/dental-website-review/support' },
		{ label: 'Privacy', href: '/dental-website-review/privacy' },
		{ label: 'Terms', href: '/dental-website-review/terms' }
	];
</script>

<Header />

<main id="main">
	<article class="section-py">
		<Container>
			<nav aria-label="Dental Website Review" class="mb-10 font-mono text-[13px]">
				<ul class="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
					{#each sections as s (s.href)}
						<li>
							<a
								href={s.href}
								aria-current={page.url.pathname === s.href ? 'page' : undefined}
								class="text-clay no-underline transition-colors hover:text-charcoal aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:underline-offset-4"
								>{s.label}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
			{@render children()}
		</Container>
	</article>
</main>

<Footer />
