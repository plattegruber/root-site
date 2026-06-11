<!--
@component
Boring-stuff hero — title plus two prefatory paragraphs. The framing flips
a features page inside out: you don't have to read it, because these are
the things handled for you. The second paragraph explains the grey jargon
labels in the list below.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
</script>

<section class="section-py" style="padding-bottom: var(--section-sm-v-padding)">
	<Container>
		<h1 class="m-0 mb-5 font-serif text-page-title font-normal text-ink">The boring stuff.</h1>
		<p class="m-0 mb-4 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay">
			You don’t have to read this page. That’s rather the point — these are the things I take care
			of so you never think about them. But if you like knowing what you’re paying for, here it is.
		</p>
		<p class="m-0 max-w-[520px] font-sans text-[15px] leading-[1.6] text-pretty text-drift">
			Where the industry has a name for something, I’ve put it in grey next to mine — useful if
			you’re comparing me to the big companies.
		</p>
	</Container>
</section>
