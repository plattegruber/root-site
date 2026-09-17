<!--
@component
Homepage — sections sit on top of the global layout. The ink-colored
hero envelops the Header so the dark band reads as a single piece of
canvas rather than two stacked rectangles.

The argument runs: who it's for → the problem → what's included → why
solo → how it works → an example → the price → the person → the ask.
Band colors alternate cream / linen so each beat reads as its own.
-->
<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import {
		Hero,
		Problem,
		Included,
		WhySolo,
		HowItWorks,
		Demos,
		Pricing,
		Human,
		FinalCta,
		Contact
	} from '$lib/components/sections/home';
</script>

<div class="bg-ink">
	<Header dark currentPage="home" />
	<Hero />
</div>

<main id="main">
	<Problem />
	<Included />
	<WhySolo />
	<HowItWorks />
	<Demos />
	<Pricing />
	<Human />
	<FinalCta />
	<Contact />
</main>

<Footer />
