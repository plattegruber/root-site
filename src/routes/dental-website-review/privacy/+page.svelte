<script lang="ts">
	import { Prose } from '$lib/components/editorial';
	import { site } from '$lib/config/site';
	import PageTitle from '../page-title.svelte';
</script>

<PageTitle title="Privacy policy" updated={{ iso: '2026-10-27', display: 'October 27, 2026' }} />

<Prose>
	<p>
		This policy covers Dental Website Review, a ChatGPT plugin made by root., which is operated by
		Ook Studio LLC (“we”). It explains what the plugin receives when you use it, what we keep, and
		who else is involved. It doesn’t cover the rest of root.site or ChatGPT itself.
	</p>

	<h2>The short version</h2>
	<ul>
		<li>The plugin reviews public websites. It doesn’t need anything about you or any patient.</li>
		<li>We don’t receive your ChatGPT conversation, only what ChatGPT sends to our tools.</li>
		<li>We keep short operational logs with no page content, prompts or answers.</li>
		<li>We don’t sell data, use it for advertising, or build profiles of people.</li>
	</ul>

	<h2>What the plugin receives</h2>
	<p>When ChatGPT uses one of the plugin’s tools, our server receives:</p>
	<ul>
		<li>
			<strong>The web addresses to review,</strong> such as a practice’s homepage or the pages ChatGPT
			chooses to read, and, for the visual summary, the review ChatGPT wrote.
		</li>
		<li>
			<strong>Information ChatGPT attaches to each request:</strong> an anonymous identifier OpenAI generates
			in place of your account, your language setting, and your approximate country.
		</li>
		<li><strong>Your connection’s IP address,</strong> which in practice belongs to OpenAI.</li>
	</ul>
	<p>
		Please don’t type patient information, passwords or other private details into a request that
		uses the plugin. The plugin has no use for them.
	</p>

	<h2>What the plugin does with websites</h2>
	<p>
		The plugin visits the public pages it is asked about, the way a browser would, and follows the
		site’s robots.txt rules. It identifies itself as <code>DentalWebsiteReview</code>. It doesn’t
		log in, submit forms, book appointments or contact anyone. Page content is used to answer the
		request and isn’t stored afterwards.
	</p>

	<h2>What we keep</h2>
	<ul>
		<li>
			<strong>Usage logs.</strong> For each tool request we log which tool ran, how long it took, whether
			it worked, the domain of the website reviewed, the number of pages, your language and country setting,
			and a scrambled version of OpenAI’s anonymous identifier (we hash it with a secret key, so it can’t
			be linked back without that key). We use these logs to keep the service working, prevent abuse and
			understand which features are used. They don’t contain page content, prompts or answers.
		</li>
		<li>
			<strong>Rate limiting.</strong> To stop overuse, the server counts recent requests per scrambled
			identifier (or per IP address when there isn’t one). These counts are held in memory only and expire
			within a day.
		</li>
	</ul>
	<p>
		Logs are stored by our hosting provider’s logging service and kept only for a limited time. We
		don’t combine them with other data or use them to identify individuals.
	</p>

	<h2>Who else is involved</h2>
	<ul>
		<li>
			<strong>OpenAI</strong> runs ChatGPT. What you type in ChatGPT, and what our tools send back, is
			handled under OpenAI’s own privacy policy.
		</li>
		<li><strong>Fly.io</strong> hosts our server and its logs.</li>
		<li>
			<strong>Google PageSpeed Insights,</strong> when page-speed measurement is used, receives the public
			web address being measured.
		</li>
		<li><strong>The websites being reviewed</strong> receive ordinary visits from the plugin.</li>
	</ul>
	<p>
		We may disclose information if the law requires it. We don’t sell or rent data, or share it for
		advertising.
	</p>

	<h2>Children</h2>
	<p>
		The plugin is for dental practices and the people who build their websites. It isn’t directed at
		children, and we don’t knowingly collect information from them.
	</p>

	<h2>Your choices</h2>
	<p>
		You can stop using the plugin at any time by disconnecting it in ChatGPT’s settings. Because our
		logs don’t identify you directly, we usually can’t find a particular person’s entries, but if
		you have a question or request about your information, email
		<a href="mailto:{site.email}">{site.emailDisplay}</a> and we’ll help as far as we can.
	</p>

	<h2>Changes</h2>
	<p>
		If we change what the plugin collects or who it shares data with, we’ll update this page and the
		date at the top before the change takes effect.
	</p>

	<h2>Contact</h2>
	<p>
		Ook Studio LLC, operating root. — <a href="mailto:{site.email}">{site.emailDisplay}</a>
	</p>
</Prose>
