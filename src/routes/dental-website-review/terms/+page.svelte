<script lang="ts">
	import { Prose } from '$lib/components/editorial';
	import { site } from '$lib/config/site';
	import PageTitle from '../page-title.svelte';
</script>

<PageTitle title="Terms of use" updated={{ iso: '2026-10-27', display: 'October 27, 2026' }} />

<Prose>
	<p>
		These terms apply to Dental Website Review, a ChatGPT plugin made by root., which is operated by
		Ook Studio LLC (“we”). By using the plugin you agree to them. Your use of ChatGPT itself is
		covered by OpenAI’s terms.
	</p>

	<h2>What the service is</h2>
	<p>
		The plugin gives ChatGPT tools to read public websites and check how they work on a phone, so it
		can review a dental practice’s website. It is free to use. We may change it, limit it or stop
		offering it at any time.
	</p>

	<h2>Using it responsibly</h2>
	<p>You agree not to:</p>
	<ul>
		<li>Send patient information, passwords or other private data through the plugin.</li>
		<li>
			Use it to overload, attack or get around the security of any website, or of our service.
		</li>
		<li>Try to get around its usage limits, or use it to collect data in bulk.</li>
		<li>Use it for anything unlawful.</li>
	</ul>

	<h2>Informational only</h2>
	<p>
		Reviews are written by ChatGPT using our tools and guidance. They are general information about
		a website, for discussion with the people who look after it, and they can be wrong or
		incomplete. They are not legal, regulatory, medical, financial or other professional advice, and
		they don’t guarantee any search ranking, number of patients or other result.
	</p>
	<p>
		Have a qualified person, such as your web developer, a lawyer or your state dental board, review
		anything in a review before you act on it, especially privacy, accessibility and advertising
		points. You are responsible for any decision or change you make based on a review.
	</p>

	<h2>No warranty</h2>
	<p>
		The service is provided “as is” and “as available”, without warranties of any kind, express or
		implied, including fitness for a particular purpose, accuracy and non-infringement, to the
		extent the law allows.
	</p>

	<h2>Limitation of liability</h2>
	<p>
		To the extent the law allows, we aren’t liable for any indirect, incidental, special,
		consequential or punitive damages, or for lost profits, revenue, data or goodwill, arising from
		your use of the plugin or its reviews. Because the service is free and informational only, our
		total liability for all claims relating to it is limited to $10.
	</p>

	<h2>Websites and other services</h2>
	<p>
		The plugin reads websites we don’t control. We aren’t responsible for their content. Website
		owners who don’t want their site reviewed can block our tools in robots.txt, as described on the <a
			href="/dental-website-review/support">support page</a
		>.
	</p>

	<h2>Privacy</h2>
	<p>
		The <a href="/dental-website-review/privacy">privacy policy</a> explains what the plugin receives
		and keeps.
	</p>

	<h2>Changes</h2>
	<p>
		We may update these terms. The date at the top shows when they last changed. Continuing to use
		the plugin after a change means you accept the updated terms.
	</p>

	<h2>Governing law</h2>
	<p>These terms are governed by the laws of the State of Nebraska, USA.</p>

	<h2>Contact</h2>
	<p>
		Ook Studio LLC, operating root. — <a href="mailto:{site.email}">{site.emailDisplay}</a>
	</p>
</Prose>
