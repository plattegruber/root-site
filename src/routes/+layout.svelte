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

	let { children } = $props();

	const title = $derived(page.data?.title ?? site.title);
	const description = $derived(page.data?.description ?? site.description);
	const canonical = $derived(`${site.url}${page.url.pathname}`);
	const ogImage = `${site.url}/og.png`;
	const cfAnalyticsToken = env.PUBLIC_CF_ANALYTICS_TOKEN;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content={site.author} />
	<link rel="canonical" href={canonical} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content={site.locale} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="root. — Websites for dental practices" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

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
