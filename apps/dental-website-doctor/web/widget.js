import { App } from '@modelcontextprotocol/ext-apps';
import { renderReport, el } from './report.js';
const app = new App({ name: 'Dental Website Doctor', version: '0.1.0' }, {}, { autoResize: true });
const target = document.querySelector('#report');
app.ontoolresult = (result) => {
	const report = result.structuredContent?.report;
	if (report) renderReport(report, target);
	else
		target.replaceChildren(
			el('p', 'The assessment result is unavailable. Ask ChatGPT to show the report as text.')
		);
};
app.onhostcontextchanged = (context) => {
	document.documentElement.style.colorScheme = context.theme ?? 'light';
};
app
	.connect()
	.catch(() =>
		target.replaceChildren(
			el(
				'p',
				'The report component could not connect. The structured report remains available in the conversation.'
			)
		)
	);
