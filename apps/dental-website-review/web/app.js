import { renderReport, el } from './report.js';
const form = document.querySelector('#audit-form'),
	target = document.querySelector('#report'),
	progress = document.querySelector('#progress'),
	error = document.querySelector('#error'),
	submit = document.querySelector('#submit'),
	sample = document.querySelector('#sample');
let current;
function busy(on) {
	submit.disabled = on;
	sample.disabled = on;
	form.setAttribute('aria-busy', String(on));
}
async function request(url, options) {
	const r = await fetch(url, options);
	const data = await r.json();
	if (!r.ok) throw new Error(data.error ?? `Request returned ${r.status}`);
	return data;
}
function show(report) {
	current = report;
	renderReport(report, target);
	const buttons = el('div', undefined, 'actions');
	for (const [label, filename, value, type] of [
		['Download report JSON', 'dental-report.json', report, 'application/json'],
		['Download redesign brief', 'redesign-brief.json', report.generationBrief, 'application/json']
	]) {
		const b = el('button', label, 'secondary');
		b.type = 'button';
		b.addEventListener('click', () => {
			const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type }));
			const a = el('a');
			a.href = url;
			a.download = filename;
			a.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		});
		buttons.append(b);
	}
	target.prepend(buttons);
	target.focus();
	target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
form.addEventListener('submit', async (event) => {
	event.preventDefault();
	error.textContent = '';
	busy(true);
	try {
		const data = new FormData(form);
		const input = { websiteUrl: String(data.get('websiteUrl')).trim() };
		const maps = String(data.get('googleMapsUrl') ?? '').trim();
		if (maps) input.googleMapsUrl = maps;
		progress.textContent = 'Starting a bounded public assessment…';
		const started = await request('/api/audits', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(input)
		});
		let done = false;
		while (!done) {
			await new Promise((r) => setTimeout(r, 1200));
			const next = await request(`/api/audits/${started.id}`);
			progress.textContent = next.stage;
			if (next.status === 'failed') throw new Error(next.error);
			if (next.status === 'completed') {
				show(next.report);
				done = true;
			}
		}
		progress.textContent =
			'Assessment complete. Expand each finding to see its evidence and technical detail.';
	} catch (e) {
		error.textContent = e.message;
		progress.textContent = '';
	} finally {
		busy(false);
	}
});
sample.addEventListener('click', async () => {
	error.textContent = '';
	busy(true);
	try {
		show(await request('/api/sample'));
		progress.textContent = 'Fictional sample loaded. No live practice was audited.';
	} catch (e) {
		error.textContent = e.message;
	} finally {
		busy(false);
	}
});
void current;
