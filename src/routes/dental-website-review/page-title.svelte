<!--
@component
Heading block for the Dental Website Review pages: title plus an optional
"last updated" line for the legal pages.
-->
<script lang="ts">
	let { title, updated }: { title: string; updated?: { iso: string; display: string } } = $props();
</script>

<header class="mb-10">
	<h1 class="m-0 font-serif text-[36px] leading-[1.15] font-normal tracking-[-0.015em] text-ink">
		{title}
	</h1>
	{#if updated}
		<p class="mt-4 mb-0 font-sans text-[14px] leading-[1.5] text-clay">
			Last updated <time datetime={updated.iso}>{updated.display}</time>
		</p>
	{/if}
</header>
