<!--
@component
Guide — the free guide, offered in full on the homepage.

Follows Care on purpose: that section says how we read a dental site,
and this one says the whole method is written down, 21 pages, free, and
asks only for an email to send it. The cover sits beside the copy so the
offer reads as a real thing you'd hold, not a newsletter box. The form
posts to /api/guide (see guide-form.svelte); the story behind the guide
gets one quiet link for people who'd rather read first.

Linen band between cream Care and cream "Small on purpose".
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { GuideForm } from '$lib/components/guide';
	import { guide } from '$lib/config/guide';
</script>

<section id="guide" class="scroll-mt-6 bg-linen section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="book-open" label="free guide">
				<div class="grid grid-cols-1 gap-8 sm:grid-cols-[168px_minmax(0,1fr)] sm:gap-10">
					<a
						href={guide.post}
						class="group block w-[148px] sm:w-full"
						aria-label="The guide’s cover. Read the story behind it."
					>
						<img
							src={guide.cover.small}
							alt={guide.cover.alt}
							width="560"
							height="725"
							loading="lazy"
							decoding="async"
							class="block h-auto w-full rounded-[3px] shadow-[0_28px_44px_-26px_rgba(26,23,21,0.6)] transition-transform duration-300 ease-out group-hover:-translate-y-1"
						/>
					</a>

					<div class="min-w-0">
						<p class="m-0 font-mono text-[12px] tracking-[0.04em] text-root-light uppercase">
							New · {guide.pages}-page PDF · free
						</p>
						<h2
							class="mt-3 mb-5 font-serif text-[28px] leading-[1.2] font-normal tracking-[-0.01em] text-balance text-ink"
						>
							{guide.title}.
						</h2>
						<p
							class="mb-4 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay"
						>
							Our whole way of reading a dental website, written down. Five checks you can run on
							your phone in ten minutes, then the deeper questions behind them, worked through on a
							real site, with a worksheet for the one fix you decide to make.
						</p>
						<p
							class="mb-7 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay"
						>
							Tell us where to send it.
						</p>

						<GuideForm placement="homepage" />

						<p class="mt-6 mb-0 font-sans text-[15px] leading-[1.6] text-clay">
							Rather read first?
							<a
								href={guide.post}
								class="text-root underline decoration-root/30 underline-offset-[3px] transition-colors hover:text-root-dark"
								>The story behind the guide</a
							>.
						</p>
					</div>
				</div>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
