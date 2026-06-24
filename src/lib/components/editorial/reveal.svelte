<!--
@component
Reveal — fades and lifts its contents into view on scroll.

Progressive by design: the hidden start state is only applied when JS is
running and motion is allowed (see the `.reveal` rules in app.css —
`@media (scripting: none)` and `prefers-reduced-motion` both show content
immediately), so SSR / no-JS / reduced-motion visitors never see a blank
section.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type Props = {
		delay?: number;
		class?: string;
		children: Snippet;
	};

	let { delay = 0, class: className, children }: Props = $props();

	let el: HTMLElement;

	onMount(() => {
		const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		if (reduce || !('IntersectionObserver' in window)) {
			el.classList.add('is-visible');
			return;
		}

		let timer: ReturnType<typeof setTimeout>;
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						timer = setTimeout(() => el.classList.add('is-visible'), delay);
						io.unobserve(entry.target);
					}
				}
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
		);

		io.observe(el);
		return () => {
			io.disconnect();
			clearTimeout(timer);
		};
	});
</script>

<div bind:this={el} class={cn('reveal', className)}>
	{@render children()}
</div>
