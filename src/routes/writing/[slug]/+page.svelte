<!--
@component
Post detail — one Markdown post rendered as a long-form article.

Layout: same header/footer as the rest of the site. The article body
uses the shared Prose treatment so the mdsvex output (h1-h4, p, ul, ol,
blockquote, code, a) reads as continuous editorial text without the
section having to know about heading levels in advance.

Above the title: the date, the reading time and, on pillar guides, a
badge. Pillar guides also get an "In this guide" contents box between
the header image and the body (the h2 list comes from the server load,
the ids from the rehype plugin in svelte.config.js). Every post ends on
"Keep reading": the author's picks, else the other pillar guides.
-->
<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { Container } from '$lib/components/ui';
	import { Prose } from '$lib/components/editorial';
	import { site } from '$lib/config/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { post, Body, minutes, headings, related } = $derived(data);
</script>

<Header currentPage="writing" />

<main id="main">
	<article class="section-py">
		<Container>
			<header class="mb-10">
				<p
					class="m-0 mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-drift"
				>
					{#if post.pillar}
						<span
							class="rounded-full border border-root-light/50 px-2.5 py-px text-[10.5px] tracking-[0.06em] text-root uppercase"
							>Pillar guide</span
						>
					{/if}
					<time datetime={post.date}>{post.dateDisplay}</time>
					<span aria-hidden="true">·</span>
					<span>{minutes} min read</span>
				</p>
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

			{#if post.image}
				<figure class="m-0 mb-10 overflow-hidden rounded-md border border-stone bg-linen">
					<img
						src={post.image}
						alt={post.imageAlt ?? ''}
						width="1200"
						height="630"
						decoding="async"
						class="block h-auto w-full"
					/>
				</figure>
			{/if}

			{#if post.pillar && headings.length > 1}
				<nav
					aria-label="In this guide"
					class="mb-10 max-w-[640px] rounded-md border border-stone bg-linen px-6 py-5"
				>
					<p class="m-0 font-mono text-[12px] tracking-[0.04em] text-root-light uppercase">
						In this guide
					</p>
					<ol class="m-0 mt-3 flex list-none flex-col gap-1.5 p-0">
						{#each headings as h, i (h.id)}
							<li class="flex gap-3 font-sans text-[15px] leading-[1.5]">
								<span class="w-5 shrink-0 font-mono text-[12px] text-drift" aria-hidden="true"
									>{String(i + 1).padStart(2, '0')}</span
								>
								<a
									href={`#${h.id}`}
									class="text-charcoal no-underline transition-colors hover:text-root">{h.text}</a
								>
							</li>
						{/each}
					</ol>
				</nav>
			{/if}

			<Prose>
				<Body />
			</Prose>

			<footer class="mt-16 border-t border-stone pt-8">
				{#if related.length}
					<h2 class="m-0 font-serif text-[22px] leading-[1.3] font-normal text-ink">
						Keep reading
					</h2>
					<ul class="m-0 mt-2 flex list-none flex-col p-0">
						{#each related as r (r.slug)}
							<li>
								<a
									href={`/writing/${r.slug}`}
									class="group block border-t border-stone py-5 no-underline"
								>
									<p
										class="m-0 mb-1 flex flex-wrap items-center gap-x-3 font-mono text-[12px] text-drift"
									>
										{#if r.pillar}<span class="text-root">Pillar guide</span><span
												aria-hidden="true">·</span
											>{/if}
										<span>{r.minutes} min read</span>
									</p>
									<h3
										class="m-0 font-serif text-[20px] leading-[1.3] font-normal text-ink transition-colors duration-150 group-hover:text-root"
									>
										{r.title}
									</h3>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
				<p class="mt-8 mb-0">
					<a
						href="/writing"
						class="font-sans text-[15px] text-clay no-underline transition-colors hover:text-charcoal"
					>
						← All writing
					</a>
				</p>
			</footer>
		</Container>
	</article>
</main>

<Footer />
