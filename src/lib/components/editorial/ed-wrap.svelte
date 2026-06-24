<!--
@component
EdWrap — the editorial-width container (860px) used by the homepage.

Wider than the 680px reading column (`Container`) but narrower than the
1080px page rail, it gives the homepage room for the margin-kicker gutter
beside the main content column. 24px gutter on both sides.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<div class={cn('mx-auto w-full max-w-(--container-editorial) px-6', className)} {...rest}>
	{@render children()}
</div>
