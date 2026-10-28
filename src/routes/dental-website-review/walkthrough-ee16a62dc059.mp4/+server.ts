import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /dental-website-review/walkthrough-ee16a62dc059.mp4
 *
 * The walkthrough video linked from the plugin submission
 * (review.demo_recording_url). The URL can't change, so it stays here.
 *
 * Workers static assets ignore Range headers and always answer 200 with
 * the whole file, and Safari won't play an MP4 without 206 Partial Content.
 * The file lives at /media/… as a plain asset; this route reads it through
 * the assets binding and serves the requested byte range itself.
 */
export const prerender = false;

const ASSET_PATH = '/media/walkthrough-ee16a62dc059.mp4';

export const GET: RequestHandler = async ({ request, platform, url }) => {
	const assets = (platform?.env as { ASSETS?: Fetcher } | undefined)?.ASSETS;
	const response = assets
		? await assets.fetch(new URL(ASSET_PATH, url))
		: await fetch(new URL(ASSET_PATH, url));
	if (!response.ok) error(404, 'Not found');
	const body = new Uint8Array(await response.arrayBuffer());
	const size = body.byteLength;
	const headers = {
		'Content-Type': 'video/mp4',
		'Accept-Ranges': 'bytes',
		'Cache-Control': 'public, max-age=3600'
	};

	const range = request.headers.get('range');
	if (!range)
		return new Response(body, { headers: { ...headers, 'Content-Length': String(size) } });

	// One range only: "bytes=start-end", "bytes=start-" or "bytes=-suffix".
	const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
	let start = match?.[1] ? Number(match[1]) : NaN;
	let end = match?.[2] ? Number(match[2]) : size - 1;
	if (match && !match[1] && match[2]) {
		start = Math.max(0, size - Number(match[2]));
		end = size - 1;
	}
	end = Math.min(end, size - 1);
	if (!match || Number.isNaN(start) || start > end) {
		return new Response(null, {
			status: 416,
			headers: { ...headers, 'Content-Range': `bytes */${size}` }
		});
	}

	return new Response(body.subarray(start, end + 1), {
		status: 206,
		headers: {
			...headers,
			'Content-Range': `bytes ${start}-${end}/${size}`,
			'Content-Length': String(end - start + 1)
		}
	});
};
