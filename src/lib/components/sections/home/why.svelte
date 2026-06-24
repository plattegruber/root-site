<!--
@component
Why me — the person behind the work. Opens with a hairline that ties it to
the Pitch above (both sit on the cream band), then a short engineer's bio:
a decade of building real systems, now pointed at dental practices. The
negative top margin tightens the gap so the hairline reads as a divider
between two halves of one thought rather than a new section break.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import { Divider } from '$lib/components/ui';
</script>

<section class="-mt-10" style="padding-bottom: var(--section-v-padding)">
	<EdWrap>
		<Reveal class="mb-[52px]">
			<MarginRow>
				<Divider />
			</MarginRow>
		</Reveal>

		<Reveal>
			<MarginRow icon="user-round" label="why me">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					I’ve built software for over ten years. Now I build it for dentists.
				</h2>
				<p class="mb-5 max-w-[520px] font-sans text-[17px] leading-[1.65] text-clay">
					I’m an engineer with more than a decade of building real systems — the kind that have to
					work every day, for years. I chose dentistry on purpose: it’s an industry stuck with slow,
					generic, overpriced websites, and it deserves better.
				</p>
				<p class="m-0 max-w-[520px] font-sans text-[17px] leading-[1.65] text-clay">
					No agency, no account managers, no handoffs. The person who builds your site is the one
					who answers your email — and dental sites are the only thing I make.
				</p>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
