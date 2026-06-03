<!--
@component
Demos teaser — a short pointer from the homepage to the full /demos page.

Leads with a screengrab of the featured (first live) demo so the homepage
gets a real visual, then links onward to the rest. The whole frame is the
link into the live site. bg-linen keeps the section-color alternation going
(it sits between the cream Process section and the ink Contact section).
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import { demos } from '$lib/config/demos';

	const featured = demos.find((d) => d.url && !d.comingSoon);
</script>

<section class="bg-linen section-py">
	<Container>
		<h2 class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink">
			See it in action
		</h2>
		<p class="mb-10 max-w-[560px] font-sans text-hero-sub text-clay">
			Here are some example practices you can actually click through — real sites, built top to
			bottom. Here’s one to start; more on the way.
		</p>

		{#if featured}
			<a
				href={featured.url}
				target="_blank"
				rel="noopener noreferrer"
				class="group block no-underline"
			>
				{#if featured.image}
					<div
						class="overflow-hidden rounded-md border border-stone bg-white shadow-[0_1px_2px_rgba(26,23,21,0.04),0_12px_32px_-12px_rgba(26,23,21,0.18)] transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_2px_4px_rgba(26,23,21,0.05),0_20px_44px_-14px_rgba(26,23,21,0.24)]"
					>
						<img
							src={featured.image}
							alt={`Screenshot of the ${featured.name} demo site`}
							width="1440"
							height="900"
							loading="lazy"
							class="block h-auto w-full"
						/>
					</div>
				{/if}
				<div class="mt-4 flex items-baseline gap-3">
					<span
						class="font-serif text-[20px] leading-tight font-normal text-ink transition-colors duration-150 group-hover:text-root"
					>
						{featured.name}
					</span>
					<span class="font-mono text-[13px] text-drift">{featured.category}</span>
					<span
						aria-hidden="true"
						class="font-sans text-[15px] text-drift transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-root"
						>↗</span
					>
				</div>
			</a>
		{/if}

		<a
			href="/demos"
			class="mt-8 inline-block font-sans text-[15px] text-root underline decoration-root/30 underline-offset-2 transition-colors hover:text-root-dark"
		>
			See all demos →
		</a>
	</Container>
</section>
