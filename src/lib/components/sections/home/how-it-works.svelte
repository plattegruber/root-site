<!--
@component
How it works — the five steps, from first look through every month after.

Replaces the old three-paragraph note: the same story, but broken into named
steps so a skimming reader can see where the free review ends and the paid
work begins. "Ongoing care" lands last on purpose — it's the differentiator.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import TermList from './term-list.svelte';

	const steps = [
		{
			term: 'Review',
			text: 'Send me your current site — or just your practice name. I’ll tell you what I’d keep, what I’d change, and why.'
		},
		{
			term: 'Direction',
			text: 'If a visual direction would help, I’ll include a homepage mockup so you can see what I mean.'
		},
		{
			term: 'Build',
			text: 'If you like it, I build it. About two weeks, with drafts along the way. Nothing goes live without your okay.'
		},
		{
			term: 'Launch',
			text: 'The site goes up on your domain, registered in your name. You own all of it.'
		},
		{
			term: 'Ongoing care',
			text: 'After that, I handle everything. New hours, new provider, new photos — email me and it’s done. You go back to dentistry.'
		}
	];
</script>

<section class="section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="route" label="how it works">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					From first look to every month after.
				</h2>

				<TermList items={steps} compact />
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
