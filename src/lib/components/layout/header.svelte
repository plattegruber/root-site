<!--
@component
Header — top-of-page brand + primary nav.

`dark` flips brand and link colors so the header can sit inside the dark
hero section without a seam. `currentPage` highlights the active nav link.

Below the md breakpoint the horizontal nav gives way to a menu button that
discloses the same links in a full-width panel under the header. The
disclosure is a native <details>, so it opens and closes without JS; when
JS is running we also close it on navigation, on Escape, and on a click
outside the panel.
-->
<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { nav, type NavId } from '$lib/config/site';
	import { Icon } from '$lib/components/editorial';
	import { cn } from '$lib/utils';
	import NavLink from './nav-link.svelte';

	type Props = {
		dark?: boolean;
		currentPage?: NavId;
	};

	let { dark = false, currentPage }: Props = $props();

	let open = $state(false);
	let menu: HTMLDetailsElement | undefined = $state();

	afterNavigate(() => {
		open = false;
	});

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) open = false;
	}

	function onPointerdown(event: PointerEvent) {
		if (open && menu && !menu.contains(event.target as Node)) open = false;
	}
</script>

<svelte:window onkeydown={onKeydown} onpointerdown={onPointerdown} />

<header class={cn('relative py-6', dark ? 'bg-ink' : 'bg-cream')}>
	<div class="mx-auto flex w-full max-w-(--container-page) items-center justify-between px-6">
		<a
			href="/"
			class={cn(
				'font-serif text-[28px] leading-none tracking-[-0.5px] no-underline',
				dark ? 'text-cream' : 'text-ink'
			)}
		>
			root.
		</a>

		<!-- Wide screens: the links inline. -->
		<nav class="flex items-center nav-gap max-md:hidden" aria-label="Primary">
			{#each nav as link (link.id)}
				<NavLink href={link.href} active={currentPage === link.id} {dark}>
					{link.label}
				</NavLink>
			{/each}
		</nav>

		<!-- Narrow screens: a menu button disclosing the same links. -->
		<details bind:this={menu} bind:open class="mobile-menu md:hidden">
			<summary
				class={cn(
					'flex cursor-pointer list-none items-center gap-2 rounded-sm px-2 py-1.5 font-sans text-[15px] select-none',
					dark ? 'text-drift hover:text-cream' : 'text-clay hover:text-charcoal'
				)}
				aria-label={open ? 'Close menu' : 'Open menu'}
			>
				<Icon name={open ? 'x' : 'menu'} class="text-[22px]" />
			</summary>

			<nav
				class={cn(
					'absolute inset-x-0 top-full z-20 border-t border-b',
					dark ? 'border-cream/10 bg-ink' : 'border-stone bg-cream'
				)}
				aria-label="Primary"
			>
				<ul class="m-0 flex list-none flex-col p-0">
					{#each nav as link (link.id)}
						<li
							class={cn('border-t first:border-t-0', dark ? 'border-cream/8' : 'border-stone/70')}
						>
							<a
								href={link.href}
								aria-current={currentPage === link.id ? 'page' : undefined}
								class={cn(
									'block px-6 py-4 font-sans text-[17px] no-underline transition-colors duration-150',
									dark ? 'text-drift hover:text-cream' : 'text-clay hover:text-charcoal',
									currentPage === link.id &&
										(dark ? 'font-medium text-cream' : 'font-medium text-charcoal')
								)}
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</details>
	</div>
</header>

<style>
	/* Hide the native disclosure triangle in every engine. */
	.mobile-menu > summary::-webkit-details-marker {
		display: none;
	}
	.mobile-menu > summary::marker {
		content: '';
	}
</style>
