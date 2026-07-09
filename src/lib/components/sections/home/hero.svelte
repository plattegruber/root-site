<!--
@component
Hero — full-bleed ink section that names the category in the first breath.

A mono eyebrow sets context, the display sentence says plainly what this is,
and a short subtext draws the line against templates. Two CTAs (review, then
demos) sit above a hairline and the mono price line, so the offer and its
price are both legible before a scroll.
-->
<script lang="ts">
	import { EdWrap } from '$lib/components/editorial';
	import { Button, Divider } from '$lib/components/ui';
</script>

<section class="hero-py">
	<EdWrap>
		<div class="mb-[30px] font-mono text-[13px] tracking-[0.04em] text-root-light">
			root.site — websites for dental practices
		</div>

		<h1 class="m-0 max-w-[780px] font-serif text-hero-display font-normal text-balance text-cream">
			Custom dental websites, kept current.
		</h1>

		<p class="mt-8 mb-0 max-w-[560px] font-sans text-hero-sub text-pretty text-drift">
			I build and manage websites for independent dental practices — custom design, Google-ready
			foundations, ongoing updates. No template pretending to know your office.
		</p>

		<div class="mt-10 flex flex-wrap gap-3.5">
			<Button href="#contact">
				Get a free website review
				<span aria-hidden="true">→</span>
			</Button>
			<Button variant="secondaryDark" href="#demos">See example sites</Button>
		</div>

		<div class="mt-[52px] max-w-[600px]">
			<Divider dark />
			<p class="mt-5 font-mono text-[14px] tracking-[0.01em] text-drift">
				<span class="text-cream">$250</span>/month · flat fee · no contract
			</p>
		</div>
	</EdWrap>
</section>
