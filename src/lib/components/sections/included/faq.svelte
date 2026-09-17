<!--
@component
Buying questions — the commercial facts about root, in one place.

A short list of the things a dentist asks before deciding: price, what the
Google Business Profile work actually is, leaving, timing, moving a site,
and who qualifies. The answers live in `$lib/config/faq` so the same text
is emitted as FAQPage JSON-LD by the route's load().
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import { buyingFaq } from '$lib/config/faq';
</script>

<section id="questions" style="padding-bottom: var(--section-v-padding)">
	<Container>
		<h2 class="mt-0 mb-4 font-mono text-[12px] tracking-[0.04em] text-root-light uppercase">
			Before you decide
		</h2>
		<div class="flex flex-col">
			{#each buyingFaq as item (item.q)}
				<div class="flex flex-wrap gap-6 border-t border-stone py-8">
					<h3
						class="m-0 w-[210px] shrink-0 font-serif text-[22px] leading-[1.3] font-normal text-ink"
					>
						{item.q}
					</h3>
					<p
						class="m-0 max-w-[480px] min-w-[260px] flex-1 font-sans text-[15px] leading-[1.65] text-pretty text-clay"
					>
						{item.a}
					</p>
				</div>
			{/each}
		</div>
	</Container>
</section>
