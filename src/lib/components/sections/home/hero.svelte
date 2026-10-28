<!--
@component
Hero — full-bleed ink section that makes the promise in the first breath.

A mono eyebrow names the category (dental practice websites), then the
promise is the display line, then a first-person introduction: who is
taking the website off your plate and what asking for a change looks like.
One button, a quiet link to the demos beside it, then a hairline and the
price. When the founding offer is active it sits directly under the price
so the visitor sees both numbers before a scroll.

If `site.hero.photo.src` is set, a small round portrait sits beside the
introduction so "I" has a face. Text-only otherwise.
-->
<script lang="ts">
	import { EdWrap } from '$lib/components/editorial';
	import { Button, Divider } from '$lib/components/ui';
	import { pricing, site } from '$lib/config/site';

	const { monthly, founding } = pricing;
	const photo = site.hero.photo;
</script>

<section class="hero-py">
	<EdWrap>
		<div class="mb-[30px] font-mono text-[13px] tracking-[0.04em] text-root-light">
			root. — websites for independent dental practices
		</div>

		<h1 class="m-0 max-w-[780px] font-serif text-hero-display font-normal text-cream">
			Your website.<br />Off your plate.
		</h1>

		<div class="mt-8 flex max-w-[600px] items-start gap-5">
			{#if photo.src}
				<img
					src={photo.src}
					alt={photo.alt}
					width="72"
					height="72"
					decoding="async"
					class="mt-1 h-[72px] w-[72px] shrink-0 rounded-full border border-cream/15 object-cover"
				/>
			{/if}
			<div>
				<p class="m-0 font-sans text-hero-sub text-pretty text-cream/90">
					I’m {site.person.givenName}. I build your practice’s website, keep it current, and look
					after your Google listing.
				</p>
				<p class="mt-3 mb-0 font-sans text-hero-sub text-pretty text-drift">
					Need something changed? Email me. That’s the whole system.
				</p>
			</div>
		</div>

		<div class="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
			<Button href="#contact" variant="primaryDark">
				Tell me about your practice
				<span aria-hidden="true">→</span>
			</Button>
			<a
				href="/demos"
				class="font-sans text-[15px] font-medium text-drift underline decoration-drift/40 underline-offset-[3px] transition-colors hover:text-cream"
			>
				See example sites
			</a>
		</div>

		<div class="mt-[52px] max-w-[600px]">
			<Divider dark />
			<p class="mt-5 mb-0 font-mono text-[14px] tracking-[0.01em] text-drift">
				<span class="text-cream">${monthly}</span>/month · no setup fee · no contract
			</p>
			{#if founding.active}
				<p class="mt-2 mb-0 font-mono text-[14px] tracking-[0.01em] text-drift">
					<span class="text-root-light">Founding practices:</span>
					<span class="text-cream">${founding.monthly}</span>/month for as long as you stay · first {founding.limit}
					only
				</p>
			{/if}
		</div>
	</EdWrap>
</section>
