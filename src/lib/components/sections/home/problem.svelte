<!--
@component
Problem — solo dentists shouldn't need to become web marketers.

Names the three places a practice website usually comes from and what each
one hands back to the dentist. The closing line is the hinge into what root
takes care of.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import TermList from './term-list.svelte';

	const alternatives = [
		{
			term: 'Big marketing firms',
			text: 'Packages, contracts, and upsells. Your website is one line item in a bundle built for practices much larger than yours.'
		},
		{
			term: 'Freelancers',
			text: 'A nice site at launch, then silence. The next time your hours change, there’s nobody to email.'
		},
		{
			term: 'DIY website tools',
			text: 'Cheap to start, but now you own the hosting, the updates, the plugins, and the Google listing. It all becomes your job.'
		}
	];
</script>

<section class="section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="signpost" label="the problem">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					You have a practice to run.
				</h2>
				<p class="mb-8 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay">
					Your website shouldn’t become another piece of software your team has to manage. But most
					of the ways to get one leave you holding it.
				</p>

				<TermList items={alternatives} />

				<p
					class="mt-6 mb-0 max-w-[520px] font-sans text-[17px] leading-[1.65] font-medium text-charcoal"
				>
					root sits in between. We build it, host it, keep it current, and handle your presence on
					Google.
				</p>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
