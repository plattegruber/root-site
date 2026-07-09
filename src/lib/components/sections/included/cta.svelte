<!--
@component
What's-included CTA — a calm linen section inviting questions. Single leather
link to the homepage contact form. The tone stays in character: ask if you
want to, but you don't have to.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
</script>

<section class="bg-linen section-py">
	<Container>
		<h2 class="mb-4 font-serif text-[28px] leading-[1.25] font-normal text-ink">
			Questions about any of this?
		</h2>
		<p class="mb-6 max-w-[440px] font-sans text-[17px] leading-[1.6] text-clay">
			Ask. I like talking about this stuff — you just don’t have to.
		</p>
		<a
			href="/#contact"
			class="inline-flex items-center font-sans text-[15px] font-medium text-root underline decoration-root/40 underline-offset-[3px] transition-colors duration-150 hover:text-root-dark hover:decoration-root-dark"
		>
			Get in touch
		</a>
	</Container>
</section>
