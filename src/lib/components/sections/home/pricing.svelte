<!--
@component
Pricing — price tag, summary, included items.

Plain unordered list with a tiny stone dot — quieter than a checkmark
list, which would lean too SaaS-y for the voice of the site.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';

	const included = [
		'Custom design — not a template',
		'Fast, reliable hosting',
		'Mobile-friendly, always',
		'Edits and updates, anytime',
		'No setup fee, no contract'
	];
</script>

<section class="section-sm-py bg-linen">
	<Container>
		<div class="mb-6 flex items-baseline gap-1.5">
			<span class="font-serif text-[36px] leading-none text-ink">$250</span>
			<span class="font-mono text-[15px] text-drift">/month</span>
		</div>

		<p class="mb-5 font-sans text-[15px] leading-[1.55] text-clay">
			Everything included. One flat fee.
		</p>

		<ul class="m-0 flex flex-col gap-2.5 p-0">
			{#each included as item (item)}
				<li
					class="flex items-center gap-3 font-sans text-[15px] text-charcoal"
				>
					<span class="size-1 shrink-0 rounded-full bg-stone" aria-hidden="true"></span>
					{item}
				</li>
			{/each}
		</ul>
	</Container>
</section>
