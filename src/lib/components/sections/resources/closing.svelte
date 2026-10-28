<!--
@component
Closing — why these are free, and where the rest of the work lives.

Two sentences and two links. The first link is the quiet upsell (the
service is the part that only makes sense together); the second is the
offer the homepage makes too, because someone who has just read how the
review works is exactly the person who wants it run on their site.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';

	const link =
		'font-sans text-[15px] font-medium text-root underline decoration-root/30 underline-offset-[3px] transition-colors duration-150 hover:text-root-dark';
</script>

<section class="section-py">
	<Container wide>
		<div class="max-w-[620px]">
			<div class="mb-5 font-mono text-[13px] tracking-[0.04em] text-root-light">why free</div>
			<h2 class="m-0 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink">
				These are pieces of how we work. The work is the service.
			</h2>
			<p class="mt-5 mb-0 font-sans text-[17px] leading-[1.65] text-pretty text-clay">
				A review tool and a search engine for reviews are useful on their own, so we let them go.
				The parts that only make sense together, the design, the writing, the Google presence, and
				the person who answers when something changes, are what the monthly service is.
			</p>
			<div class="mt-8 flex flex-wrap gap-x-8 gap-y-3">
				<a href="/whats-included" class={link}>See what’s included →</a>
				<a href="/#contact" class={link}>Have us go through your site, free →</a>
			</div>
		</div>
	</Container>
</section>
