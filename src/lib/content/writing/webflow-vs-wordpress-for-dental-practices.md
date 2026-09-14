---
title: 'Webflow vs WordPress for Dental Practices'
date: 2026-08-24
excerpt: An even-handed comparison for practice owners — real 2026 pricing, current security and speed data, and the HIPAA question neither platform's marketing will answer.
faq:
  - q: 'Is Webflow or WordPress better for a dental practice?'
    a: 'Neither is better in the abstract. Webflow suits a practice that wants a good-looking site with no maintenance burden and no in-house technical help. WordPress suits a practice that values outright ownership and portability, or needs a specific integration. In 2026 field data Webflow sites pass Core Web Vitals more often (71% vs 48%), but WordPress gives you software you own outright and can move anywhere.'
  - q: 'Is WordPress secure enough for a dental website?'
    a: 'WordPress core is solid — only six vulnerabilities were disclosed in core during all of 2025, all low priority. The risk lives in plugins, which accounted for 91% of the 11,334 vulnerabilities disclosed across the WordPress ecosystem that year. A maintained WordPress site is fine. An unmaintained one is a liability, and the median time from public disclosure to mass exploitation is about five hours.'
  - q: 'Will Webflow or WordPress sign a HIPAA business associate agreement?'
    a: "Webflow will not — its acceptable use policy explicitly prohibits using the service to collect, store, or process protected health information. WP Engine, the largest managed WordPress host, prohibits PHI just as explicitly. Kinsta's terms are silent, which amounts to the same answer. The practical conclusion is the same on any platform: don't collect clinical information through your website form."
  - q: 'How much does a Webflow site cost in 2026?'
    a: "Webflow restructured its plans in May 2026. A single dental site needs a Basic site plan at $15/month billed yearly ($180/year) or Premium at $25/month ($300/year) if you want the CMS. Code export requires a paid Workspace plan on top, starting at $19/month. That's platform cost only — design and maintenance are separate."
  - q: 'Can I move my site off Webflow or WordPress later?'
    a: "WordPress exports cleanly — you own the database and files and can move to any host. The caveat is that page-builder layouts often don't survive the move, so your content is portable even when your design isn't. Webflow's code export gives you static HTML, CSS and JS, but is widely documented to exclude CMS content, forms, site search, and password protection, so you get a front-end snapshot rather than a working site."
---

For most dental practices this turns out to be the wrong question, because roughly 70% of dentist websites run on neither platform — they're on closed vendor systems like ProSites, Officite, or PBHS, where the real issue isn't Webflow versus WordPress but whether you can export anything at all. If you genuinely are choosing between the two: Webflow performs better in the field and requires no maintenance, WordPress gives you software you own outright and can take anywhere, and neither will sign a HIPAA business associate agreement.

I build hand-coded sites and use neither, which means I have no affiliate relationship with either and no reason to flatter one. It also means you should discount my third-position argument accordingly, and I'll give you the data to do that.

## TL;DR

- **Webflow is faster in the field:** 71% of Webflow sites pass Core Web Vitals vs 48% of WordPress sites (August 2026).
- **But hand-coding is no guarantee** — Next.js sites pass at just 35%, worse than WordPress. Platform matters less than the build.
- **WordPress core is secure; plugins are the problem.** 91% of the 11,334 vulnerabilities disclosed in 2025 were in plugins. Core had six, all low priority.
- **Neither signs a BAA.** Webflow explicitly bans PHI. So does WP Engine. Keep patient information off your website form regardless of platform.
- **Webflow costs $180–$300/year** in platform fees. Self-hosted WordPress realistically runs $800–$3,000/year, nearly all of it labor.
- **WordPress exports cleanly. Webflow's export is partial.**

## The question most practices should be asking

One census of roughly 170,000 dentist websites found WordPress powering about 30% of them — notably _below_ the ~41% web-wide average. The gap is made up by closed dental vendor platforms.

