<!--
@component
Homepage — sections sit on top of the global layout. The ink-colored
hero envelops the Header so the dark band reads as a single piece of
canvas rather than two stacked rectangles.
-->
<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import {
		Hero,
		Pitch,
		Pricing,
		GettingFound,
		Process,
		Demos,
		Contact
	} from '$lib/components/sections/home';
</script>

<div class="bg-ink">
	<Header dark currentPage="home" />
	<Hero />
</div>

<main id="main">
	<Pitch />
	<Pricing />
	<GettingFound />
	<Process />
	<Demos />
	<Contact />
</main>

<Footer />
