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
		'Edits and updates, anytime — just message me',
		'Built to be found — set up right for search and AI from day one',
		'No setup fee, no contract'
	];
</script>

<section class="bg-linen section-sm-py">
	<Container>
		<h2 class="mb-5 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink">
			Your site, built right
		</h2>

		<div class="mb-2 flex items-baseline gap-1.5">
			<span class="font-serif text-[36px] leading-none text-ink">$250</span>
			<span class="font-mono text-[15px] text-drift">/month</span>
		</div>

		<p class="mb-6 font-sans text-[15px] leading-[1.55] text-clay">
			Everything included. One flat fee.
		</p>

		<ul class="m-0 flex flex-col gap-2.5 p-0">
			{#each included as item (item)}
				<li class="flex items-center gap-3 font-sans text-[15px] text-charcoal">
					<span class="size-1 shrink-0 rounded-full bg-stone" aria-hidden="true"></span>
					{item}
				</li>
			{/each}
		</ul>

		<p class="mt-6 max-w-[560px] font-sans text-[15px] leading-[1.6] text-clay">
			That’s your Google listing plus the markup that lets search engines and AI find you. Most
			shops skip it. I don’t.
		</p>
		<p class="mt-4 max-w-[560px] font-sans text-[15px] leading-[1.6] text-clay">
			For most practices, this is the whole job. A great site, handled — no dashboard to learn, no
			password to dig up. When something needs changing, you message me and it’s done. Same person
			who built it, every time.
		</p>
	</Container>
</section>
