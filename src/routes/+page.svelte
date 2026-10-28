<!--
@component
Homepage — sections sit on top of the global layout. The ink-colored
hero envelops the Header so the dark band reads as a single piece of
canvas rather than two stacked rectangles.

The argument runs: who it's for and the relief of having it handled → the
work itself, before any claims → how we think about a dental site → why
root is small on purpose → the person who does the work → what's handled
→ the price (which should land as a pleasant surprise by now) → the ask.
Band colors alternate cream / linen so each beat reads as its own.
-->
<script lang="ts">
	import { Header, Footer } from '$lib/components/layout';
	import {
		Hero,
		Demos,
		Care,
		WhySolo,
		Human,
		Included,
		Pricing,
		FinalCta,
		Contact
	} from '$lib/components/sections/home';
</script>

<div class="bg-ink">
	<Header dark currentPage="home" />
	<Hero />
</div>

<main id="main">
	<Demos />
	<Care />
	<WhySolo />
	<Human />
	<Included />
	<Pricing />
	<FinalCta />
	<Contact />
</main>

<Footer />
