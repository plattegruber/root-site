<!--
@component
Root layout — wraps every page with global styles, a skip link, and the
shared SEO defaults. Individual routes own their <Header /> and <Footer />
so dark-on-dark pages (homepage) can render the header inside the hero
section without a visual seam.
-->
<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { site } from '$lib/config/site';
	import { siteGraph, jsonLdScript } from '$lib/seo';

	let { children } = $props();

	const title = $derived(page.data?.title ?? site.title);
	const description = $derived(page.data?.description ?? site.description);
	const canonical = $derived(`${site.url}${page.url.pathname}`);

	// SEO fields a route can override via its load(); sensible site
	// defaults otherwise. `ogType` becomes "article" on blog posts (with
	// the published-time/author tags below), `noindex` keeps transactional
	// pages (e.g. /thanks) out of the index, and `jsonld` is a per-page
	// list of structured-data blocks (Article, BreadcrumbList) layered on
	// top of the sitewide Organization/WebSite graph.
	const ogType = $derived(page.data?.ogType ?? 'website');
	const ogImage = $derived(`${site.url}${page.data?.ogImage ?? '/og.png'}`);
	const ogImageAlt = $derived(page.data?.ogImageAlt ?? site.title);
	const noindex = $derived(page.data?.noindex === true);
	const publishedTime = $derived(page.data?.publishedTime as string | undefined);
	const pageJsonld = $derived((page.data?.jsonld ?? []) as Record<string, unknown>[]);
	const cfAnalyticsToken = env.PUBLIC_CF_ANALYTICS_TOKEN;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content={site.author} />
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content={site.locale} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={ogImageAlt} />
	{#if ogType === 'article'}
		<!-- Article-specific OG: lets social/AI parsers date and attribute the post. -->
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		<meta property="article:author" content={site.author} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={ogImageAlt} />

	<!--
		Structured data: sitewide Organization/WebSite, plus any per-page
		blocks. {@html} is required to inject a real <script type="ld+json">
		tag; the input is our own server-built data, and jsonLdScript()
		escapes `<` so a string value can't break out of the tag — so the
		no-at-html-tags warning is a false positive here.
	-->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdScript(siteGraph())}
	{#each pageJsonld as block, i (i)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdScript(block)}
	{/each}

	{#if cfAnalyticsToken}
		<!--
			Cloudflare Web Analytics — privacy-respecting, no cookies. The
			beacon is added only when PUBLIC_CF_ANALYTICS_TOKEN is set so
			local dev stays beacon-free and the build is one switch away
			from production telemetry.
		-->
		<script
			defer
			src="https://static.cloudflareinsights.com/beacon.min.js"
			data-cf-beacon={`{"token": "${cfAnalyticsToken}"}`}
		></script>
	{/if}
</svelte:head>

<a href="#main" class="skip-link">Skip to content</a>

{@render children()}
