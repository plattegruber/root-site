<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { Hero, List } from '$lib/components/sections/demos';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Header currentPage="demos" />

<main id="main">
	<Hero />
	<List demos={data.demos} />
</main>

<Footer />
