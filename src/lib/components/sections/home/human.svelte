<!--
@component
Human — there is an actual person on the other end.

Short by design: a portrait, two paragraphs, a link to About. It's here to
make root feel like a small studio rather than a SaaS product, not to tell a
founder story.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { site } from '$lib/config/site';

	const photo = site.about.photo;
	const para = 'm-0 max-w-[480px] font-sans text-[17px] leading-[1.65] text-pretty text-clay';
</script>

<section class="section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="user-round" label="who you'll talk to">
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
							You won’t get handed off to an account manager.
						</h2>
						<div class="flex flex-col gap-4">
							<p class={para}>
								root is intentionally small. If you need something changed, you contact us, and the
								person responsible for your website is the one who answers. They already know your
								practice.
							</p>
							<p class={para}>
								No ticket queue. No support portal. When something needs changing, email a person.
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
