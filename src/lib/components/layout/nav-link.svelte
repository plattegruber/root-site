<!--
@component
NavLink — header navigation link with light/dark themes and active state.

Renders aria-current="page" when active so screen readers and search engines
both get the cue.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type Props = {
		href: string;
		active?: boolean;
		dark?: boolean;
		children: Snippet;
	};

	let { href, active = false, dark = false, children }: Props = $props();
</script>

<a
	{href}
	aria-current={active ? 'page' : undefined}
	class={cn(
		'font-sans text-[15px] no-underline transition-colors duration-150',
		dark ? 'text-drift hover:text-cream' : 'text-clay hover:text-charcoal',
		active && (dark ? 'text-cream font-medium' : 'text-charcoal font-medium')
	)}
>
	{@render children()}
</a>
