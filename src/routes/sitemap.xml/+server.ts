import { site } from '$lib/config/site';
import { posts } from '$lib/config/blog';

type SitemapEntry = { loc: string; lastmod?: string };

/**
 * sitemap.xml — prerendered at build time. Lists the site's
 * canonical, indexable URLs. We omit /thanks (transactional) and
 * /api/* (machine-only) so crawlers don't waste budget on them.
 */
export const prerender = true;

const STATIC = ['/', '/about', '/writing'] as const;

export const GET = async () => {
	const urls: SitemapEntry[] = [
		...STATIC.map((path) => ({ loc: `${site.url}${path}` })),
		...posts.map((p) => ({
			loc: `${site.url}/writing/${p.slug}`,
			lastmod: p.date
		}))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
