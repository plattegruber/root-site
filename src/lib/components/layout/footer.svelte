<!--
@component
Footer — brand, secondary nav, copyright.

Uses the same nav source as the header so a route added once shows in both
places. Visible top border separates it from the page above.
-->
<script lang="ts">
	import { nav, site } from '$lib/config/site';
</script>

<footer class="border-t border-stone py-10">
	<div
		class="mx-auto flex w-full max-w-(--container-page) flex-wrap items-center justify-between gap-4 px-6"
	>
		<a
			href="/"
			class="font-serif text-[20px] text-ink no-underline tracking-[-0.5px]"
		>
			root.
		</a>

		<nav class="flex items-center gap-6" aria-label="Footer">
			{#each nav as link (link.id)}
				<a
					href={link.href}
					class="font-sans text-[13px] text-drift no-underline transition-colors duration-150 hover:text-charcoal"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<span class="font-sans text-[13px] text-drift">
			© {site.year} root.site
		</span>
	</div>
</footer>
