<!--
@component
About story — the "space in between" positioning, with a 200×240
portrait alongside.

Opens by introducing the person behind root by name and location (from
`site.person`), so the page names who is accountable before it explains
the philosophy.

If `site.about.photo.src` is set, renders the photo (lazy-loaded, with
explicit dimensions to prevent layout shift). Otherwise renders a calm
linen-colored placeholder so the page composition is intact.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import { site } from '$lib/config/site';

	const photo = site.about.photo;
</script>

<section style="padding-bottom: var(--section-v-padding)">
	<Container>
		<div class="flex flex-wrap items-start gap-12">
			{#if photo.src}
				<img
					src={photo.src}
					alt={photo.alt}
					width="200"
					height="240"
					loading="lazy"
					decoding="async"
					class="h-[240px] w-[200px] shrink-0 rounded-md border border-stone object-cover"
				/>
			{:else}
				<div
					class="flex h-[240px] w-[200px] shrink-0 items-center justify-center rounded-md border border-stone bg-linen"
					aria-label="Photo placeholder"
					role="img"
				>
					<span class="px-4 text-center font-sans text-[13px] leading-[1.4] text-drift">
						Your photo here
					</span>
				</div>
			{/if}

			<div class="min-w-[280px] flex-1">
				<div class="flex flex-col gap-4">
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-charcoal">
						I’m {site.person.name}. I run root from {site.person.location}, and I’m the person who
						builds, writes, and looks after every site here. There is no one else to be handed off
						to.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-charcoal">
						root exists for one kind of customer: the dentist who owns and runs an independent
						practice. Most of the ways that dentist can get a website ask for a tradeoff.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						You can go with a big dental marketing company. You’ll get a process, a platform, and
						probably a lot of words like “conversion funnel.” You may also get a template, a long
						contract, slow support, and a website that feels a lot like every other practice in
						town.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						You can go with a freelance designer. That can work too. You pay once, get a
						nice-looking site, and then hope you know what to do the next time a provider leaves,
						your hours change, a form needs updating, or your Google listing quietly goes stale.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-charcoal">
						root is built for the space in between.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						I build the site by hand, with your actual practice in mind. Then I keep taking care of
						it, and of your Google Business Profile alongside it. Not in a “submit a ticket and
						wait” way. More like: email me when something changes, and I’ll handle it.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						I’m not trying to rebrand your practice, bury you in strategy, or convince you that your
						dental office needs to become a media company.
					</p>
					<p class="m-0 font-sans text-[17px] leading-[1.65] text-clay">
						I’m here so your website and your Google presence are taken care of, and stop being one
						more thing you have to manage. Small on purpose: one practice, one website, one
						relationship, one monthly price.
					</p>
				</div>
			</div>
		</div>
	</Container>
</section>
