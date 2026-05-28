<!--
@component
Container — the horizontal width clamp used by every section.

Two variants: `content` (680px, used for prose and forms) and `page` (1080px,
used for header/footer rails). 24px gutter on both sides. The component
renders a plain `<div>` by default but can render as a semantic element
(e.g. `as="section"`) when the section wrapper isn't useful on its own.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = HTMLAttributes<HTMLDivElement> & {
		wide?: boolean;
		class?: string;
		children: Snippet;
	};

	let {
		wide = false,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<div
	class={cn(
		'mx-auto w-full px-6',
		wide ? 'max-w-(--container-page)' : 'max-w-(--container-content)',
		className
	)}
	{...rest}
>
	{@render children()}
</div>
