<!--
@component
MarginRow — a two-column editorial row: a kicker label in the gutter and
the main content beside it. Collapses to a single column on narrow screens
(the kicker folds into a horizontal strip above the content).

When no icon/number/label is given, the gutter renders empty — used for
content (a CTA, a hairline) that should still line up with the main column.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Kicker from './kicker.svelte';
	import type { IconName } from './icon.svelte';

	type Props = {
		icon?: IconName;
		number?: string;
		label?: string;
		dark?: boolean;
		children: Snippet;
	};

	let { icon, number, label, dark = false, children }: Props = $props();

	const hasKicker = $derived(Boolean(icon || number || label));
</script>

<div
	class="grid grid-cols-[132px_minmax(0,1fr)] items-start gap-14 max-md:grid-cols-1 max-md:gap-5"
>
	{#if hasKicker}
		<Kicker {icon} {number} {label} {dark} />
	{:else}
		<div></div>
	{/if}
	<div>
		{@render children()}
	</div>
</div>
