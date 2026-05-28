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
	import { site } from '$lib/config/site';

	let { children } = $props();

	const title = $derived(page.data?.title ?? site.title);
	const description = $derived(page.data?.description ?? site.description);
	const canonical = $derived(`${site.url}${page.url.pathname}`);
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

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>

<a href="#main" class="skip-link">Skip to content</a>

{@render children()}
