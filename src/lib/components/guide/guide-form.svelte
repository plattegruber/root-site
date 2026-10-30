<!--
@component
GuideForm — one email field and a button, and the guide PDF lands in the
inbox. Used on the homepage, on /free-resources and inside the pillar
post, with `placement` telling the three apart in analytics and in the
notification root gets.

Progressive enhancement, same as the contact form: with JS the submit is
intercepted, posted as JSON to /api/guide and swapped for a confirmation
in place; without JS the native post redirects to /thanks/guide, which
says the same thing. The honeypot field is shared with the contact form,
so the server treats both the same way.

`dark` restyles the field for ink bands. `card` wraps the form in a
linen panel with the guide's cover, for use inside prose, where it has
to announce itself rather than sit under a section heading.
-->
<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { guide, type GuidePlacement } from '$lib/config/guide';
	import { site } from '$lib/config/site';
	import { identifyLead, track, tracingHeaders } from '$lib/analytics';
	import { cn } from '$lib/utils';

	type Props = {
		placement: GuidePlacement;
		dark?: boolean;
		card?: boolean;
		/** Button label. */
		label?: string;
		class?: string;
	};

	let {
		placement,
		dark = false,
		card = false,
		label = 'Send me the guide',
		class: className
	}: Props = $props();

	let email = $state('');
	let error = $state<string | undefined>();
	let submitting = $state(false);
	let submitted = $state(false);
	let started = false;

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const uid = $props.id();
	const fieldId = `guide-email-${uid}`;
	const errorId = `${fieldId}-error`;

	function handleStart() {
		if (started) return;
		started = true;
		track('guide_form_started', { placement });
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const value = email.trim();
		if (!value) error = 'Enter your email and we’ll send it over.';
		else if (!EMAIL_RE.test(value)) error = 'That doesn’t look like an email address.';
		else error = undefined;
		if (error) {
			track('guide_form_failed', { placement, reason: 'validation' });
			return;
		}

		submitting = true;
		try {
			const res = await fetch('/api/guide', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					...tracingHeaders()
				},
				body: JSON.stringify({ email: value, placement })
			});
			if (!res.ok) {
				const data = (await res.json().catch(() => ({}))) as { error?: string };
				error = data.error ?? 'Something went wrong. Try again in a moment.';
				track('guide_form_failed', { placement, reason: 'server', status: res.status });
				return;
			}
			submitted = true;
			identifyLead({ email: value });
			track('guide_requested', { placement });
		} catch {
			error = 'Network error. Please try again.';
			track('guide_form_failed', { placement, reason: 'network' });
		} finally {
			submitting = false;
		}
	}

	const input = $derived(
		cn(
			'w-full min-w-0 rounded-sm border px-4 py-3 font-sans text-[15px] leading-snug',
			'outline-none transition-colors duration-150 ease-out placeholder:text-drift/80',
			dark
				? cn(
						'bg-white/[0.04] text-cream',
						error ? 'border-error' : 'border-cream/15 focus:border-root-light'
					)
				: cn('bg-white text-charcoal', error ? 'border-error' : 'border-stone focus:border-root')
		)
	);
	const muted = $derived(dark ? 'text-drift' : 'text-clay');
</script>

{#snippet form()}
	{#if submitted}
		<div aria-live="polite">
			<p class={cn('m-0 font-sans text-[17px] leading-[1.6]', dark ? 'text-cream' : 'text-ink')}>
				Sent. Check your inbox for the PDF.
			</p>
			<p class={cn('mt-2 mb-0 font-sans text-[14px] leading-[1.55]', muted)}>
				Not there in a few minutes? Check spam once, then email
				<a href="mailto:{site.email}" class="underline underline-offset-2">{site.emailDisplay}</a>
				and we’ll send it by hand.
			</p>
		</div>
	{:else}
		<form
			action="/api/guide"
			method="POST"
			novalidate
			onsubmit={handleSubmit}
			onfocusin={handleStart}
			class="@container max-w-[520px]"
		>
			<div class="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
				<label>
					Company
					<input type="text" name="company" tabindex="-1" autocomplete="off" />
				</label>
			</div>
			<input type="hidden" name="placement" value={placement} />

			<label for={fieldId} class="sr-only">Email address</label>
			<div class="flex flex-col gap-3 @md:flex-row @md:items-stretch">
				<input
					id={fieldId}
					name="email"
					type="email"
					autocomplete="email"
					inputmode="email"
					required
					placeholder="you@yourpractice.com"
					bind:value={email}
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={error ? errorId : undefined}
					class={input}
				/>
				<Button type="submit" disabled={submitting} class="shrink-0">
					{submitting ? 'Sending…' : label}
					{#if !submitting}<span aria-hidden="true">→</span>{/if}
				</Button>
			</div>
			{#if error}
				<p id={errorId} class="mt-2 mb-0 font-sans text-[13px] text-error" role="alert">{error}</p>
			{/if}
			<p class={cn('mt-3 mb-0 font-sans text-[13px] leading-[1.5]', muted)}>
				A PDF in your inbox, and nothing else. No list, no follow-up sequence.
			</p>
		</form>
	{/if}
{/snippet}

{#if card}
	<aside
		class={cn(
			'not-prose my-10 grid grid-cols-1 gap-7 rounded-md border border-stone bg-linen p-6 sm:grid-cols-[116px_1fr] sm:gap-8 sm:p-8',
			className
		)}
		aria-label="Get the guide"
	>
		<img
			src={guide.cover.small}
			alt=""
			width="560"
			height="725"
			loading="lazy"
			decoding="async"
			class="hidden w-[116px] rounded-[3px] shadow-[0_18px_30px_-18px_rgba(26,23,21,0.55)] sm:block"
		/>
		<div class="min-w-0">
			<p class="m-0 font-mono text-[12px] tracking-[0.04em] text-root-light uppercase">
				Free guide · {guide.pages} pages
			</p>
			<p class="mt-2 mb-0 font-serif text-[24px] leading-[1.2] text-ink">
				Get “{guide.title}” as a PDF.
			</p>
			<p class="mt-2 mb-5 font-sans text-[15px] leading-[1.55] text-clay">
				The five checks, the worked example, the questions for your provider and the worksheet, in
				one file you can print.
			</p>
			{@render form()}
		</div>
	</aside>
{:else}
	<div class={className}>
		{@render form()}
	</div>
{/if}
