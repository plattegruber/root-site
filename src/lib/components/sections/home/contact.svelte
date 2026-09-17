<!--
@component
Contact — dark form section with progressive enhancement.

No-JS path: the form posts to /api/contact, which redirects to /thanks.
JS path: we intercept the submit, POST as JSON, then swap the form for
the same calm confirmation message the no-JS path would show. The
behavior matches whether JS is available or not, so the lights stay on
for the audience that's most likely to disable scripts (older browsers,
content blockers, hospital networks).

Fields: name and email are required; practice name, current website,
location, and a free-text note are optional so the form stays low-friction.
-->
<script lang="ts">
	import { Button, FormField } from '$lib/components/ui';
	import { EdWrap, MarginRow } from '$lib/components/editorial';
	import { site } from '$lib/config/site';

	let name = $state('');
	let practice = $state('');
	let website = $state('');
	let location = $state('');
	let email = $state('');
	let message = $state('');
	let errors = $state<{ name?: string; email?: string; form?: string }>({});
	let submitting = $state(false);
	let submitted = $state(false);

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	function validate(): boolean {
		const next: typeof errors = {};
		if (!name.trim()) next.name = 'Name is required';
		if (!email.trim()) next.email = 'Email is required';
		else if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email';
		errors = next;
		return Object.keys(next).length === 0;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!validate()) return;

		submitting = true;
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({ name, practice, website, location, email, message })
			});

			if (!res.ok) {
				const data = (await res.json().catch(() => ({}))) as {
					error?: string;
				};
				errors = { form: data.error ?? 'Something went wrong. Try again.' };
				return;
			}

			submitted = true;
		} catch {
			errors = { form: 'Network error. Please try again.' };
		} finally {
			submitting = false;
		}
	}
</script>

<section id="contact" class="bg-ink section-py">
	<EdWrap>
		<MarginRow icon="mail" label="get started" dark>
			{#if submitted}
				<h2 class="mb-4 font-serif text-[28px] leading-[1.25] font-normal text-cream">Got it.</h2>
				<p class="m-0 font-sans text-[17px] leading-[1.6] text-drift">
					We’ll be in touch within a day, usually sooner.
				</p>
			{:else}
				<h2 class="mb-4 font-serif text-[28px] leading-[1.25] font-normal text-cream">
					Tell us about your practice.
				</h2>
				<p class="mb-8 max-w-[440px] font-sans text-[17px] leading-[1.6] text-drift">
					A name and an email is enough. The rest helps us come back with something specific.
				</p>

				<form
					action="/api/contact"
					method="POST"
					novalidate
					onsubmit={handleSubmit}
					class="max-w-[440px]"
				>
					<!--
					Honeypot — hidden from real users via inert + tab-index,
					sized to zero, and aria-hidden. Bots that auto-fill every
					field trip it; the server short-circuits to a 200.
				-->
					<div class="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
						<label>
							Company
							<input type="text" name="company" tabindex="-1" autocomplete="off" />
						</label>
					</div>

					<FormField
						dark
						name="name"
						label="Your name"
						autocomplete="name"
						required
						error={errors.name}
						bind:value={name}
					/>
					<FormField
						dark
						name="email"
						label="Email"
						type="email"
						autocomplete="email"
						required
						error={errors.email}
						bind:value={email}
					/>
					<FormField
						dark
						name="practice"
						label="Practice name"
						autocomplete="organization"
						bind:value={practice}
					/>
					<FormField
						dark
						name="website"
						label="Current website"
						type="url"
						autocomplete="url"
						placeholder="Optional — if you have one"
						bind:value={website}
					/>
					<FormField
						dark
						name="location"
						label="City and state"
						autocomplete="address-level2"
						bind:value={location}
					/>
					<FormField
						dark
						name="message"
						label="Anything you want us to know"
						multiline
						rows={4}
						placeholder="Optional"
						bind:value={message}
					/>

					{#if errors.form}
						<p class="mb-4 font-sans text-[13px] text-error" role="alert">
							{errors.form}
						</p>
					{/if}

					<Button type="submit" disabled={submitting} class="mt-1">
						{submitting ? 'Sending…' : 'Send'}
					</Button>
				</form>

				<div class="mt-10 border-t border-cream/8 pt-6">
					<p class="m-0 font-sans text-[15px] leading-[1.55] text-drift">
						Or just email us:
						<a
							href="mailto:{site.email}"
							class="text-root-light underline decoration-root-light/30 underline-offset-2 transition-colors hover:text-cream"
						>
							{site.emailDisplay}
						</a>
					</p>
					<p class="mt-2 font-sans text-[15px] leading-[1.55] text-drift">
						We’ll get back to you within a day, usually sooner.
					</p>
				</div>
			{/if}
		</MarginRow>
	</EdWrap>
</section>
