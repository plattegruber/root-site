<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { Hero, List, FAQ, CTA } from '$lib/components/sections/included';
</script>

<Header currentPage="included" />

<main id="main">
	<Hero />
	<List />
	<FAQ />
	<CTA />
</main>

<Footer />
