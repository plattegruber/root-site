<!--
@component
Divider — 1px horizontal rule. `dark` swaps to a translucent cream so it
remains visible on the ink-colored sections.
-->
<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		dark?: boolean;
		class?: string;
	};

	let { dark = false, class: className }: Props = $props();
</script>

<hr
	class={cn(
		'm-0 h-px w-full border-0',
		dark ? 'bg-cream/10' : 'bg-stone',
		className
	)}
/>