So for most practice owners reading this, the live question isn't which of these two to pick. It's whether you should be on a vendor platform you cannot leave. I covered that in [do you actually own your dental website?](https://root.site/writing/do-you-actually-own-your-dental-website) — and if you're currently on ProSites or similar, read that one first. Both Webflow and WordPress are improvements on that situation.

## What each actually costs

**Webflow** restructured its pricing on 13 May 2026, merging the CMS and Business plans into "Premium." Anything you read from before then is stale.

<div class="table-wrap">
<table>
<thead>
<tr><th>Plan</th><th>Billed yearly</th><th>What a practice gets</th></tr>
</thead>
<tbody>
<tr><td>Basic</td><td>$15/mo ($180/yr)</td><td>Custom domain, 300 static pages, unlimited form submissions</td></tr>
<tr><td>Premium</td><td>$25/mo ($300/yr)</td><td>Adds CMS, site search, file uploads</td></tr>
<tr><td>Workspace Core</td><td>$19/mo</td><td>Required for code export</td></tr>
</tbody>
</table>
</div>

So a single-location dental site is **$180–$300 a year** in Webflow fees, plus a domain, plus whoever designs and maintains it. Ignore the "$113–128 a month realistic cost" figures floating around — those are for B2B marketing teams with multiple seats and add-ons.

**WordPress** is where "free" gets complicated. The software is genuinely free and genuinely yours. The site is not:

- Hosting: $3–$15/mo shared, $20–$80/mo managed
- Premium theme: $0–$200 up front, often $59–$99/yr for updates
- Plugins: $200–$800/yr for a business site
- Security and backups: $50–$1,000/yr
- Maintenance retainer: $50–$200/mo

A dental practice on self-hosted WordPress that is _actually being maintained_ runs somewhere around **$800–$3,000 a year**, and the large majority of that is labor. The software being free doesn't make the site free; it moves the cost to whoever patches it.

(WordPress.com is a different product from self-hosted WordPress. Its Business tier — the cheapest that allows plugins — is $25/mo billed yearly but renews at $45/mo. Watch the renewal gap.)

## Speed

Here's the field data, from HTTP Archive's August 2026 crawl. This is the share of real sites on each platform passing all three Core Web Vitals — Google's actual thresholds, measured on real visitors.

<div class="table-wrap">
<table>
<thead>
<tr><th>Platform</th><th>Origins measured</th><th>Passing Core Web Vitals</th></tr>
</thead>
<tbody>
<tr><td>Hugo</td><td>6,269</td><td>77%</td></tr>
<tr><td><strong>Webflow</strong></td><td>61,832</td><td><strong>71%</strong></td></tr>
<tr><td>Astro</td><td>45,891</td><td>71%</td></tr>
<tr><td>All technologies</td><td>8,900,615</td><td>53%</td></tr>
<tr><td><strong>WordPress</strong></td><td>2,809,159</td><td><strong>48%</strong></td></tr>
<tr><td>Next.js</td><td>383,143</td><td>35%</td></tr>
</tbody>
</table>
</div>

Webflow genuinely beats WordPress here, by 23 points. That's real and I won't talk it down.

Three honest qualifications, though:

**Next.js — a hand-coded JavaScript framework — is dead last at 35%.** Worse than WordPress. If you take nothing else from this post, take that: hand-built does not mean fast. It buys you the ceiling, not the result. Anyone selling you custom development on speed grounds should have to explain that number.

**Webflow's pages aren't actually lighter.** Median page weight is 3 MB on Webflow and 3 MB on WordPress — both above the 2 MB web-wide median. Webflow's advantage is delivery, not restraint.

**Selection bias is doing some work.** Webflow's 61,832 origins skew toward design-led companies who paid someone competent. WordPress's 2.8 million includes every abandoned site on the internet. Half of WordPress sites already pass. "WordPress is slow" is wrong as stated; "WordPress is slower on average, mostly because of what gets bolted onto it" is right.

## Security

This is WordPress's real weakness, and it's worth being precise about where it lives.

Patchstack's _State of WordPress Security in 2026_ found **11,334 new vulnerabilities** disclosed across the WordPress ecosystem during 2025 — up 42% year over year. The breakdown matters more than the total:

- **91%** were in plugins
- **9%** were in themes
- **6** were in WordPress core itself, all low priority

Wordfence's independent reporting corroborates the scale, having tracked a 68% rise in 2024 and projected well over 10,000 disclosures for 2025.

Two figures from that report that should shape how you think about maintenance: **46% of vulnerabilities were not patched by the vendor in time for public disclosure**, and the **median time from disclosure to mass exploitation is about five hours**. Monthly patching is not fast enough for a plugin that's actively being exploited the same afternoon.

You'll also see the statistic that 95.5% of hacked sites are WordPress. That number is real but nearly meaningless — WordPress is 40.7% of the web and a far larger share of the sites that get scanned by cleanup services. It tracks market share, not fragility. The more useful figure from the same source: only **39.1% of infected sites had an outdated core** at the time of infection. Six in ten were running current WordPress and got in through something else.

The structural point is simple. WordPress.org lists over **72,000 free plugins**, and a typical dental site runs 15–30 of them. Each is third-party code with its own update cadence and its own maintainer who may or may not still be around. Webflow's equivalent number is zero — there's no plugin layer to patch. That's the honest difference, and it's more persuasive than any hacked-site percentage.

To be fair to WordPress: core itself is well-defended, automatic background updates have measurably cut core exploitation, and a WordPress site with a real maintenance relationship is perfectly safe. The problem isn't WordPress. It's unmaintained WordPress, which is most of it.

> If you're not sure what your current site is running or when it was last updated, the [free visibility audit](https://root.site/#contact) covers that — platform, plugin count, load speed, and whether anything's obviously out of date. Plain list, no pitch.

## HIPAA: the dental-specific part nobody covers

I read the entire first page of results for this comparison. Not one of them mentions HIPAA. For a dental practice that's the most consequential thing on the page, so here it is.

**Webflow's Acceptable Use Policy explicitly prohibits it.** Section 8 states users must not use the service to collect, store, or process any protected health information subject to HIPAA. Webflow does not sign business associate agreements, and HIPAA is conspicuously absent from its otherwise long compliance list (ISO 27001, SOC 2, PCI-DSS, and others).

**WP Engine — the largest managed WordPress host — prohibits it just as explicitly.** Its AUP states you are not permitted to use the services to store or process protected health information as defined under HIPAA, and that WP Engine is not responsible for liabilities arising from violating that restriction. I checked its full terms of service: HIPAA appears nowhere. Kinsta's terms are silent on the subject, which functionally amounts to the same answer — without a signed BAA you're not compliant either way.

Under HHS guidance, a cloud service provider that creates, receives, maintains, or transmits electronic PHI on behalf of a covered entity **is** a business associate and requires a BAA. A website host storing appointment-request submissions containing patient names, phone numbers, and reasons for visit falls squarely inside that.

So the correct conclusion isn't "pick the HIPAA-compliant platform." Neither is. It's: **don't collect PHI through your website form.** Keep the form to name, email, phone, and best time to call. Route anything clinical to your practice management system's patient portal or a dedicated HIPAA form vendor that will sign a BAA. That's true on Webflow, on WordPress, and on the hand-built sites I make.

Worth knowing: about 36% of dentist WordPress sites run Contact Form 7, which stores submissions unencrypted and sends plaintext notification emails. That's roughly 18,000 dental sites collecting patient contact details through a plugin with neither protection.

One nuance in the other direction, because the vendors selling "HIPAA-compliant marketing" tend to blur it: in June 2024 a federal court vacated the portion of OCR's tracking-technology guidance that treated an IP address plus a visit to a condition-specific page as PHI, and HHS withdrew its appeal that August. Running analytics on your public homepage is not, by itself, a HIPAA violation. Submitted form data is an entirely different matter. Talk to your compliance officer rather than to me.

## What happens if you leave

**WordPress** is genuinely portable, and this is its strongest argument. Tools → Export produces a WXR file with your posts, pages, comments, and taxonomies, and you separately own the database and the entire uploads directory through your host. GPL software, your server, your files. Nobody can raise your rent or change your terms.

The caveat: WXR doesn't export theme design, plugin configuration, or page-builder layouts in portable form. If your site is built in Elementor or Divi, the content moves and the _site_ doesn't — the layout is stored as builder-specific shortcodes that render as garbage elsewhere. "You own your WordPress site" is truer of the content than the design.

**Webflow's** code export gives you a ZIP of static HTML, CSS, and JS, and requires a paid Workspace plan ($19/mo yearly) on top of your site plan. It's widely documented to exclude CMS content and CMS-generated template pages, native form handling and submissions, site search, password protection, and ecommerce. CMS content can be exported separately as CSV.

For a small dental site that's mostly static pages plus one contact form, that export is reasonably usable — you'd have to rewire the form. If you're using the CMS for a blog or team pages, you get empty shells.

<!-- PLACEHOLDER: screenshot of the Webflow AUP section 8 PHI prohibition and the WP Engine AUP equivalent, side by side -->

## Who each actually suits

**Choose WordPress if** you value outright ownership above everything, need a specific integration with your practice management software, have someone who will genuinely patch it monthly, or want the largest possible pool of people who can pick up the work if your developer disappears.

**Choose Webflow if** you have no in-house technical help, want zero maintenance burden, value predictable pricing, and want a front-desk manager to be able to update hours without breaking anything. Just keep patient data off it.

**Consider a hand-built static site if** what you want is the smallest possible attack surface — no database, no PHP, no admin login, no plugin layer, so the entire 91%-of-vulnerabilities category structurally doesn't apply. That's what I build, and the honest framing is "there's nothing there to patch," not "it can't be hacked." And per that Next.js number: hand-built earns you speed, it doesn't inherit it.

Whichever you pick, the things that actually get you patients are the same, and they're covered in [how dental practices get found online](https://root.site/writing/how-dental-practices-get-found-online). The platform is a smaller decision than it feels like while you're making it.

If you want an outside opinion on what you're currently running, [get in touch](https://root.site/#contact). No pressure either way.

## Sources

- [State of WordPress Security in 2026 — Patchstack](https://patchstack.com/whitepaper/state-of-wordpress-security-in-2026/)
- [2024 Annual WordPress Security Report — Wordfence](https://www.wordfence.com/blog/2025/04/2024-annual-wordpress-security-report-by-wordfence/)
- [2023 Hacked Website & Malware Threat Report — Sucuri](https://sucuri.net/reports/2023-hacked-website-report/)
- [Core Web Vitals Technology Report — HTTP Archive](https://httparchive.org/reports/cwv-tech)
- [Usage Statistics and Market Share of Content Management Systems — W3Techs](https://w3techs.com/technologies/overview/content_management)
- [Plans & pricing — Webflow](https://webflow.com/pricing)
- [Acceptable Use Policy — Webflow](https://webflow.com/legal/aup)
- [Acceptable Use Policy — WP Engine](https://wpengine.com/legal/aup/)
- [Business Associates — HHS.gov](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html)
- [Use of Online Tracking Technologies by HIPAA Covered Entities — HHS.gov](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html)
- [Tools Export screen — WordPress.org Documentation](https://wordpress.org/documentation/article/tools-export-screen/)
- [Most Popular WordPress Plugins for Dentists — ILOVEWP](https://www.ilovewp.com/resources/medical/wordpress-for-dentists/most-popular-wordpress-plugins-for-dentists/)
