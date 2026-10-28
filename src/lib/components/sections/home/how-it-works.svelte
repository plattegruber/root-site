<!--
@component
How it works — three steps, deliberately short.

Building the site is not a six-week agency engagement, so it doesn't read
like one. "We keep taking care of it" lands last because it's the product.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import TermList from './term-list.svelte';

	const steps = [
		{
			term: 'Show us your practice',
			text: 'We learn about the practice, the team, your patients, and what makes the place different. You don’t need a brief.'
		},
		{
			term: 'We build the site',
			text: 'Design, copy, development, launch, and Google setup. You see drafts along the way, and nothing goes live without your okay.'
		},
		{
			term: 'We keep taking care of it',
			text: 'When hours change, a new hygienist joins, you add a service, or something needs updating, tell us. We handle it.'
		}
	];
</script>

<section class="bg-linen section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="route" label="how it works">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					Three steps. Then it’s handled.
				</h2>

				<TermList items={steps} compact />

				<p
					class="mt-6 mb-0 max-w-[520px] font-sans text-[17px] leading-[1.65] font-medium text-charcoal"
				>
					That’s the product.
				</p>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
