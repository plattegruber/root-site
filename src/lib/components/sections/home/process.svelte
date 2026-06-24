<!--
@component
Process — three short paragraphs in the editorial margin frame.

No visible heading: the "how it goes" margin label carries the section so
the narrative reads like a short note. The last paragraph is slightly
heavier to give it a soft punch line.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
</script>

<section class="section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="route" label="how it goes">
				<div class="flex max-w-[540px] flex-col gap-4">
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						Send me your practice name or your current site. I’ll take a look and come back with
						what I’d do — what to keep, what to change, and why.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						If you like it, I build it. Usually takes about two weeks. You see drafts along the way.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] font-medium text-charcoal">
						After that, I handle everything. You go back to dentistry.
					</p>
				</div>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
