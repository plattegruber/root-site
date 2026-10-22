import { el, safeLink } from './report.js';

// Assessment strings are written by the model from untrusted page content. Build DOM with
// textContent only, never HTML.
const priorities = { fix_first: 'Fix first', next: 'Next', polish: 'Polish' };
const verdicts = {
	works: 'Works',
	friction: 'Friction',
	blocked: 'Blocked',
	not_applicable: 'Not applicable'
};
const profileStatus = {
	assessed: 'Assessed',
	partial: 'Partly assessed',
	not_found: 'Listing not found',
	not_checked: 'Not checked'
};

function tag(label, kind) {
	return el('span', label, `tag ${kind}`);
}

function line(label, text) {
	const p = el('p', undefined, 'line');
	p.append(el('strong', label), document.createTextNode(` ${text}`));
	return p;
}

function finding(f) {
	const card = el('article', undefined, 'finding');
	const head = el('header');
	head.append(el('h4', f.title));
	const tags = el('div', undefined, 'tags');
	tags.append(
		tag(priorities[f.priority] ?? f.priority, `priority ${f.priority}`),
		tag(f.basis === 'observed' ? 'Observed' : 'Judgement', f.basis)
	);
	head.append(tags);
	card.append(
		head,
		el('p', f.observation, 'observation'),
		line('For the practice:', f.forPractice),
		line('For the developer:', f.forDeveloper)
	);
	if (f.evidence?.length) {
		const d = el('details');
		d.append(el('summary', `Evidence (${f.evidence.length})`));
		const list = el('ul');
		for (const e of f.evidence) {
			const li = el('li');
			li.append(safeLink(e.url), document.createTextNode(` — ${e.detail}`));
			list.append(li);
		}
		d.append(list);
		card.append(d);
	}
	return card;
}

function section(title, className, ...children) {
	const s = el('section', undefined, className);
	s.append(el('h2', title), ...children);
	return s;
}

function list(items, ordered = false) {
	const l = el(ordered ? 'ol' : 'ul');
	for (const item of items) l.append(el('li', item));
	return l;
}

function journey(j, index) {
	const s = el('section', undefined, `journey ${j.verdict}`);
	const head = el('header');
	head.append(
		el('h3', `${index + 1}. ${j.name}`),
		tag(verdicts[j.verdict] ?? j.verdict, `verdict ${j.verdict}`)
	);
	s.append(head, el('p', j.walkthrough, 'walkthrough'), ...j.findings.map(finding));
	return s;
}

export function renderAssessment(a, target) {
	const root = el('div', undefined, 'assessment');
	const top = el('header', undefined, 'top');
	top.append(el('p', 'Dental Website Doctor · root.site', 'eyebrow'), el('h1', a.practiceName));
	if (a.fixture) top.append(el('p', 'Fictional example practice', 'fixture'));
	top.append(safeLink(a.websiteUrl), el('p', a.verdict, 'headline'));
	root.append(top);
	if (a.doFirst?.length) root.append(section('Do these first', 'do-first', list(a.doFirst, true)));
	if (a.journeys?.length)
		root.append(section('Patient journeys', 'journeys', ...a.journeys.map(journey)));
	if (a.technical?.length)
		root.append(section('Technical improvements', 'technical', ...a.technical.map(finding)));
	if (a.googleProfile) {
		const g = a.googleProfile;
		const status = el('p');
		status.append(tag(profileStatus[g.status] ?? g.status, `verdict ${g.status}`));
		if (g.source) status.append(document.createTextNode(' '), safeLink(g.source, 'Listing'));
		root.append(
			section(
				'Google Business Profile',
				'google',
				status,
				el('p', g.summary, 'walkthrough'),
				...g.findings.map(finding)
			)
		);
	}
	if (a.strengths?.length) root.append(section('Already working', 'strengths', list(a.strengths)));
	if (a.bottomLine) root.append(section('Where I’d start', 'bottom-line', el('p', a.bottomLine)));
	if (a.notChecked?.length) root.append(section('Not checked', 'not-checked', list(a.notChecked)));
	root.append(
		el(
			'p',
			'Written by ChatGPT from evidence collected by Dental Website Doctor and judged against root.site’s rubric. “Observed” means seen on the public site or listing; “Judgement” is an opinion. Compliance notes are not legal advice.',
			'footnote'
		)
	);
	target.replaceChildren(root);
}
