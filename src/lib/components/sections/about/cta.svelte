<!--
@component
About CTA — final ink section nudging readers toward the contact form.

Single link, light hover treatment. No button, no second CTA — the page
already laid out the offer.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
</script>

<section class="section-py bg-ink">
	<Container>
		<h2 class="mb-4 font-serif text-[28px] font-normal leading-[1.25] text-cream">
			Interested?
		</h2>
		<p class="mb-6 max-w-[440px] font-sans text-[17px] leading-[1.6] text-drift">
			Happy to walk you through how it works if you’re curious. No pressure
			either way.
		</p>
		<a
			href="/#contact"
			class="inline-flex items-center gap-2 font-sans text-[15px] font-medium text-root-light underline decoration-root-light/40 underline-offset-[3px] transition-colors duration-150 hover:text-cream hover:decoration-cream"
		>
			Get in touch
		</a>
	</Container>
</section>
