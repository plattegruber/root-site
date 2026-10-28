<!--
@component
Included — the service, made concrete in five rows.

Deliberately not a checklist of 25 features: five things a dentist can
repeat back. The full spec sheet lives on /whats-included.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import TermList from './term-list.svelte';

	const items = [
		{
			term: 'A website built for your practice',
			text: 'Designed around your practice, your team, and your patients. Not a generic dental template with your logo swapped in.'
		},
		{
			term: 'Updates handled for you',
			text: 'Need something changed? Send me a message. There’s no CMS to learn and no dashboard to log into.'
		},
		{
			term: 'Your Google presence managed',
			text: 'I keep your Google Business Profile accurate, complete, and current: hours, services, photos, categories.'
		},
		{
			term: 'Articles, if you want them',
			text: 'Plain-language answers to the questions patients search for, read by a practicing dentist before they go up. Optional, and included.'
		},
		{
			term: 'The fundamentals covered',
			text: 'Hosting, maintenance, security, analytics, Search Console, and local search basics are all included.'
		}
	];
</script>

<section class="bg-linen section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="layers" label="what's included">
				<h2
					class="mb-8 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					What I take care of.
				</h2>

				<TermList {items} />

				<p class="mt-7 mb-0 max-w-[520px] font-sans text-[15px] leading-[1.6] text-clay">
					The detailed version lives on
					<a
						href="/whats-included"
						class="text-root underline decoration-root/30 underline-offset-[3px] transition-colors hover:text-root-dark"
					>
						what’s included</a
					>. Everything there comes with every site.
				</p>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
