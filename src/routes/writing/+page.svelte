<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { Hero, List } from '$lib/components/sections/writing';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Header currentPage="writing" />

<main id="main">
	<Hero />
	<List posts={data.posts} />
</main>

<Footer />
