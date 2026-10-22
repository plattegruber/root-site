import { App } from '@modelcontextprotocol/ext-apps';
import { el } from './report.js';
import { renderAssessment } from './assessment.js';
const app = new App({ name: 'Dental Website Review', version: '0.2.0' }, {}, { autoResize: true });
const target = document.querySelector('#report');
// Follow the host's theme; without one, the stylesheet falls back to prefers-color-scheme.
const applyTheme = (context) => {
	if (context?.theme === 'dark' || context?.theme === 'light')
		document.documentElement.dataset.theme = context.theme;
};
app.ontoolresult = (result) => {
	const assessment = result.structuredContent?.assessment;
	if (assessment) renderAssessment(assessment, target);
	else
		target.replaceChildren(
			el('p', 'The assessment is unavailable. Ask ChatGPT to show it as text.')
		);
};
app.onhostcontextchanged = applyTheme;
app
	.connect()
	.then(() => applyTheme(app.getHostContext()))
	.catch(() =>
		target.replaceChildren(
			el(
				'p',
				'The assessment view could not connect. The assessment remains available in the conversation.'
			)
		)
	);
