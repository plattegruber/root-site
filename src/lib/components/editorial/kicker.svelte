<!--
@component
Kicker — a small mono editorial label that sits in the margin gutter.

An icon (or number) over a short rule over a lowercase label. On wide
screens it stacks vertically in the gutter; on narrow screens it folds
into a single horizontal row above the content.
-->
<script lang="ts">
	import Icon, { type IconName } from './icon.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		icon?: IconName;
		number?: string;
		label?: string;
		dark?: boolean;
	};

	let { icon, number, label, dark = false }: Props = $props();
</script>

<div class="flex flex-col gap-2.5 font-mono max-md:flex-row max-md:items-center max-md:gap-3">
	{#if icon}
		<Icon name={icon} class="text-[19px] leading-none text-root-light" />
	{:else if number}
		<span class="text-[13px] tracking-[0.04em] text-root-light">{number}</span>
	{/if}

	<span class={cn('h-px w-7 max-md:max-w-10 max-md:flex-1', dark ? 'bg-cream/[0.18]' : 'bg-stone')}
	></span>

	{#if label}
		<span class="text-[12px] leading-[1.4] tracking-[0.02em] text-drift">{label}</span>
	{/if}
</div>
