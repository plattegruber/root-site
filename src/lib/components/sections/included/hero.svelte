<!--
@component
What's-included hero — title plus two prefatory paragraphs.

The page is the features list, but the framing keeps the old posture: these
are the things handled for you, not a menu to choose from. The second
paragraph explains the grey jargon labels in the list below.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
</script>

<section class="section-py" style="padding-bottom: var(--section-sm-v-padding)">
	<Container>
		<h1 class="m-0 mb-5 max-w-[560px] font-serif text-page-title font-normal text-balance text-ink">
			Everything your dental website needs, without making it your job.
		</h1>
		<p class="m-0 mb-4 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay">
			Every item on this page comes with every site, at the same flat fee. Yes, it’s included. No,
			you don’t have to manage it.
		</p>
		<p class="m-0 max-w-[520px] font-sans text-[15px] leading-[1.6] text-pretty text-drift">
			Where the industry has a name for something, I’ve put it in grey next to mine — useful if
			you’re comparing me to the big companies.
		</p>
	</Container>
</section>
