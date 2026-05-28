<!--
@component
About process — four numbered steps with mono indices.

The numbers (01, 02…) and the divider lines do all the structural work,
so the copy can stay conversational.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';

	const steps = [
		{
			title: 'You reach out',
			text: 'Email, the form on the homepage — whatever’s easiest. Tell me about your practice. You don’t need a brief or a list of requirements. Just tell me who you are.'
		},
		{
			title: 'I do the homework',
			text: 'I look at your current site, your reviews, your area. I come back with a plan: what I’d build, what it’d look like, and why.'
		},
		{
			title: 'I build it',
			text: 'Custom design, built from scratch. Not a template. You see drafts along the way and tell me what you think. Takes about two weeks.'
		},
		{
			title: 'Then I take care of it',
			text: 'Hosting, speed, security, updates. You email me when you need something changed, and I change it. That’s the whole arrangement.'
		}
	];
</script>

<section class="section-py bg-linen">
	<Container>
		<h2 class="mb-10 font-serif text-[28px] font-normal leading-[1.25] tracking-[-0.01em] text-ink">
			How I work
		</h2>

		<ol class="m-0 flex list-none flex-col gap-0 p-0">
			{#each steps as step, i (step.title)}
				<li
					class="flex items-start gap-5 py-6 {i === 0
						? ''
						: 'border-t border-stone'}"
				>
					<span
						class="w-6 shrink-0 pt-0.5 font-mono text-[13px] text-drift"
						aria-hidden="true"
					>
						{String(i + 1).padStart(2, '0')}
					</span>
					<div>
						<h3
							class="m-0 mb-1.5 font-sans text-[17px] font-semibold leading-[1.4] text-charcoal"
						>
							{step.title}
						</h3>
						<p
							class="m-0 max-w-[480px] font-sans text-[15px] leading-[1.6] text-clay"
						>
							{step.text}
						</p>
					</div>
				</li>
			{/each}
		</ol>
	</Container>
</section>
