<!--
@component
Meet Platte — there is one actual person on the other end, and he builds
the sites.

Short by design: the portrait, a name, two paragraphs, a link to About.
It establishes who is accountable before the visitor reaches the price,
so the price reads as "that person, for that much" rather than as the
headline. The longer background stays on /about.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { site } from '$lib/config/site';

	const photo = site.about.photo;
	const para = 'm-0 max-w-[480px] font-sans text-[17px] leading-[1.65] text-pretty text-clay';
</script>

<section class="bg-linen section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="user-round" label="who does the work">
				<div class="flex flex-wrap items-start gap-10">
					{#if photo.src}
						<img
							src={photo.src}
							alt={photo.alt}
							width="160"
							height="192"
							loading="lazy"
							decoding="async"
							class="h-[192px] w-[160px] shrink-0 rounded-md border border-stone object-cover"
						/>
					{/if}
					<div class="min-w-[260px] flex-1">
						<h2
							class="mb-5 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
						>
							One person who knows your website.
						</h2>
						<div class="flex flex-col gap-4">
							<p class={para}>
								I’m {site.person.givenName}. I build the websites, write the code, and take care of
								them after launch.
							</p>
							<p class={para}>
								No account managers or support queues. When you need something, you email the person
								who built your site, and that person already knows your practice.
							</p>
						</div>
						<p class="mt-6 mb-0">
							<a
								href="/about"
								class="font-sans text-[15px] font-medium text-root underline decoration-root/30 underline-offset-[3px] transition-colors hover:text-root-dark"
							>
								More about root →
							</a>
						</p>
					</div>
				</div>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
