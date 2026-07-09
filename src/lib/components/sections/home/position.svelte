<!--
@component
Position — the idea the rest of the page argues for.

Opens on the patient's quiet look-up rather than the service spec, and frames
the site as a room in the practice. Deliberately short: it sets the standard
that the Problem section then shows the market failing to meet.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
</script>

<section class="section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="door-open" label="the idea">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					Your website should feel as cared-for as your office.
				</h2>
				<p class="m-0 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay">
					Most patients look you up before they ever call. The site they land on is the first room
					they walk into — and it should feel like the practice you actually run: calm, clear, and
					looked after.
				</p>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
