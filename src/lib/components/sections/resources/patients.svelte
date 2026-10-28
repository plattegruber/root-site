<!--
@component
The eight patients — the clearest proof that Dental Website Review knows
dentistry rather than just HTML: who it walks the site as, and the one
thing each of them needs from it.

Sits on the same linen band as the review feature so it reads as part of
that tool, not a new topic. Four across on wide screens, two on phones; the
mono numbers tie it to the numbered feel of the rest of the page.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
	import { patients } from '$lib/config/resources';
</script>

<section class="bg-linen" style="padding-bottom: var(--section-v-padding)">
	<Container wide>
		<div class="border-t border-stone pt-10">
			<div class="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<h3
					class="m-0 max-w-[460px] font-serif text-[28px] leading-[1.2] font-normal tracking-[-0.01em] text-ink"
				>
					The eight patients it reads your site as.
				</h3>
				<p class="m-0 max-w-[440px] font-sans text-[15px] leading-[1.6] text-pretty text-clay">
					A generic audit checks the HTML. This one asks whether each of these people would find
					what they came for, and names the page where they wouldn’t.
				</p>
			</div>

			<ol class="m-0 grid list-none grid-cols-2 gap-x-8 gap-y-8 p-0 md:grid-cols-4">
				{#each patients as patient, i (patient.who)}
					<li class="border-t border-stone pt-4">
						<span class="block font-mono text-[12px] tracking-[0.04em] text-root-light"
							>{String(i + 1).padStart(2, '0')}</span
						>
						<span class="mt-2 block font-serif text-[21px] leading-[1.25] text-ink"
							>{patient.who}</span
						>
						<span class="mt-2 block font-sans text-[14px] leading-[1.55] text-pretty text-clay"
							>{patient.needs}</span
						>
					</li>
				{/each}
			</ol>
		</div>
	</Container>
</section>
