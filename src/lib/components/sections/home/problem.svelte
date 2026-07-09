<!--
@component
Problem — the three places dental websites come from, and what each costs you.

Sits on the same cream band as Position with no top padding, so the idea and
the problem read as two beats of one thought rather than separate sections.
The closing line is the hinge into the Answer.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import TermList from './term-list.svelte';

	const buckets = [
		{
			term: 'Template platforms',
			text: 'Cheap and fast, but your site looks like a thousand other practices — and updating it becomes your job.'
		},
		{
			term: 'One-time freelancers',
			text: 'A custom build, then silence. The site slowly goes stale and nobody answers the email.'
		},
		{
			term: 'Marketing agencies',
			text: 'A big team and a big invoice — bundles, dashboards, and a website that’s a line item in a package you didn’t ask for.'
		}
	];
</script>

<section style="padding-bottom: var(--section-v-padding)">
	<EdWrap>
		<Reveal>
			<MarginRow icon="signpost" label="the problem">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					Dental websites usually come from one of three places.
				</h2>

				<TermList items={buckets} />

				<p
					class="mt-6 mb-0 max-w-[520px] font-sans text-[17px] leading-[1.65] font-medium text-charcoal"
				>
					Each one trades away something a practice actually needs.
				</p>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
