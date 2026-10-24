import type { RequestHandler } from '@sveltejs/kit';
import { LINKS } from '$lib/config/links';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const pages = ['/vpetlings', '/vpetlings/about-us'];

	const now = new Date().toISOString();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:xhtml="http://www.w3.org/1999/xhtml"
xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
${pages
	.map(
		(path) => `
	<url>
		<loc>${LINKS.base}${path}</loc>
		<lastmod>${now}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>${path === '/vpetlings' ? '1.0' : '0.7'}</priority>
	</url>`
	)
	.join('')}
</urlset>`;

	return new Response(body.trim(), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
