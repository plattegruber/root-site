// Report strings are untrusted. Construct DOM nodes with textContent, never HTML.
export function el(tag, text, className) {
	const node = document.createElement(tag);
	if (text !== undefined) node.textContent = text;
	if (className) node.className = className;
	return node;
}
export function safeLink(url, label = url) {
	const a = el('a', label);
	try {
		const u = new URL(url);
		if (!['https:', 'http:'].includes(u.protocol) || u.username || u.password)
			return el('span', label);
		a.href = u.href;
		a.target = '_blank';
		a.rel = 'noopener noreferrer';
		a.referrerPolicy = 'no-referrer';
		return a;
	} catch {
		return el('span', label);
	}
}
function details(label, ...children) {
	const d = el('details');
	d.append(el('summary', label), ...children);
	return d;
}
function badge(label, status) {
	return el('span', label.replaceAll('_', ' '), `badge ${status ?? ''}`);
}
function paragraph(label, text) {
	const p = el('p');
	p.append(el('strong', `${label} `), document.createTextNode(text ?? ''));
	return p;
}
function table(headers, rows) {
	const wrap = el('div', undefined, 'table-wrap');
	const t = el('table');
	const head = el('thead');
	const tr = el('tr');
	headers.forEach((h) => {
		const th = el('th', h);
		th.scope = 'col';
		tr.append(th);
	});
	head.append(tr);
	t.append(head);
	const b = el('tbody');
	for (const row of rows) {
		const r = el('tr');
		row.forEach((value) => r.append(el('td', String(value ?? 'Not exposed'))));
		b.append(r);
	}
	t.append(b);
	wrap.append(t);
	return wrap;
}
function evidenceNodes(items) {
	return items.map((e) => {
		const block = el('div', undefined, 'evidence');
		block.append(
			safeLink(e.url),
			el('p', `${e.method} · ${e.observedAt}`, 'mono'),
			el('p', e.detail)
		);
		return block;
	});
}
function findingCard(f) {
	const card = el('article', undefined, 'finding-card');
	const badges = el('div', undefined, 'badges');
	badges.append(badge(f.status, f.status), badge(f.area), badge(`Severity: ${f.severity}`));
	if (f.basis)
		badges.append(
			badge(
				f.basis === 'objective' ? 'Measured' : `Opinion · ${f.confidence ?? 'medium'} confidence`,
				f.basis
			),
			badge(f.scope === 'dental' ? 'Dental-specific' : 'Any website', f.scope)
		);
	card.append(badges, el('h3', f.title));
	card.append(paragraph('For the practice:', f.impact));
	const fix = el('div', undefined, 'fix');
	fix.append(paragraph('For the developer:', f.fix), paragraph('Estimated effort:', f.effort));
	if (f.rationale) fix.append(paragraph('Why we think so:', f.rationale));
	card.append(fix, details('Page evidence & technical detail', ...evidenceNodes(f.evidence)));
	return card;
}
export function renderReport(report, target) {
	if (
		!report ||
		!['1.0', '1.1'].includes(report.schemaVersion) ||
		!Array.isArray(report.findings)
	) {
		target.replaceChildren(el('p', 'This report format could not be displayed.'));
		return;
	}
	const fragment = document.createDocumentFragment();
	const heading = el('section', undefined, 'report-heading');
	if (report.fixture)
		heading.append(
			el(
				'p',
				'FICTIONAL SAMPLE · Practice facts and provider responses are simulated. Any browser observations measure the fictional fixture, not a real practice.',
				'fixture-banner'
			)
		);
	heading.append(
		el('p', 'Dental Website Doctor / root.site', 'eyebrow'),
		el('h2', report.practice.name),
		el('p', report.summary),
		safeLink(report.practice.websiteUrl),
		el('p', `Measured ${report.startedAt} → ${report.completedAt}`, 'mono')
	);
	fragment.append(heading);
	const overview = el('div', undefined, 'overview');
	for (const [label, count] of [
		[
			'Urgent defects',
			report.findings.filter((f) => f.priority === 'urgent' && f.status === 'failed').length
		],
		['Observed failures', report.findings.filter((f) => f.status === 'failed').length],
		['Checks passed', report.findings.filter((f) => f.status === 'passed').length],
		['Not completed', report.findings.filter((f) => f.status === 'not_tested').length]
	]) {
		const box = el('div');
		box.append(el('strong', String(count)), el('span', label, 'help'));
		overview.append(box);
	}
	fragment.append(overview);
	if (Array.isArray(report.topFindings) && report.topFindings.length) {
		const start = el('section', undefined, 'report-section');
		start.append(
			el('h2', 'Start here'),
			el(
				'p',
				'Measured findings describe something the tool observed. Opinion findings are editorial judgements with their reasoning shown. Dental-specific findings would not appear in a generic website audit.',
				'help'
			)
		);
		const list = el('ol');
		for (const t of report.topFindings) {
			const li = el('li');
			li.append(
				el('strong', t.title + ' '),
				badge(t.basis === 'objective' ? 'Measured' : 'Opinion', t.basis),
				badge(t.scope === 'dental' ? 'Dental-specific' : 'Any website', t.scope),
				el('p', t.why)
			);
			list.append(li);
		}
		start.append(list);
		fragment.append(start);
	}
	const identity = el('section', undefined, 'report-section');
	identity.append(
		el('h2', 'Confirm the practice and office'),
		badge(report.practice.resolution),
		el('p', report.practice.explanation),
		details(
			'Observed practice facts',
			table(
				['Fact', 'Website observation', 'Verification'],
				report.practice.facts.map((f) => [f.key, f.value, f.verification])
			),
			...evidenceNodes(report.practice.facts.flatMap((f) => f.evidence))
		)
	);
	fragment.append(identity);
	for (const [priority, title, description] of [
		[
			'urgent',
			'Urgent: fix this week',
			'Broken patient routes and legal exposure (for example health details in a form next to an ad pixel).'
		],
		[
			'improvement',
			'Worth doing: the next month',
			'Missing or vague answers to the questions patients arrive with: cost, emergencies, the dentist, the first visit.'
		],
		['polish', 'Polish: when the above is done', 'Copy, photos and local-search refinements.']
	]) {
		const section = el('section', undefined, 'report-section');
		section.append(el('h2', title), el('p', description, 'help'));
		const items = report.findings.filter((f) => f.priority === priority && f.status !== 'passed');
		section.append(
			...(items.length
				? items.map(findingCard)
				: [el('p', 'No observed finding in this group.', 'empty')])
		);
		fragment.append(section);
	}
	const journeys = el('section', undefined, 'report-section');
	journeys.append(el('h2', 'Three patient journeys'));
	for (const j of report.journeys) {
		const block = el('div', undefined, 'journey');
		block.append(el('h3', j.name), badge(j.status));
		const list = el('ol');
		for (const step of j.steps) {
			const li = el('li');
			li.append(el('strong', step.label + ': '), document.createTextNode(step.observation));
			if (step.url) li.append(document.createTextNode(' '), safeLink(step.url, 'Source page'));
			list.append(li);
		}
		block.append(list);
		journeys.append(block);
	}
	fragment.append(journeys);
	const google = el('section', undefined, 'report-section');
	google.append(
		el('h2', 'Public Google presence'),
		badge(report.google.match),
		el('p', report.google.explanation),
		table(
			['Check', 'Availability', 'Public observation'],
			report.google.fields.map((f) => [f.name, f.availability.replaceAll('_', ' '), f.value])
		)
	);
	if (report.google.mapsUrl)
		google.append(safeLink(report.google.mapsUrl, 'Open the Maps destination'));
	for (const a of report.google.attributions)
		google.append(
			el('p', `Source attribution: ${a.name}`),
			...(a.url ? [safeLink(a.url, 'Google Maps source')] : [])
		);
	const path = el('ol');
	report.google.ownerAccessPath.forEach((s) => path.append(el('li', s)));
	google.append(details('Path to owner-authorized analysis', path));
	fragment.append(google);
	const perf = el('section', undefined, 'report-section');
	perf.append(el('h2', 'Performance: lab and real-user data'));
	for (const m of report.performance) {
		const card = el('article', undefined, 'finding-card');
		card.append(
			el('h3', `${m.device} · ${m.source.replaceAll('_', ' ')}`),
			badge(m.status),
			el('p', m.conditions, 'help'),
			el('p', `${m.measuredAt} · ${m.url}`, 'mono'),
			el('p', m.limitation)
		);
		if (m.lab)
			card.append(
				details(
					'Synthetic lab measurements',
					table(
						['Metric', 'Measured value'],
						Object.entries(m.lab.metrics).map(([k, v]) => [
							k,
							k === 'cumulative-layout-shift' ? String(v) : `${Math.round(v)} ms`
						])
					),
					el(
						'p',
						`Lighthouse version: ${m.lab.lighthouseVersion ?? 'Not a Lighthouse run'}`,
						'help'
					)
				)
			);
		if (m.field)
			card.append(
				details(
					`Real-user field data · ${m.field.scope}`,
					el('p', m.field.explanation),
					table(
						['Metric', '75th percentile', 'Category'],
						Object.entries(m.field.metrics).map(([k, v]) => [
							k,
							`${v.percentile} ${v.unit}`,
							v.category
						])
					)
				)
			);
		perf.append(card);
	}
	fragment.append(perf);
	const drafts = el('section', undefined, 'report-section');
	drafts.append(
		el('h2', 'Three high-impact content drafts'),
		el(
			'p',
			'Review these before use. Bracketed instructions are placeholders, not publishable practice claims.',
			'help'
		)
	);
	for (const r of report.rewrites) {
		const card = el('article', undefined, 'finding-card');
		card.append(el('h3', r.proposedHeading), el('p', r.reason), el('p', r.proposedCopy, 'draft'));
		const confirm = el('ul');
		r.confirmations.forEach((s) => confirm.append(el('li', s)));
		card.append(
			details(
				'Preserved facts, voice & required confirmation',
				paragraph(
					'Observed fact keys:',
					r.preservedFactKeys.join(', ') || 'No specific fact asserted'
				),
				el('p', r.voice),
				confirm,
				safeLink(r.sourceUrl, 'Source section'),
				paragraph('Source excerpt:', r.before)
			)
		);
		drafts.append(card);
	}
	fragment.append(drafts);
	const coverage = el('section', undefined, 'report-section');
	coverage.append(
		el('h2', 'Full check coverage'),
		details(
			'Passed, failed, uncompleted and confirmation checks',
			table(
				['Area', 'Check', 'Result', 'Evidence count'],
				report.findings.map((f) => [
					f.area,
					f.title,
					f.status.replaceAll('_', ' '),
					f.evidence.length
				])
			)
		),
		details(
			'Browser test conditions and limitations',
			el('p', report.browser.conditions),
			table(
				['Page', 'Viewport', 'Overflow', 'Axe findings', 'Keyboard elements'],
				report.browser.views.map((v) => [
					v.url,
					`${v.width}×${v.height}`,
					v.horizontalOverflow,
					v.axeViolations.length,
					v.keyboard.reached
				])
			),
			...report.browser.errors.map((s) => el('p', s))
		),
		details(
			'Sources, crawl limits & measurement times',
			...evidenceNodes(report.sources),
			...report.crawl.errors.map((s) => el('p', s))
		)
	);
	fragment.append(coverage);
	const limits = el('section', undefined, 'report-section');
	limits.append(el('h2', 'Conditions & limitations'));
	const list = el('ul');
	report.limits.forEach((s) => list.append(el('li', s)));
	limits.append(list);
	fragment.append(limits);
	target.replaceChildren(fragment);
}
