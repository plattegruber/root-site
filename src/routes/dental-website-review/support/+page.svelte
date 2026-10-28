<script lang="ts">
	import { Prose } from '$lib/components/editorial';
	import { site } from '$lib/config/site';
	import PageTitle from '../page-title.svelte';
</script>

<PageTitle title="Support" />

<Prose>
	<p>
		Email <a href="mailto:{site.email}">{site.emailDisplay}</a> with any question or problem about Dental
		Website Review. Please include the website you asked about and what went wrong. Never include patient
		information.
	</p>

	<h2>Common questions</h2>

	<h3>The review says something on my site is missing, but it’s there</h3>
	<p>
		Tell ChatGPT where it is (for example, “our insurance list is on the Patient Info page”) and ask
		it to look again. Some sites build menus or content with JavaScript, or put information in
		images, which is harder to read. If it still gets it wrong, email us the website and the page.
	</p>

	<h3>It says my online booking link doesn’t work</h3>
	<p>
		Many scheduling and form services refuse automated requests that a patient’s browser would pass.
		Open the link on your phone to confirm. If it works there, the review was wrong; please let us
		know.
	</p>

	<h3>It says it couldn’t read my site</h3>
	<p>
		The site may be blocking automated visitors, be temporarily down, or be too slow to respond. Try
		again in a few minutes. Our tools also follow the site’s robots.txt rules.
	</p>

	<h3>It says it has reached a limit</h3>
	<p>
		To keep the service available for everyone, there are limits on how many requests can be made in
		a short time and per day. Wait a few minutes, or try again tomorrow.
	</p>

	<h3>I own a website and don’t want it reviewed</h3>
	<p>
		Our tools identify themselves as <code>DentalWebsiteReview</code> and follow robots.txt. Add a rule
		for that user agent to your robots.txt, or email us and we’ll help.
	</p>

	<h3>How do I remove the plugin?</h3>
	<p>Open ChatGPT’s settings, find Dental Website Review under plugins, and disconnect it.</p>

	<h2>Privacy and terms</h2>
	<p>
		Read the <a href="/dental-website-review/privacy">privacy policy</a> and
		<a href="/dental-website-review/terms">terms of use</a>.
	</p>
</Prose>
