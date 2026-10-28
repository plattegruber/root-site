<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { Hero, List } from '$lib/components/sections/resources';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Header currentPage="resources" />

<main id="main">
	<Hero />
	<List resources={data.resources} />
</main>

<Footer />
