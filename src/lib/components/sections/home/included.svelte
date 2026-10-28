<!--
@component
Everything handled — the scope of the service, then how it goes.

Six rows a dentist can repeat back, written as what stops being their
job. Then the process in one compact row of three steps, because building
the site is not a six-week engagement and shouldn't read like one. The
full spec sheet lives on /whats-included.
-->
<script lang="ts">
	import { EdWrap, MarginRow, Reveal } from '$lib/components/editorial';
	import TermList from './term-list.svelte';

	const items = [
		{
			term: 'Design and build',
			text: 'A custom site, designed and coded around your practice. Not a template with your logo swapped in.'
		},
		{
			term: 'The words',
			text: 'We interview you and write every page in plain English. You approve it before anything goes live.'
		},
		{
			term: 'Hosting and upkeep',
			text: 'Fast hosting, daily backups, security, and the updates that keep it that way.'
		},
		{
			term: 'Changes, whenever',
			text: 'New hours, a new associate, a new service: email us and it’s done, usually the same day.'
		},
		{
			term: 'Your Google Business Profile',
			text: 'Kept accurate and complete: hours, services, categories, photos, and the fixes when Google gets something wrong.'
		},
		{
			term: 'Local search fundamentals',
			text: 'Page titles, structured data, Search Console, and a site that agrees with your Google listing. The groundwork, not a ranking campaign.'
		}
	];

	const steps = [
		'Show us your practice',
		'We build it, you approve it',
		'We keep taking care of it'
	];
</script>

<section class="section-py">
	<EdWrap>
		<Reveal>
			<MarginRow icon="layers" label="what's handled">
				<h2
					class="mb-6 font-serif text-[28px] leading-[1.25] font-normal tracking-[-0.01em] text-ink"
				>
					Everything handled.
				</h2>
				<p class="mb-8 max-w-[520px] font-sans text-[17px] leading-[1.65] text-pretty text-clay">
					One monthly price covers the website and everything around it, so none of it is your job.
				</p>

				<TermList {items} />

				<ol
					class="mt-8 mb-0 flex list-none flex-wrap gap-x-8 gap-y-3 border-t border-stone p-0 pt-6"
				>
					{#each steps as step, i (step)}
						<li class="flex items-baseline gap-3 font-sans text-[15px] text-charcoal">
							<span class="font-mono text-[12px] text-root-light" aria-hidden="true"
								>{String(i + 1).padStart(2, '0')}</span
							>
							{step}
						</li>
					{/each}
				</ol>

				<p class="mt-7 mb-0 max-w-[520px] font-sans text-[15px] leading-[1.6] text-clay">
					The detailed version lives on
					<a
						href="/whats-included"
						class="text-root underline decoration-root/30 underline-offset-[3px] transition-colors hover:text-root-dark"
					>
						what’s included</a
					>. Everything there comes with every site.
				</p>
			</MarginRow>
		</Reveal>
	</EdWrap>
</section>
