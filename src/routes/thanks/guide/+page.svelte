<!--
@component
Thanks (guide) — where the no-JS guide form lands. Says the same thing
the in-place confirmation does: the PDF is on its way, check spam once,
and here is a person to email if it never shows.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import { Header, Footer } from '$lib/components/layout';
	import { guide } from '$lib/config/guide';
	import { site } from '$lib/config/site';

	const link =
		'text-root-light underline decoration-root-light/30 underline-offset-2 transition-colors hover:text-cream';
</script>

<div class="bg-ink">
	<Header dark />
</div>

<main id="main" class="bg-ink section-py">
	<Container>
		<h1 class="mb-4 font-serif text-[36px] leading-[1.2] font-normal text-cream">
			Check your inbox.
		</h1>
		<p class="m-0 max-w-[520px] font-sans text-[17px] leading-[1.6] text-drift">
			The guide is on its way to the address you gave us, as a PDF attachment. If it isn’t there in
			a few minutes, check spam once, then email
			<a href="mailto:{site.email}" class={link}>{site.emailDisplay}</a> and we’ll send it by hand.
		</p>
		<p class="mt-8 font-sans text-[15px]">
			<a href={guide.post} class={link}>← The story behind the guide</a>
		</p>
	</Container>
</main>

<Footer />
