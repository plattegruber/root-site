<!--
@component
Free resources hero — page title plus the framing paragraph.

The paragraph does the positioning work for the whole page: these are
pieces of root's own tooling that stand on their own, and the parts that
only make sense together are what the service is. Keep it plain; the
implication carries itself.
-->
<script lang="ts">
	import { Container } from '$lib/components/ui';
</script>

<section class="section-py" style="padding-bottom: var(--section-sm-v-padding)">
	<Container>
		<h1 class="mb-3 font-serif text-page-title font-normal text-ink">Free resources</h1>
		<p class="m-0 max-w-[560px] font-sans text-[17px] leading-[1.6] text-clay">
			Everything here began as something we built for root’s own dental clients. Each one turned out
			to work on its own, so we opened it up. The pieces that only make sense together stay part of
			the service.
		</p>
	</Container>
</section>
