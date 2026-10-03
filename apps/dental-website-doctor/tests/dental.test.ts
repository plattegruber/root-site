import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditWebsite, reportMarkdown } from '../src/audit/engine.js';
import { parsePage } from '../src/audit/pages.js';
import { visibleDays } from '../src/audit/dental.js';
import { readingGrade } from '../src/audit/signals.js';
import { bookingVendor } from '../src/audit/pages.js';
import { response, siteFetcher } from './helpers.js';
import type { Report } from '../src/model.js';

const byId = (report: Report, id: string) => report.findings.find((f) => f.id === id);
const options = { fixture: true, browserEnabled: false, pagespeedEnabled: false };

test('a template-heavy practice site triggers the dental-specific objective checks with evidence', async () => {
	const report = await auditWebsite(
		{ websiteUrl: 'https://brightsmiles.example/' },
		{ ...options, fetcher: siteFetcher('brightsmiles') }
	);
	const expectFailed = [
		'experience-contact', // phone is plain text, no tel: link
		'experience-booking', // no booking route at all
		'experience-new-patient', // no new-patient page
		'experience-insurance', // only "we accept all insurance"
		'experience-emergency', // nothing about emergencies
		'experience-services', // one lump services page
		'compliance-form-phi', // DOB/insurance/reason fields + Meta pixel
		'compliance-form-transport', // mailto: form
		'compliance-privacy-policy', // no privacy/HIPAA link
		'compliance-advertising-claims', // painless, guarantee, best, #1
		'compliance-specialty-claims', // cosmetic dentistry specialist
		'compliance-schema-reviews', // aggregateRating on LocalBusiness
		'tech-copyright', // © 2021
		'content-stale-dates', // blog from 2022
		'content-template-filler', // state-of-the-art etc.
		'content-stock-photos', // shutterstock_/istock-/AdobeStock_
		'content-headline' // "Welcome to Our Practice"
	];
	for (const id of expectFailed) {
		const f = byId(report, id);
		assert.ok(f, `${id} missing`);
		assert.equal(
			f.status,
			'failed',
			`${id} should fail: ${f.evidence.map((e) => e.detail).join(' | ')}`
		);
		assert.ok(f.evidence.length, `${id} needs evidence`);
		assert.ok(f.impact && f.fix, `${id} needs impact and fix text`);
	}
	// Severity and basis labelling.
	assert.equal(byId(report, 'compliance-form-phi')?.priority, 'urgent');
	assert.equal(byId(report, 'compliance-form-phi')?.basis, 'objective');
	assert.equal(byId(report, 'compliance-form-phi')?.scope, 'dental');
	assert.ok(
		byId(report, 'compliance-form-phi')?.evidence[0]?.detail.includes('connect.facebook.net')
	);
	assert.equal(byId(report, 'content-template-filler')?.basis, 'subjective');
	assert.ok(byId(report, 'content-template-filler')?.rationale);
	assert.ok(
		byId(report, 'content-template-filler')?.evidence[0]?.detail.includes('state-of-the-art')
	);
	assert.equal(byId(report, 'compliance-advertising-claims')?.confidence, 'medium');
	// Every subjective finding explains itself.
	for (const f of report.findings.filter((f) => f.basis === 'subjective'))
		assert.ok(f.rationale, `${f.id} is an opinion without a rationale`);
	// The report leads with the right things.
	assert.ok(report.topFindings.length >= 3);
	assert.ok(report.topFindings.slice(0, 3).some((t) => t.id === 'compliance-form-phi'));
	assert.ok(report.summary.includes('specific to dental practices'));
	const md = reportMarkdown(report);
	assert.ok(md.includes('## Start here'));
	assert.ok(md.includes('**For the practice:**') && md.includes('**For the developer:**'));
	assert.ok(md.includes('Opinion · Dental-specific'));
	// Review widget counts as verifiable reviews; patient media gets an authorization flag.
	assert.equal(byId(report, 'experience-reviews')?.status, 'passed');
	assert.ok(
		['failed', 'needs_confirmation'].includes(byId(report, 'compliance-patient-media')!.status)
	);
	// Hours exist only on the contact page.
	assert.equal(byId(report, 'experience-hours')?.status, 'needs_confirmation');
	// PDF-only forms produce the subjective note.
	assert.equal(byId(report, 'experience-forms-pdf')?.status, 'failed');
});

