import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Keep campaign parameters on requests to the shortened URL.
export const prerender = false;

export const GET: RequestHandler = ({ url }) => redirect(308, `/free-resources${url.search}`);
