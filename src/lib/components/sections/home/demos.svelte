<!--
@component
Demos teaser — a short pointer from the homepage to the full /demos page.

Leads with a screengrab of the featured (first live) demo, presented like a
plate in a book: framed image, then a hairline, then the practice name and a
"Visit" link. Then a pointer onward to the rest. bg-linen keeps the
section-color alternation going (between cream Process and ink Contact).
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { demos } from '$lib/config/demos';

	const featured = demos.find((d) => d.url && !d.comingSoon);
</script>

<section id="demos" class="bg-linen section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="eye" label="see it live">
				<h2
					class="mb-5 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					See it in action
				</h2>
				<p class="m-0 max-w-[520px] font-sans text-[17px] leading-[1.65] text-clay">
					A real practice site you can click through, built top to bottom. Here’s one to start —
					more on the way.
				</p>
			</MarginRow>
		</Reveal>

		{#if featured}
			<Reveal delay={100} class="mt-12">
				<figure class="m-0">
					{#if featured.image}
						<div class="overflow-hidden rounded-md border border-stone bg-linen">
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

					<div
						class="mt-[18px] flex items-baseline justify-between gap-4 border-t border-stone pt-[18px]"
					>
						<div>
							<div class="font-serif text-[22px] leading-tight font-normal text-ink">
								{featured.name}
							</div>
							<div class="mt-1.5 font-mono text-[12px] tracking-[0.02em] text-drift">
								{featured.category}
							</div>
						</div>
						<a
							href={featured.url}
							target="_blank"
							rel="noopener noreferrer"
							class="shrink-0 font-sans text-[15px] font-medium whitespace-nowrap text-root no-underline transition-colors hover:text-root-dark"
						>
							Visit ↗
						</a>
					</div>
				</figure>
			</Reveal>
		{/if}

		<div class="mt-7">
			<a
				href="/demos"
				class="font-sans text-[15px] font-medium text-root underline decoration-root/30 underline-offset-2 transition-colors hover:text-root-dark"
			>
				See all demos →
			</a>
		</div>
	</EdWrap>
</section>