test('a well-run practice site passes the dental checks without false positives', async () => {
	const report = await auditWebsite(
		{ websiteUrl: 'https://riverbend.example/' },
		{ ...options, fetcher: siteFetcher('riverbend') }
	);
	const expectPassed = [
		'experience-contact',
		'experience-booking',
		'experience-new-patient',
		'experience-insurance',
		'experience-emergency',
		'experience-dentist',
		'experience-services',
		'experience-hours',
		'experience-directions',
		'experience-reviews',
		'experience-languages',
		'compliance-form-phi',
		'compliance-privacy-policy',
		'compliance-schema-practice',
		'compliance-hours-consistency',
		'tech-copyright',
		'tech-title-city',
		'tech-viewport',
		'tech-lang',
		'content-template-filler',
		'content-headline',
		'content-patient-focus',
		'content-cta-clarity'
	];
	for (const id of expectPassed) {
		const f = byId(report, id);
		assert.ok(f, `${id} missing`);
		assert.equal(
			f.status,
			'passed',
			`${id}: ${f.status} — ${f.evidence.map((e) => e.detail).join(' | ')}`
		);
	}
	for (const id of [
		'compliance-form-transport',
		'compliance-advertising-claims',
		'compliance-specialty-claims',
		'compliance-schema-reviews',
		'content-stock-photos',
		'content-stale-dates',
		'content-jargon',
		'experience-forms-pdf',
		'experience-uninsured-path',
		'experience-phone-consistency'
	])
		assert.equal(byId(report, id), undefined, `${id} should not fire on a clean site`);
	assert.equal(
		report.findings.filter((f) => f.status === 'failed' && f.scope === 'dental').length,
		0
	);
	assert.ok(byId(report, 'experience-booking')?.evidence[0]?.detail.includes('NexHealth'));
	assert.ok(byId(report, 'experience-insurance')?.evidence[0]?.detail.includes('Delta Dental'));
	assert.ok(byId(report, 'experience-emergency')?.evidence[0]?.detail.includes('After-hours'));
	assert.ok(byId(report, 'experience-dentist')?.evidence[0]?.detail.includes('education'));
	const grade = byId(report, 'content-readability');
	assert.equal(grade?.status, 'passed', grade?.evidence.map((e) => e.detail).join(' | '));
	assert.ok(report.crawl.pagesFetched >= 9, 'sitemap seeding should reach the key pages');
});

test('referring a patient to a specialist is not a specialty claim', async () => {
	const page = parsePage(
		response(
			'https://practice.example/',
			'<!doctype html><html lang="en"><title>Practice</title><body><main><h1>Practice</h1><p>We refer complex cases to an oral surgeon or periodontal specialist. Our office focuses on general and family dentistry.</p></main></body></html>'
		)
	);
	const fetcher = async (url: string) =>
		url.endsWith('/robots.txt')
			? response(url, 'User-agent: *\nAllow: /', 200, { 'content-type': 'text/plain' })
			: url === 'https://practice.example/'
				? response(url, page.html)
				: response(url, '<html><title>404</title></html>', 404);
	const report = await auditWebsite(
		{ websiteUrl: 'https://practice.example/' },
		{ ...options, fetcher }
	);
	assert.equal(byId(report, 'compliance-specialty-claims'), undefined);
});

test('helpers: day ranges expand, readability is sane, booking vendors are recognised', () => {
	assert.deepEqual([...visibleDays('Open Monday–Thursday 8–5, Fri 8–1')].sort(), [
		'fri',
		'mon',
		'thu',
		'tue',
		'wed'
	]);
	assert.deepEqual([...visibleDays('Mon to Fri')].sort(), ['fri', 'mon', 'thu', 'tue', 'wed']);
	const simple =
		'We clean your teeth. It takes an hour. You can book online. We are open early. Bring your card. We will help you. '.repeat(
			20
		);
	const dense =
		'Comprehensive periodontal rehabilitation necessitates interdisciplinary coordination between restorative, prosthodontic and surgical disciplines, incorporating evidence-based protocols. '.repeat(
			12
		);
	assert.ok(readingGrade(simple)! < 6, String(readingGrade(simple)));
	assert.ok(readingGrade(dense)! > 14, String(readingGrade(dense)));
	assert.equal(bookingVendor('app.nexhealth.com'), 'NexHealth');
	assert.equal(bookingVendor('www.example.com'), undefined);
});

test('a form with health fields but no trackers passes, and GET transport is flagged', async () => {
	const html = (form: string) =>
		`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width"><title>Practice</title></head><body><main><h1>Contact</h1>${form}</main></body></html>`;
	const run = async (form: string) => {
		const fetcher = async (url: string) =>
			url.endsWith('/robots.txt')
				? response(url, 'User-agent: *\nAllow: /', 200, { 'content-type': 'text/plain' })
				: url === 'https://practice.example/'
					? response(url, html(form))
					: response(url, '<html><title>404</title></html>', 404);
		return auditWebsite({ websiteUrl: 'https://practice.example/' }, { ...options, fetcher });
	};
	const clean = await run(
		'<form method="post" action="/send"><label for="r">Reason for visit</label><textarea id="r" name="reason"></textarea></form>'
	);
	assert.equal(byId(clean, 'compliance-form-phi')?.status, 'passed');
	assert.equal(byId(clean, 'compliance-form-transport'), undefined);
	const leaky = await run(
		'<form method="get" action="/send"><label for="r">Reason for visit</label><textarea id="r" name="reason"></textarea></form>'
	);
	assert.equal(byId(leaky, 'compliance-form-transport')?.status, 'failed');
	assert.ok(byId(leaky, 'compliance-form-transport')?.evidence[0]?.detail.includes('GET'));
});

