<!--
@component
Homepage — sections sit on top of the global layout. The ink-colored
hero envelops the Header so the dark band reads as a single piece of
canvas rather than two stacked rectangles.

The argument runs: the promise → the problem → what's included → why
solo → how it works → an example → the price → the person → the ask (check
your current site for free, or have me look). Band colors alternate
cream / linen so each beat reads as its own. The homepage speaks in the
first person, like the About page: root is one person, and the offer is
that person.
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
