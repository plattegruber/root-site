import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import type { SafeFetcher, FetchResult } from '../src/security/fetch.js';
import type { Place, PlacesProvider } from '../src/providers/google.js';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const fixture = (name: string) =>
	readFileSync(resolve(root, 'tests/fixtures', name), 'utf8');
export function response(
	url: string,
	body: string,
	status = 200,
	headers: Record<string, string> = { 'content-type': 'text/html' }
): FetchResult {
	return {
		url,
		status,
		headers,
		body: Buffer.from(body),
		fetchedAt: '2026-10-01T12:00:00.000Z',
		redirects: []
	};
}
export function fixtureFetcher(override?: SafeFetcher): SafeFetcher {
	return async (url, options) => {
		if (override) {
			const result = await override(url, options);
			if (result) return result;
		}
		const u = new URL(url);
		if (u.hostname === 'www.googleapis.com') {
			const payload = JSON.parse(fixture('psi.json'));
			if (u.searchParams.get('strategy') === 'desktop') {
				payload.lighthouseResult.configSettings.formFactor = 'desktop';
				payload.lighthouseResult.audits['largest-contentful-paint'].numericValue = 2200;
			}
			return response(url, JSON.stringify(payload), 200, { 'content-type': 'application/json' });
		}
		if (u.pathname === '/robots.txt')
			return response(
				url,
				'User-agent: *\nAllow: /\nSitemap: https://maple-grove.example/sitemap.xml',
				200,
				{ 'content-type': 'text/plain' }
			);
		if (u.pathname === '/sitemap.xml')
			return response(
				url,
				'<urlset><url><loc>https://maple-grove.example/</loc></url><url><loc>https://maple-grove.example/contact</loc></url></urlset>',
				200,
				{ 'content-type': 'application/xml' }
			);
		if (u.hostname === 'booking.maple-grove.example')
			return response(
				url,
				'<html><head><title>Booking unavailable</title></head><body><h1>Not found</h1></body></html>',
				404
			);
		if (u.hostname === 'www.google.com')
			return response(
				url,
				'<html><title>Fictional Maps response</title><body>Simulated public Maps shell; no listing fields exposed.</body></html>'
			);
		const mapping: Record<string, string> = {
			'/': 'home.html',
			'/team': 'team.html',
			'/contact': 'contact.html',
			'/services/crowns': 'crowns.html'
		};
		if (mapping[u.pathname]) return response(url, fixture(mapping[u.pathname]!));
		if (u.pathname === '/office.svg')
			return response(
				url,
				'<svg xmlns="http://www.w3.org/2000/svg" width="350" height="130"><rect width="350" height="130" fill="#d9e4d5"/></svg>',
				200,
				{ 'content-type': 'image/svg+xml' }
			);
		return response(
			url,
			'<!doctype html><html lang="en"><title>Not found</title><h1>Not found</h1></html>',
			404
		);
	};
}
export const fixturePlaces: PlacesProvider = {
	async search() {
		return [JSON.parse(fixture('google.json')) as Place];
	}
};

/**
 * Fetcher for a multi-page fixture site. `brightsmiles` is a template-heavy practice built
 * from static HTML files; `riverbend` is a well-run practice assembled from a shared shell
 * plus per-page content in pages.json. Both are fictional.
 */
export function siteFetcher(site: 'brightsmiles' | 'riverbend'): SafeFetcher {
	const host = `${site}.example`;
	const robots = `User-agent: *\nAllow: /\nSitemap: https://${host}/sitemap.xml`;
	const brightPages: Record<string, string> = {
		'/': 'home.html',
		'/about': 'about.html',
		'/services': 'services.html',
		'/contact': 'contact.html',
		'/blog': 'blog.html'
	};
	const riverbend = JSON.parse(fixture('riverbend/pages.json')) as Record<
		string,
		{ title: string; description: string; main: string }
	>;
	const shell = fixture('riverbend/_shell.html');
	const paths = site === 'brightsmiles' ? Object.keys(brightPages) : Object.keys(riverbend);
	return async (url) => {
		const u = new URL(url);
		if (u.hostname === 'www.googleapis.com')
			return response(url, fixture('psi.json'), 200, { 'content-type': 'application/json' });
		if (u.pathname === '/robots.txt')
			return response(url, robots, 200, { 'content-type': 'text/plain' });
		if (u.pathname === '/sitemap.xml')
			return response(
				url,
				`<urlset>${paths.map((p) => `<url><loc>https://${host}${p}</loc></url>`).join('')}</urlset>`,
				200,
				{ 'content-type': 'application/xml' }
			);
		if (u.hostname !== host)
			return response(url, '<html><title>External</title><body>ok</body></html>');
		if (site === 'brightsmiles') {
			const file = brightPages[u.pathname];
			if (file) return response(url, fixture(`brightsmiles/${file}`));
			if (u.pathname.endsWith('.pdf'))
				return response(url, '%PDF-1.4', 200, { 'content-type': 'application/pdf' });
		} else {
			const page = riverbend[u.pathname];
			if (page)
				return response(
					url,
					shell
						.replace('{{TITLE}}', page.title)
						.replace('{{DESCRIPTION}}', page.description)
						.replace('{{PATH}}', u.pathname === '/' ? '/' : u.pathname)
						.replace('{{MAIN}}', page.main)
				);
		}
		return response(
			url,
			'<!doctype html><html lang="en"><title>Not found</title><h1>Not found</h1></html>',
			404
		);
	};
}
