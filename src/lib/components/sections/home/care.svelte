<!--
@component
Care — the thinking behind the sites, shown as the questions we ask.

A dental website has a specific job, and the way to show that root
understands it is to list the questions, from the patient's side, that a
site either answers or doesn't. Four of the eight kinds of patient we read
every site as; the full set, and the tools built around it, live on
/free-resources, which gets one quiet link. No branded framework name, no
method count, nothing the visitor can't check.

Cream band straight after the ink hero; the linen guide section follows it.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import TermList from './term-list.svelte';

	const questions = [
		{
			term: 'Someone in pain',
			text: 'Can they find your number on a phone, in the first few seconds, and tap it?'
		},
		{
			term: 'A nervous patient',
			text: 'Can they tell what the first visit is like, and who they’ll meet when they walk in?'
		},
		{
			term: 'A new family',
			text: 'Can they work out whether you take their insurance without having to call?'
		},
		{
			term: 'Someone ready to book',
			text: 'Is the book button where their thumb already is, and does it actually work?'
		}
	];
</script>

<section class="section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="route" label="how we think">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					A good-looking website is the starting point.
				</h2>
				<p class="mb-8 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay">
					We look at the things patients actually experience, and build around those questions
					rather than around a template.
				</p>

				<TermList items={questions} compact />

				<p
					class="mt-7 mb-0 max-w-[520px] font-sans text-[15px] leading-[1.6] text-pretty text-clay"
				>
					Those are four of the eight kinds of patient we read every site as. We’ve started
					releasing the tools we use for it, free, on
					<a
						href="/free-resources"
						class="text-root underline decoration-root/30 underline-offset-[3px] transition-colors hover:text-root-dark"
						>free resources</a
					>.
				</p>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
