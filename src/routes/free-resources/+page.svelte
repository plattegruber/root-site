<!--
@component
Free resources — a small catalogue of root's own tooling, released.

Hero (headline, framing, contents), then one feature section per tool,
alternating cream and linen. The eight-patients grid hangs off the Dental
Website Review feature, so it is rendered only when that tool is on the
page. The page ends on the ask: send us your site and we write back with
what we'd do, on the same ink band the homepage ends on.
-->
<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import { Hero, Feature, Patients, Pitch } from '$lib/components/sections/resources';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Header currentPage="resources" />

<main id="main">
	<Hero resources={data.resources} />
	{#each data.resources as tool, i (tool.id)}
		<Feature {tool} index={i + 1} flip={i % 2 === 1} tight={tool.id === 'dental-website-review'} />
		{#if tool.id === 'dental-website-review'}
			<Patients />
		{/if}
	{/each}
	<Pitch />
</main>

<Footer />
