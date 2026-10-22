import ipaddr from 'ipaddr.js';
import { timingSafeEqual } from 'node:crypto';

/**
 * Public-mode access for /mcp. ChatGPT calls anonymously, so the gate is network origin:
 * only OpenAI's published ChatGPT connector ranges, refreshed periodically, plus a bearer
 * token for our own testing. Fails closed if the range list has never loaded.
 */
export const CHATGPT_RANGES_URL = 'https://openai.com/chatgpt-connectors.json';

type Range = [ipaddr.IPv4 | ipaddr.IPv6, number];
export type RangeSource = () => Promise<string[]>;

export const fetchChatgptRanges: RangeSource = async () => {
	const r = await fetch(CHATGPT_RANGES_URL, { signal: AbortSignal.timeout(10_000) });
	if (!r.ok) throw new Error(`ranges HTTP ${r.status}`);
	const body = (await r.json()) as { prefixes?: { ipv4Prefix?: string; ipv6Prefix?: string }[] };
	return (body.prefixes ?? []).flatMap(
		(p) => [p.ipv4Prefix, p.ipv6Prefix].filter(Boolean) as string[]
	);
};

export function equalSecret(a: string, b: string) {
	const aa = Buffer.from(a),
		bb = Buffer.from(b);
	return aa.length === bb.length && timingSafeEqual(aa, bb);
}

export class Allowlist {
	private ranges: Range[] = [];
	loadedAt?: Date;
	constructor(
		private source: RangeSource = fetchChatgptRanges,
		private refreshMs = 6 * 60 * 60 * 1000
	) {}
	async refresh() {
		try {
			const parsed = (await this.source()).flatMap((cidr) => {
				try {
					return [ipaddr.parseCIDR(cidr) as Range];
				} catch {
					return [];
				}
			});
			if (parsed.length) {
				this.ranges = parsed;
				this.loadedAt = new Date();
			}
		} catch (e) {
			// Keep the last good list; with none loaded, allows() stays false.
			console.error(JSON.stringify({ type: 'allowlist_refresh_failed', error: String(e) }));
		}
	}
	start() {
		void this.refresh();
		setInterval(() => void this.refresh(), this.refreshMs).unref();
		return this;
	}
	allows(ip: string): boolean {
		let address: ipaddr.IPv4 | ipaddr.IPv6;
		try {
			address = ipaddr.process(ip);
		} catch {
			return false;
		}
		return this.ranges.some(
			([net, bits]) => net.kind() === address.kind() && address.match([net, bits] as never)
		);
	}
	get size() {
		return this.ranges.length;
	}
}

/** Fixed-window counters: per caller and a global daily cap. In memory; one machine. */
export class RateLimiter {
	private windows = new Map<string, { start: number; count: number }>();
	private day = { start: 0, count: 0 };
	constructor(
		private perCaller: { limit: number; windowMs: number },
		private dailyLimit: number
	) {}
	take(key: string, now = Date.now()): 'ok' | 'caller' | 'daily' {
		if (now - this.day.start >= 86_400_000) this.day = { start: now, count: 0 };
		if (this.day.count >= this.dailyLimit) return 'daily';
		const w = this.windows.get(key);
		if (!w || now - w.start >= this.perCaller.windowMs)
			this.windows.set(key, { start: now, count: 1 });
		else if (w.count >= this.perCaller.limit) return 'caller';
		else w.count++;
		this.day.count++;
		if (this.windows.size > 10_000)
			for (const [k, v] of this.windows)
				if (now - v.start >= this.perCaller.windowMs) this.windows.delete(k);
		return 'ok';
	}
}
