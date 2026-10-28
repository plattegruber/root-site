<!--
@component
Pitch — the ask at the bottom of the free resources page.

Someone who has read this far has just seen how root thinks about a
dental website. This section turns that into a lead: send us your site,
we go through it by hand and write back with what we'd fix or build.
Same backend as the homepage form (/api/contact), with the same no-JS
fallback (native POST, redirect to /thanks) and the same honeypot. Three
fields only; the hidden `message` tags the lead as coming from this page
so it is easy to tell these apart from homepage enquiries.

Ink band, like the homepage contact section, so the page ends on the
same dark note the homepage does.
-->
<script lang="ts">
	import { Button, Container, FormField } from '$lib/components/ui';
	import { site, price } from '$lib/config/site';

	const SOURCE = 'Came from the free resources page.';

	let name = $state('');
	let email = $state('');
	let website = $state('');
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
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({ name, email, website, message: SOURCE })
			});

			if (!res.ok) {
				const data = (await res.json().catch(() => ({}))) as { error?: string };
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

<section id="your-site" class="bg-ink section-py">
	<Container wide>
		<div class="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-14">
			<div class="md:col-span-7">
				<div class="mb-6 font-mono text-[13px] tracking-[0.04em] text-root-light">
					if you like how we think
				</div>
				<h2
					class="m-0 max-w-[560px] font-serif text-[36px] leading-[1.1] font-normal tracking-[-0.015em] text-balance text-cream md:text-[44px]"
				>
					Like how we think? Imagine what we’d do with your website.
				</h2>
				<p
					class="mt-6 mb-0 max-w-[480px] font-sans text-[17px] leading-[1.65] text-pretty text-drift"
				>
					Send us your website. We go through it by hand, the same way the review does, and write
					back with what we’d fix or build and what it would look like. Free, no obligation, and
					nobody calls you.
				</p>
				<p
					class="mt-6 mb-0 max-w-[480px] font-mono text-[13px] leading-[1.7] tracking-[0.01em] text-drift"
				>
					<span class="text-cream">{price}</span>/month if you want us to build it · no setup fee ·
					no contract
				</p>
			</div>

			<div class="md:col-span-5">
				{#if submitted}
					<h3 class="m-0 font-serif text-[28px] leading-[1.25] font-normal text-cream">Got it.</h3>
					<p class="mt-3 mb-0 font-sans text-[17px] leading-[1.6] text-drift">
						We’ll go through your site and write back within a day, usually sooner.
					</p>
				{:else}
					<form action="/api/contact" method="POST" novalidate onsubmit={handleSubmit}>
						<!-- Honeypot: hidden from people, filled by bots; the server returns 200 and drops it. -->
						<div class="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
							<label>
								Company
								<input type="text" name="company" tabindex="-1" autocomplete="off" />
							</label>
						</div>
						<input type="hidden" name="message" value={SOURCE} />

						<FormField
							dark
							id="pitch-website"
							name="website"
							label="Your practice’s website"
							type="url"
							autocomplete="url"
							placeholder="yourpractice.com"
							bind:value={website}
						/>
						<FormField
							dark
							id="pitch-name"
							name="name"
							label="Your name"
							autocomplete="name"
							required
							error={errors.name}
							bind:value={name}
						/>
						<FormField
							dark
							id="pitch-email"
							name="email"
							label="Email"
							type="email"
							autocomplete="email"
							required
							error={errors.email}
							bind:value={email}
						/>

						{#if errors.form}
							<p class="mb-4 font-sans text-[13px] text-error" role="alert">{errors.form}</p>
						{/if}

						<Button type="submit" variant="primaryDark" disabled={submitting} class="mt-1">
							{submitting ? 'Sending…' : 'Show me what you’d do'}
							{#if !submitting}<span aria-hidden="true">→</span>{/if}
						</Button>
					</form>

					<p class="mt-6 mb-0 font-sans text-[14px] leading-[1.55] text-drift">
						Or just email
						<a
							href="mailto:{site.email}"
							class="text-root-light underline decoration-root-light/30 underline-offset-2 transition-colors hover:text-cream"
							>{site.emailDisplay}</a
						>. Everything on this page stays free either way.
					</p>
				{/if}
			</div>
		</div>
	</Container>
</section>
