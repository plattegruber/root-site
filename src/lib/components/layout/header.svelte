<!--
@component
Header — top-of-page brand + primary nav.

`dark` flips brand and link colors so the header can sit inside the dark
hero section without a seam. `currentPage` highlights the active nav link.
-->
<script lang="ts">
	import { nav, type NavId } from '$lib/config/site';
	import { cn } from '$lib/utils';
	import NavLink from './nav-link.svelte';

	type Props = {
		dark?: boolean;
		currentPage?: NavId;
	};

	let { dark = false, currentPage }: Props = $props();
</script>

<header class="py-6">
	<div
		class="mx-auto flex w-full max-w-(--container-page) items-center justify-between px-6"
	>
		<a
			href="/"
			class={cn(
				'font-serif text-[28px] leading-none no-underline tracking-[-0.5px]',
				dark ? 'text-cream' : 'text-ink'
			)}
		>
			root.
		</a>

		<nav class="nav-gap flex items-center" aria-label="Primary">
			{#each nav as link (link.id)}
				<NavLink href={link.href} active={currentPage === link.id} {dark}>
					{link.label}
				</NavLink>
			{/each}
		</nav>
	</div>
</header>
