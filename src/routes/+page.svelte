<!--
@component
Homepage — sections sit on top of the global layout. The ink-colored
hero envelops the Header so the dark band reads as a single piece of
canvas rather than two stacked rectangles.

The argument runs: idea → problem → answer → how → proof → ask.
-->
<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import {
		Hero,
		Position,
		Problem,
		Answer,
		HowItWorks,
		Demos,
		FinalCta,
		Contact
	} from '$lib/components/sections/home';
</script>

<div class="bg-ink">
	<Header dark currentPage="home" />
	<Hero />
</div>

<main id="main">
	<Position />
	<Problem />
	<Answer />
	<HowItWorks />
	<Demos />
	<FinalCta />
	<Contact />
</main>

<Footer />
