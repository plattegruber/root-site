<!--
@component
Thanks — destination of the no-JS form submission. Stays calm to match
the in-place confirmation the JS path renders.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import { Header, Footer } from '$lib/components/layout';
</script>

<div class="bg-ink">
	<Header dark />
</div>

<main id="main" class="section-py bg-ink">
	<Container>
		<h1 class="mb-4 font-serif text-[36px] font-normal leading-[1.2] text-cream">
			Got it.
		</h1>
		<p class="m-0 font-sans text-[17px] leading-[1.6] text-drift">
			I’ll be in touch within a day — usually sooner.
		</p>
		<p class="mt-8 font-sans text-[15px]">
			<a
				href="/"
				class="text-root-light underline decoration-root-light/30 underline-offset-2 transition-colors hover:text-cream"
			>
				← Back home
			</a>
		</p>
	</Container>
</main>

<Footer />
