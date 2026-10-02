# Security and limitations

Input is schema-validated/bounded. URLs allow only HTTP/S and standard web ports;
credentials, internal names and special-use IPs are blocked, including numeric
IPv4 and mapped IPv6. Every DNS answer must be public; the chosen IP is pinned
into the socket/CONNECT target with original Host/SNI and certificate validation.
Every redirect is revalidated/resolved; credentialed provider redirects are
blocked. DNS, request, redirects, bytes, crawl and audit time are bounded.
Compressed encoding is rejected to avoid unbounded decompression. No website
cookies or Authorization headers are forwarded.

Inherited egress proxies are honored. Some enterprise proxies block IP CONNECT
or require domain routing; the pinned request fails safely. Do not disable
pinning/TLS. Use compatible SSRF-enforcing egress and verify the hosting network.
Unavailable network/DNS checks remain explicit.

Robots permissions are respected before analysis; unknown permissions stop the
crawl. Sitemap recursion and full site inventory are outside V0. Submitted website
query/fragment parameters are stripped to avoid carrying patient/tracking IDs.
Purpose-specific Maps identifiers/browser cache parameters are handled separately.
Do not audit patient portals or patient-specific paths.

Chromium runs a fresh context: service workers/downloads/WebSockets are disabled;
a dead proxy prevents unintended direct traffic. Normal requests are intercepted
and fulfilled by the safe fetcher. Only GET/HEAD are allowed, bounded by request
and byte budgets. No forms, booking submissions, calls or writes occur. Isolate
untrusted page scripts in an unprivileged browser worker. The Tab/focus sample is
limited and requires manual review of custom indicators/dialogs.

Fetched HTML/JSON-LD/Google data/excerpts are evidence, never instructions. Rules
are deterministic. The UI creates text DOM nodes, never injects fetched HTML, and
only links HTTP/S without credentials. MCP input is validated; bundled UI is
repository-owned code with no external frames/resources/connections.

API routes enforce Host/Origin, body limits and concurrency. Random job IDs act
as report capabilities. Memory jobs expire after 30 minutes or process exit and
can be deleted explicitly. No database, email/CRM, analytics, patient/lead form
or raw prompt/token logging is added. CLI files persist only as user-controlled
local artifacts. Remote staging requires authentication. Production needs
distributed abuse controls, tenant isolation and a privacy-accurate gateway.

Automated passes do not certify accessibility, complete keyboard/screen-reader
behavior or booking completion. Tap/heading/image/script counts are diagnostic
signals. Scripts are not called unnecessary without ownership/dependency review.
HTTPS is not a full security certification. Canonicals/robots/sitemaps do not
prove actual indexing; Search Console needs owner access. No rankings are promised.

Website claims are observed facts, not verified licensing/insurance/clinical
records. Copy requires owner/clinical review. Severity tracks observed patient
impact: a broken booking URL can be urgent; metadata/confirmation work is not.
Effort estimates are implementation ranges, excluding owner/vendor delays.
