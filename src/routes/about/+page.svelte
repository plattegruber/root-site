<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import {
		Hero,
		Story,
		Process,
		CTA
	} from '$lib/components/sections/about';
</script>

<Header currentPage="about" />

<main id="main">
	<Hero />
	<Story />
	<Process />
	<CTA />
</main>

<Footer />
