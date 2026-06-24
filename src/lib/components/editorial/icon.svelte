<!--
@component
Icon — inline SVG line icons (Lucide-derived) for the editorial kickers.

The site self-hosts everything and avoids third-party CDNs, so these are
hand-inlined rather than pulled from a Lucide CDN. Decorative by default
(aria-hidden); sized in `em` so they inherit the surrounding font-size.
-->
<script lang="ts" module>
	// Lucide-derived 24×24 stroke paths, keyed by the names the homepage uses.
	export type IconName =
		| 'door-open'
		| 'globe'
		| 'chart-line'
		| 'route'
		| 'eye'
		| 'mail'
		| 'user-round';

	const PATHS: Record<IconName, string> = {
		'door-open':
			'<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/>',
		globe:
			'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
		'chart-line': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
		route:
			'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
		eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
		mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
		'user-round': '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>'
	};
</script>

<script lang="ts">
	type Props = {
		name: IconName;
		class?: string;
	};

	let { name, class: className }: Props = $props();
</script>

<svg
	class={className}
	width="1em"
	height="1em"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html PATHS[name]}
</svg>
