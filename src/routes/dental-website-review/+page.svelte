<script lang="ts">
	import { Prose } from '$lib/components/editorial';
	import { site } from '$lib/config/site';
	import PageTitle from './page-title.svelte';
</script>

<PageTitle title="Dental Website Review" />

<Prose>
	<p>
		Dental Website Review is a free ChatGPT plugin from root. It reviews a dental practice’s website
		the way patients actually use it, and tells the dentist and their web developer what to fix
		first. It’s the same framework root uses when building and reviewing sites, and it costs nothing
		to run.
	</p>

	<h2>How to use it</h2>
	<p>
		In ChatGPT, add Dental Website Review from the plugin directory, then ask something like “Review
		my dental practice website: yourpractice.com”. You can also ask for one thing, such as “Is my
		site easy to use on a phone?” or “What should my web developer fix first?”
	</p>

	<h2>What it looks at</h2>
	<p>
		ChatGPT reads the practice’s public website like an experienced dental web developer would,
		walking through it as eight kinds of patient: someone in pain looking for an emergency
		appointment, a family choosing a new dentist, a nervous patient, someone interested in cosmetic
		work, someone who wants to book quickly, an older patient, someone checking insurance and cost,
		and someone who wants answers online. Along the way it checks:
	</p>
	<ul>
		<li>Whether a patient can call and book from their phone without hunting.</li>
		<li>Whether insurance, payment, new-patient and emergency information is easy to find.</li>
		<li>How the site looks and works in a real phone browser.</li>
		<li>Page titles, structured data and other basics search engines rely on.</li>
		<li>Accessibility basics, such as image descriptions and labelled form fields.</li>
		<li>
			Privacy risks, such as advertising trackers on pages where patients enter health information.
		</li>
	</ul>

	<h2>What it doesn’t do</h2>
	<ul>
		<li>It only reads public pages. It doesn’t log in to anything or ask for passwords.</li>
		<li>It never submits forms, books appointments or contacts the practice.</li>
		<li>It doesn’t need, and shouldn’t be given, any patient information.</li>
		<li>
			It doesn’t give legal advice or promise search rankings. Privacy and accessibility points are
			things to confirm with a qualified adviser.
		</li>
	</ul>

	<h2>If you’d rather a person went through it</h2>
	<p>
		The plugin is a self-serve version of the review. If you’d like a human to go through your site
		the same way and tell you what they’d fix or build,
		<a href="/#contact">tell root about your practice</a> and include the website. That’s free too, and
		it doesn’t oblige you to anything.
	</p>

	<h2>Who makes it</h2>
	<p>
		Dental Website Review is made by root., a web studio that builds websites for independent dental
		practices. root. is operated by {site.legal.entity}. Questions go to
		<a href="mailto:{site.email}">{site.emailDisplay}</a>.
	</p>
	<p>
		See also <a href="/dental-website-review/support">support</a>,
		<a href="/dental-website-review/privacy">privacy</a> and
		<a href="/dental-website-review/terms">terms</a>.
	</p>
</Prose>
