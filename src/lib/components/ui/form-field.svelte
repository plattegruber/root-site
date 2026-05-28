<!--
@component
FormField — labelled <input> or <textarea> with error state and dark variant.

The label is always rendered (never hidden) so screen readers and sighted
users get the same affordance. Errors are linked via aria-describedby and
the input flips aria-invalid on error so AT announces correctly.
-->
<script lang="ts">
	import { cn } from '$lib/utils';

	import type { FullAutoFill } from 'svelte/elements';

	type Props = {
		id?: string;
		name: string;
		label: string;
		type?: 'text' | 'email' | 'url' | 'tel';
		value?: string;
		placeholder?: string;
		required?: boolean;
		dark?: boolean;
		multiline?: boolean;
		rows?: number;
		error?: string;
		autocomplete?: FullAutoFill;
	};

	let {
		id,
		name,
		label,
		type = 'text',
		value = $bindable(''),
		placeholder,
		required = false,
		dark = false,
		multiline = false,
		rows = 4,
		error,
		autocomplete
	}: Props = $props();

	const fieldId = $derived(id ?? `field-${name}`);
	const errorId = $derived(`${fieldId}-error`);

	const labelClass = $derived(
		cn('mb-1.5 block font-sans text-[13px] font-medium', dark ? 'text-drift' : 'text-clay')
	);

	const inputBase = cn(
		'w-full rounded-sm border px-4 py-3 font-sans text-[15px] leading-snug',
		'outline-none transition-colors duration-150 ease-out',
		'placeholder:text-drift/80'
	);

	const inputTheme = $derived(
		dark
			? cn(
					'bg-white/[0.04] text-cream',
					error ? 'border-error' : 'border-cream/15 focus:border-root-light'
				)
			: cn('bg-white text-charcoal', error ? 'border-error' : 'border-stone focus:border-root')
	);
</script>

<div class="mb-5">
	<label for={fieldId} class={labelClass}>
		{label}
		{#if required}
			<span class="sr-only">(required)</span>
		{/if}
	</label>

	{#if multiline}
		<textarea
			id={fieldId}
			{name}
			{placeholder}
			{required}
			{rows}
			{autocomplete}
			bind:value
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? errorId : undefined}
			class={cn(inputBase, inputTheme, 'resize-y')}
		></textarea>
	{:else}
		<input
			id={fieldId}
			{name}
			{type}
			{placeholder}
			{required}
			{autocomplete}
			bind:value
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? errorId : undefined}
			class={cn(inputBase, inputTheme)}
		/>
	{/if}

	{#if error}
		<p id={errorId} class="mt-1 font-sans text-[13px] text-error">{error}</p>
	{/if}
</div>
