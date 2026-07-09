<!--
@component
TermList — hairline-separated rows of a serif term beside its description.

Shared by the "problem" (three sources of dental websites) and "how it works"
(five steps) sections, which draw the identical row. Rendered as a description
list so the pairing is carried by markup, not just by columns; the rows fold
to a single column when the description can no longer hold its 240px floor.
-->
<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		items: readonly { term: string; text: string }[];
		/** Row padding — steps sit slightly tighter than the problem buckets. */
		compact?: boolean;
	};

	let { items, compact = false }: Props = $props();
</script>

<dl class="m-0 flex flex-col">
	{#each items as item, i (item.term)}
		<div
			class={cn(
				'flex flex-wrap gap-6',
				compact ? 'py-[18px]' : 'py-5',
				i > 0 && 'border-t border-stone'
			)}
		>
			<dt class="w-[180px] shrink-0 font-serif text-[22px] leading-[1.3] text-ink">
				{item.term}
			</dt>
			<dd
				class="m-0 min-w-[240px] flex-1 font-sans text-[15px] leading-[1.65] text-pretty text-clay"
			>
				{item.text}
			</dd>
		</div>
	{/each}
</dl>
