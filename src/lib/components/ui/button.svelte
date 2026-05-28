<!--
@component
Button — primary, secondary, and ghost variants matching the root. design system.

Polymorphic: renders an `<a>` when `href` is set, a `<button>` otherwise. This
keeps semantics correct (links navigate, buttons act) while letting callers use
one component for both. Loosely modeled on the shadcn-svelte API.

Examples:
  <Button>Send</Button>
  <Button variant="secondary" href="/about">About</Button>
  <Button type="submit" disabled={loading}>Sending…</Button>
-->
<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: [
			'inline-flex items-center justify-center gap-2',
			'rounded-sm font-sans text-[15px] font-medium leading-none',
			'border border-transparent cursor-pointer',
			'transition-[background-color,border-color,color] duration-150 ease-out',
			'no-underline',
			'disabled:opacity-60 disabled:cursor-default'
		],
		variants: {
			variant: {
				primary: 'bg-root text-cream border-root hover:bg-root-dark hover:border-root-dark',
				secondary:
					'bg-transparent text-charcoal border-stone hover:border-clay',
				ghost:
					'bg-transparent text-root border-transparent hover:bg-root/[0.06] hover:text-root-dark px-3.5'
			},
			size: {
				default: 'px-6 py-3',
				sm: 'px-4 py-2 text-[14px]'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'default'
		}
	});

	export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
	export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type {
		HTMLAnchorAttributes,
		HTMLButtonAttributes
	} from 'svelte/elements';
	import { cn } from '$lib/utils';

	type CommonProps = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		children: Snippet;
	};

	type Props = CommonProps &
		(
			| ({ href: string } & Omit<HTMLAnchorAttributes, 'class' | 'children'>)
			| ({ href?: undefined } & Omit<HTMLButtonAttributes, 'class' | 'children'>)
		);

	let {
		variant = 'primary',
		size = 'default',
		class: className,
		children,
		href,
		...rest
	}: Props = $props();

	const classes = $derived(cn(buttonVariants({ variant, size }), className));
</script>

{#if href}
	<a {href} class={classes} {...rest as HTMLAnchorAttributes}>{@render children()}</a>
{:else}
	<button
		type={(rest as HTMLButtonAttributes).type ?? 'button'}
		class={classes}
		{...rest as HTMLButtonAttributes}
	>
		{@render children()}
	</button>
{/if}