const singlePage = (body: string, head = '') => {
	const html = `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width"><title>Practice</title>${head}</head><body>${body}</body></html>`;
	return async (url: string) =>
		url.endsWith('/robots.txt')
			? response(url, 'User-agent: *\nAllow: /', 200, { 'content-type': 'text/plain' })
			: url === 'https://practice.example/'
				? response(url, html)
				: response(url, '<html><title>404</title></html>', 404);
};
const contactForm =
	'<form method="post" action="/send"><label for="n">Name</label><input id="n" name="name"><label for="m">Message</label><textarea id="m" name="message"></textarea></form>';
const strongForm =
	'<form method="post" action="/send"><label for="d">Date of birth</label><input id="d" name="dob"><label for="i">Insurance provider</label><input id="i" name="insurance"></form>';
const ga = '<script async src="https://www.googletagmanager.com/gtag/js?id=G-FAKE"></script>';
const meta = '<script src="https://connect.facebook.net/en_US/fbevents.js"></script>';
const hotjar = '<script src="https://static.hotjar.com/c/hotjar-1.js"></script>';

test('form/tracker tiers: an ordinary contact form next to analytics is not urgent', async () => {
	const run = async (body: string, head: string) =>
		byId(
			await auditWebsite(
				{ websiteUrl: 'https://practice.example/' },
				{ ...options, fetcher: singlePage(`<main><h1>Contact</h1>${body}</main>`, head) }
			),
			'compliance-form-phi'
		)!;
	const plain = await run(contactForm, ga);
	assert.equal(plain.status, 'passed', plain.evidence[0]?.detail);
	const strongGa = await run(strongForm, ga);
	assert.equal(strongGa.status, 'needs_confirmation');
	assert.equal(strongGa.severity, 'low');
	const recorder = await run(contactForm, hotjar);
	assert.equal(recorder.status, 'failed');
	assert.equal(recorder.severity, 'moderate');
	const adFree = await run(contactForm, meta);
	assert.equal(adFree.status, 'failed');
	assert.equal(adFree.priority, 'improvement');
	const adStrong = await run(strongForm, meta);
	assert.equal(adStrong.status, 'failed');
	assert.equal(adStrong.priority, 'urgent');
	const disclaimed = await run(
		'<form method="post" action="/send"><label for="q">Question (please do not include health details)</label><textarea id="q" name="question"></textarea></form>',
		meta
	);
	assert.equal(
		disclaimed.priority,
		'improvement',
		'a disclaimer downgrades the field to free text'
	);
});

test('a phone number in a theme top-bar div counts as being in the header', async () => {
	const report = await auditWebsite(
		{ websiteUrl: 'https://practice.example/' },
		{
			...options,
			fetcher: singlePage(
				'<div class="et_top-bar"><a href="tel:+15550001111">Call (555) 000-1111</a></div><main><h1>Practice</h1></main><footer><a href="tel:+15550001111">(555) 000-1111</a></footer>'
			)
		}
	);
	const contact = byId(report, 'experience-contact')!;
	assert.equal(contact.status, 'passed', contact.evidence[0]?.detail);
	const footerOnly = await auditWebsite(
		{ websiteUrl: 'https://practice.example/' },
		{
			...options,
			fetcher: singlePage(
				'<main><h1>Practice</h1></main><footer class="site-footer"><div class="footer-header"><a href="tel:+15550001111">(555) 000-1111</a></div></footer>'
			)
		}
	);
	assert.equal(byId(footerOnly, 'experience-contact')?.status, 'failed');
});

test('overlapping stock phrases are counted once', async () => {
	const report = await auditWebsite(
		{ websiteUrl: 'https://practice.example/' },
		{
			...options,
			fetcher: singlePage(
				'<main><h1>Dentist in Town</h1><p>We meet all of your dental needs with a healthy, beautiful smile.</p></main>'
			)
		}
	);
	const detail = byId(report, 'content-template-filler')!.evidence[0]!.detail;
	assert.ok(detail.includes('all of your dental needs'));
	assert.ok(!detail.includes('“dental needs”'), detail);
	assert.ok(!detail.includes('“beautiful smile”'), detail);
});
