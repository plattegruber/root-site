import dns from 'node:dns/promises';
import ipaddr from 'ipaddr.js';

export class FetchError extends Error {
	constructor(
		public code: string,
		message: string
	) {
		super(message);
		this.name = 'FetchError';
	}
}
export type Lookup = (host: string) => Promise<{ address: string; family: number }[]>;
export const lookupAll: Lookup = (host) => dns.lookup(host, { all: true, verbatim: true });
export function publicAddress(address: string): boolean {
	try {
		const parsed = ipaddr.parse(address);
		// Exclude every special-use IPv4/IPv6 range, including mapped IPv4, NAT64,
		// transition tunnels, multicast, link-local, documentation, and reserved IPs.
		if (parsed.kind() === 'ipv6') {
			const v6 = parsed as ipaddr.IPv6;
			if (v6.isIPv4MappedAddress()) return publicAddress(v6.toIPv4Address().toString());
		}
		return parsed.range() === 'unicast';
	} catch {
		return false;
	}
}
export function normalizeUrl(raw: string): URL {
	let url: URL;
	try {
		url = new URL(raw.includes('://') ? raw : `https://${raw}`);
	} catch {
		throw new FetchError('invalid_url', 'Enter a valid public website URL.');
	}
	if (!['http:', 'https:'].includes(url.protocol))
		throw new FetchError('scheme', 'Only HTTP and HTTPS URLs are allowed.');
	if (url.username || url.password)
		throw new FetchError('credentials', 'URLs must not contain credentials.');
	if (url.port && url.port !== '80' && url.port !== '443')
		throw new FetchError('port', 'Only standard web ports are allowed.');
	const host = url.hostname
		.toLowerCase()
		.replace(/\.$/, '')
		.replace(/^\[|\]$/g, '');
	if (
		!host ||
		(!host.includes('.') && !host.includes(':')) ||
		/(^|\.)(localhost|local|internal|test|invalid|onion|home|lan)$/.test(host)
	)
		throw new FetchError('private_host', 'The website must be a public internet host.');
	if (ipaddr.isValid(host) && !publicAddress(host))
		throw new FetchError('private_ip', 'Private and special-use network addresses are blocked.');
	// An audit is never an input channel for patient records or tracking identifiers.
	url.hash = '';
	url.search = '';
	url.hostname = host;
	return url;
}
export async function resolvePublic(url: URL, lookup: Lookup = lookupAll) {
	const host = url.hostname.replace(/^\[|\]$/g, '');
	let addresses: { address: string; family: number }[];
	if (ipaddr.isValid(host))
		addresses = [{ address: host, family: ipaddr.parse(host).kind() === 'ipv6' ? 6 : 4 }];
	else {
		try {
			let timer: ReturnType<typeof setTimeout> | undefined;
			try {
				addresses = await Promise.race([
					lookup(host),
					new Promise<never>((_resolve, reject) => {
						timer = setTimeout(
							() => reject(new FetchError('dns_timeout', 'DNS resolution exceeded 4 seconds.')),
							4000
						);
						timer.unref();
					})
				]);
			} finally {
				if (timer) clearTimeout(timer);
			}
		} catch {
			throw new FetchError('dns', 'The public hostname could not be resolved.');
		}
	}
	if (!addresses.length || addresses.some((x) => !publicAddress(x.address)))
		throw new FetchError(
			'private_dns',
			'The hostname resolves to a private or special-use network address.'
		);
	return addresses[0]!;
}
export function mapsUrl(raw: string): URL {
	// Maps queries may carry place identifiers, but no other submitted URL queries survive.
	const url = new URL(raw);
	if (url.protocol !== 'https:' || url.username || url.password || url.port)
		throw new FetchError('maps_url', 'Use a public HTTPS Google Maps link.');
	const host = url.hostname.toLowerCase();
	if (
		!['www.google.com', 'google.com', 'maps.google.com', 'maps.app.goo.gl', 'goo.gl'].includes(
			host
		) ||
		(['www.google.com', 'google.com'].includes(host) && !url.pathname.startsWith('/maps')) ||
		(host === 'goo.gl' && !url.pathname.startsWith('/maps'))
	)
		throw new FetchError('maps_url', 'Use a Google Maps place or share link.');
	url.hash = '';
	return url;
}
