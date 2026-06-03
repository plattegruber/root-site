<!--
@component
Demos teaser — a short pointer from the homepage to the full /demos page.

Surfaces the live example practices inline so a prospect can click straight
into a real site, then links onward to the rest. Coming-soon entries are
left for the /demos page; the homepage only shows what's clickable today.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import { demos } from '$lib/config/demos';

	const live = demos.filter((d) => d.url && !d.comingSoon);
</script>

<section class="section-py">
	<Container>
		<h2 class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink">
			See it in action
		</h2>
		<p class="mb-8 max-w-[560px] font-sans text-hero-sub text-clay">
			I build example practices you can actually click through — real sites, top to bottom. Here’s
			one to start; more on the way.
		</p>

		<ul class="m-0 mb-8 flex list-none flex-col p-0">
			{#each live as demo (demo.name)}
				<li>
					<a
						href={demo.url}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-baseline gap-3 border-t border-stone py-5 no-underline"
					>
						<span
							class="font-serif text-[20px] leading-tight font-normal text-ink transition-colors duration-150 group-hover:text-root"
						>
							{demo.name}
						</span>
						<span class="font-mono text-[13px] text-drift">{demo.category}</span>
						<span
							aria-hidden="true"
							class="ml-auto self-center font-sans text-[15px] text-drift transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-root"
							>↗</span
						>
					</a>
				</li>
			{/each}
		</ul>

		<a
			href="/demos"
			class="font-sans text-[15px] text-root underline decoration-root/30 underline-offset-2 transition-colors hover:text-root-dark"
		>
			See all demos →
		</a>
	</Container>
</section>
