<!--
@component
Writing index — the long guides first, as cards, then every post as a
hairline list. Both lists come from the server load, which adds the
reading estimate to each post.
-->
<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { Hero, Pillars, List } from '$lib/components/sections/writing';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Header currentPage="writing" />

<main id="main">
	<Hero />
	<Pillars pillars={data.pillars} />
	<List posts={data.posts} />
</main>

<Footer />
