<!--
@component
Reveal — fades and lifts its contents into view on scroll.

Visible by default. Content is NEVER hidden by CSS alone — the hidden state
(`.reveal-hidden`) is added by this component on mount, and only for
elements that are below the fold (so there's no above-the-fold flash) when
motion is allowed and IntersectionObserver exists. If JS doesn't run, hasn't
hydrated, or motion is reduced, nothing is hidden and the content simply
shows. The animation is a pure enhancement.
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
		if (reduce || !('IntersectionObserver' in window)) return;

		// Only animate elements that start below the fold; in-view content
		// stays visible so there's no flash of hidden → shown on load.
		const vh = window.innerHeight || document.documentElement.clientHeight;
		if (el.getBoundingClientRect().top < vh * 0.92) return;

		el.classList.add('reveal-hidden');

		let timer: ReturnType<typeof setTimeout>;
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						timer = setTimeout(() => {
							el.classList.remove('reveal-hidden');
							el.classList.add('is-visible');
						}, delay);
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
