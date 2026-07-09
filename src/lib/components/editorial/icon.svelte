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
		| 'signpost'
		| 'pencil-ruler'
		| 'globe'
		| 'chart-line'
		| 'route'
		| 'eye'
		| 'send'
		| 'mail'
		| 'user-round';

	const PATHS: Record<IconName, string> = {
		'door-open':
			'<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/>',
		signpost:
			'<path d="M12 13v8"/><path d="M12 3v3"/><path d="M18 6a2 2 0 0 1 1.387.56l2.335 2.14a1 1 0 0 1 0 1.4l-2.335 2.14A2 2 0 0 1 18 13H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>',
		'pencil-ruler':
			'<path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m18 16 2-2"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
		globe:
			'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
		'chart-line': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
		route:
			'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
		eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
		send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.11 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
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
