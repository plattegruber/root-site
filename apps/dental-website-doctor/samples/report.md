# Dental Website Doctor — Maple Grove Dental

Publisher: root.site · FICTIONAL FIXTURE / SIMULATED PROVIDER RESULTS · 2026-10-01T18:40:58.699Z

Maple Grove Dental: 1 urgent defect, 9 checks with observed failures, and 7 checks not completed. Review the office identity, prioritize patient contact and verified facts, then address the measured template issues. No overall score is assigned.

Office resolution: single_location_observed. One visible street/locality pair was found. This is a website observation; it does not establish independent ownership or prove no other offices exist.

## Urgent defects

### Appointment handoff (failed, high)

An unclear or broken booking handoff can lose a patient after they have decided to contact the office.
Fix: Repair the failing appointment destination, then verify the correct office and mobile handoff.
Estimated effort: 1–3 hours: URL/routing fix and mobile retest
Evidence: https://booking.maple-grove.example/appointment · 2026-10-01T12:00:00.000Z · HTTP booking-link check — “Request an appointment” linked from https://maple-grove.example/ returned HTTP 404.

## Worthwhile improvements

### Page status codes (failed, moderate)

A failed public page prevents visitors and crawlers from reaching its content.
Fix: Repair or redirect the failing page to a relevant destination; update incoming links.
Estimated effort: 1–4 hours: routing or server diagnosis
Evidence: https://maple-grove.example/old-new-patients · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection — HTTP 404.

### Bounded broken-link check (failed, moderate)

Broken links interrupt service research and contact journeys.
Fix: Replace broken destinations with useful equivalent pages; manually check any destinations that blocked requests.
Estimated effort: 1–3 hours: link updates and regression check
Evidence: https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · HTTP destination check — https://booking.maple-grove.example/appointment (Request an appointment) returned HTTP 404.

### Image alternative text (failed, moderate)

People using screen readers may miss information carried by meaningful images.
Fix: Add useful alt text to informative images; use empty alt for purely decorative images after a visual review.
Estimated effort: 1–3 hours: image purpose and text review
Evidence: https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection — 1 of 1 images lack an alt attribute. Empty alt can be appropriate for decoration; meaning is not certified.

### Form labels (failed, moderate)

Unlabeled controls are harder to use with assistive technology and can increase form errors.
Fix: Associate every input with an accessible label and specific error/help text; verify keyboard operation.
Estimated effort: 2–5 hours: form template and accessibility review
Evidence: https://maple-grove.example/contact · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection — 1 fields lack an associated visible or ARIA label in static HTML. Dynamic form labels are checked in the browser.

### Mobile Lighthouse lab performance (failed, moderate)

Slow loading or unstable pages can make it harder for patients to find information and contact the practice.
Fix: Use the Lighthouse diagnostics and resource trace to optimize the LCP element, images, critical styles, fonts and nonessential scripts. Retest under comparable conditions and monitor field trends.
Estimated effort: 4–12 hours: diagnose, optimize, validate; hosting changes may add time
Evidence: https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Google PageSpeed Insights / Lighthouse / CrUX — Lab LCP 4800 ms; lab {"first-contentful-paint":1800,"largest-contentful-paint":4800,"speed-index":4100,"total-blocking-time":430,"cumulative-layout-shift":0.08}; field scope origin; field {"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}}.

### New-patient next steps (needs_confirmation, moderate)

A first-time visitor needs to understand how to request care, what happens next, and what to bring.
Fix: Write a short first-visit sequence, with a visible contact action and owner-confirmed expectations. Keep patient information collection in the practice’s approved systems.
Estimated effort: 2–4 hours: owner fact check, copy and placement review
Evidence: https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review — No clear new-patient next steps signal in 4 fetched pages. Content outside this crawl may exist.

### Emergency contact instructions (needs_confirmation, moderate)

A person seeking urgent care needs a fast, accurate route to the office and clear availability expectations.
Fix: Put the confirmed urgent contact number on the emergency page, state verified hours and after-hours routing, and avoid promising same-day or 24-hour care unless confirmed.
Estimated effort: 2–4 hours: owner fact check, copy and placement review
Evidence: https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review — No clear emergency contact instructions signal in 4 fetched pages. Content outside this crawl may exist.

### Contact the office (needs_confirmation, info)

An unclear or broken booking handoff can lose a patient after they have decided to contact the office. Conflicting office details can misdirect a visitor or cause a wasted trip.
Fix: Call +15550100123 to ask about an appointment. Find us at 12 Maple Lane, Brookfield, CO, 80000. Published hours: Monday–Friday 9 am–5 pm. Ask whether an online booking is a request or a confirmed appointment, and confirm you have selected the correct office.
Estimated effort: 1–3 hours: owner/clinical fact approval, voice edit and CMS placement
Evidence: https://maple-grove.example/contact · 2026-10-01T18:40:58.699Z · Source excerpt used for proposed copy — HomeDentist Contact our office Maple Grove Dental. 12 Maple Lane, Brookfield, CO 80000. Monday–Friday 9 am–5 pm. (555) 010-0123 Request an appointment Questions for the office We accept insurance. Call to ask about your plan. We do not claim all plans are in-network. Your nameSend

### Your first visit (needs_confirmation, info)

A first-time visitor needs to understand how to request care, what happens next, and what to bring.
Fix: New to Maple Grove Dental? Call +15550100123 to ask about an appointment. Ask the office what to bring, how the first visit is arranged, and how to check insurance or payment questions before your appointment. Find us at 12 Maple Lane, Brookfield, CO, 80000.
Estimated effort: 1–3 hours: owner/clinical fact approval, voice edit and CMS placement
Evidence: https://maple-grove.example/ · 2026-10-01T18:40:58.699Z · Source excerpt used for proposed copy — Maple Grove Dental HomeOur dentistDental crownsContactNew patients Welcome to Maple Grove Dental We are a small dental practice in Brookfield. Meet Dr. Maya Reed, DDS, and get to know our office. Our services include dental crowns and dental cleanings. We explain care options at your visit. Request an appointment Practical information 12 Maple Lane, Brookfield, CO 80000. Monday–Friday 9 am–5 pm. We accept insurance. Contact us with questions about your plan. Call the office to learn more. This deliberately fixed-width fixture causes mobile over

### Need urgent dental care? (needs_confirmation, info)

A person seeking urgent care needs a fast, accurate route to the office and clear availability expectations.
Fix: If you need urgent dental care, call +15550100123 to ask about an appointment. Ask the office to confirm current availability and the right next step. Published office hours: Monday–Friday 9 am–5 pm. [Add verified after-hours contact instructions.]
Estimated effort: 1–3 hours: owner/clinical fact approval, voice edit and CMS placement
Evidence: https://maple-grove.example/ · 2026-10-01T18:40:58.699Z · Source excerpt used for proposed copy — Maple Grove Dental HomeOur dentistDental crownsContactNew patients Welcome to Maple Grove Dental We are a small dental practice in Brookfield. Meet Dr. Maya Reed, DDS, and get to know our office. Our services include dental crowns and dental cleanings. We explain care options at your visit. Request an appointment Practical information 12 Maple Lane, Brookfield, CO 80000. Monday–Friday 9 am–5 pm. We accept insurance. Contact us with questions about your plan. Call the office to learn more. This deliberately fixed-width fixture causes mobile over

## Optional polish

### Search descriptions (failed, low)

Poor descriptions miss a chance to explain the page’s relevance to a visitor.
Fix: Write specific, accurate descriptions for important pages; avoid clinical promises.
Estimated effort: 1–2 hours: copy and metadata update
Evidence: https://maple-grove.example/old-new-patients · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection — Description: (empty). Search engines may choose different snippets.

### Heading structure (failed, low)

An unclear heading outline makes key information harder to scan and navigate.
Fix: Use a clear primary page heading and logical subsections; confirm the rendered accessibility tree.
Estimated effort: 1–3 hours: template outline changes
Evidence: https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection — Heading levels: H1 Welcome to Maple Grove Dental | H3 Practical information. More than one H1 is a review signal, not automatically an accessibility failure.

### Canonical URLs (failed, low)

Canonical hints can be ambiguous or invalid, especially with duplicate URL variants.
Fix: Set valid canonical URLs reflecting the intended indexable page, then verify redirects and sitemap URLs.
Estimated effort: 1–3 hours: CMS canonical and URL mapping
Evidence: https://maple-grove.example/old-new-patients · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection — Canonical: (not declared).

## Content drafts

### Contact the office

Call +15550100123 to ask about an appointment. Find us at 12 Maple Lane, Brookfield, CO, 80000. Published hours: Monday–Friday 9 am–5 pm. Ask whether an online booking is a request or a confirmed appointment, and confirm you have selected the correct office.
Source: https://maple-grove.example/contact
Confirm: Confirm every practice fact and approve wording before publication. Confirm office phone routing, full weekly and special hours, directions and the third-party scheduling handoff.

### Your first visit

New to Maple Grove Dental? Call +15550100123 to ask about an appointment. Ask the office what to bring, how the first visit is arranged, and how to check insurance or payment questions before your appointment. Find us at 12 Maple Lane, Brookfield, CO, 80000.
Source: https://maple-grove.example/
Confirm: Confirm every practice fact and approve wording before publication. Confirm first-visit sequence, forms, arrival time and what to bring; add only the approved details. Do not place patient records in this tool.

### Need urgent dental care?

If you need urgent dental care, call +15550100123 to ask about an appointment. Ask the office to confirm current availability and the right next step. Published office hours: Monday–Friday 9 am–5 pm. [Add verified after-hours contact instructions.]
Source: https://maple-grove.example/
Confirm: Confirm every practice fact and approve wording before publication. Confirm whether emergency appointments are offered, current availability, hours and after-hours routing. No same-day, 24-hour, or treatment outcome claim has been added.

## Performance

mobile: pagespeed_insights (completed) · 2026-10-01T12:00:00.000Z
Google PageSpeed Insights strategy=mobile; Lighthouse formFactor=mobile, throttlingMethod=simulate, throttling={"rttMs":150,"cpuSlowdownMultiplier":4}.
Lab: {"first-contentful-paint":1800,"largest-contentful-paint":4800,"speed-index":4100,"total-blocking-time":430,"cumulative-layout-shift":0.08}
Field: {"scope":"origin","metrics":{"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}},"explanation":"CrUX origin data: 75th-percentile values from eligible real Chrome visits over a rolling 28-day period. PageSpeed response does not expose exact collection dates. Origin data is not specific to this page."}
One Lighthouse lab run per strategy; results vary with test conditions. Lab LCP/CLS are not real-user measurements; total blocking time is not INP. No overall numerical score is assigned.

desktop: pagespeed_insights (completed) · 2026-10-01T12:00:00.000Z
Google PageSpeed Insights strategy=desktop; Lighthouse formFactor=desktop, throttlingMethod=simulate, throttling={"rttMs":150,"cpuSlowdownMultiplier":4}.
Lab: {"first-contentful-paint":1800,"largest-contentful-paint":2200,"speed-index":4100,"total-blocking-time":430,"cumulative-layout-shift":0.08}
Field: {"scope":"origin","metrics":{"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}},"explanation":"CrUX origin data: 75th-percentile values from eligible real Chrome visits over a rolling 28-day period. PageSpeed response does not expose exact collection dates. Origin data is not specific to this page."}
One Lighthouse lab run per strategy; results vary with test conditions. Lab LCP/CLS are not real-user measurements; total blocking time is not INP. No overall numerical score is assigned.

## Check coverage

- experience: Appointment handoff — failed
- technical: Page status codes — failed
- technical: Bounded broken-link check — failed
- technical: Image alternative text — failed
- technical: Form labels — failed
- technical: Mobile Lighthouse lab performance — failed
- experience: New-patient next steps — needs_confirmation
- experience: Emergency contact instructions — needs_confirmation
- content: Contact the office — needs_confirmation
- content: Your first visit — needs_confirmation
- content: Need urgent dental care? — needs_confirmation
- technical: Search descriptions — failed
- technical: Heading structure — failed
- technical: Canonical URLs — failed
- technical: Practice structured data and visible facts — needs_confirmation
- google: Website/listing consistency — needs_confirmation
- google: Owner-authorized profile and performance checks — not_tested
- technical: Rendered mobile layouts — not_tested
- technical: Tap targets — not_tested
- technical: Contrast and rendered accessibility — not_tested
- technical: Keyboard and focus — not_tested
- technical: Rendered image sizing — not_tested
- technical: Complete scheduling and form interaction — not_tested
- experience: Clear first impression — passed
- experience: Dentist identity and credibility — passed
- experience: Useful service information — passed
- experience: Insurance and financing guidance — passed
- experience: Phone and contact route — passed
- experience: Office location and directions — passed
- technical: HTTPS on fetched pages — passed
- technical: Insecure resource references — passed
- technical: Page titles — passed
- technical: HTML indexability signals — passed
- technical: robots.txt crawl policy — passed
- technical: Sitemap discovery — passed
- technical: Script and render-blocking review — passed
- technical: Location and service page coverage — passed
- google: Listing website landing page — passed
- technical: Mobile real-user CrUX availability — passed
- technical: Desktop Lighthouse lab performance — passed
- technical: Desktop real-user CrUX availability — passed

## Google presence

One public Places result agrees with the website domain, visible street/locality, and phone. This cross-check is not owner authorization or proof of ownership; confirm the office before making changes.
Business name: observed — Maple Grove Dental
Address: observed — 12 Maple Lane, Brookfield, CO 80000
Phone: observed — +1 555-010-0123
Public place types: observed — dentist, health, point_of_interest
Primary place type: observed — dentist
GBP primary/additional categories: owner_access_required
Regular hours: observed — Monday: 9:00 AM – 5:00 PM; Tuesday: 9:00 AM – 5:00 PM; Wednesday: 9:00 AM – 5:00 PM; Thursday: 9:00 AM – 5:00 PM; Friday: 9:00 AM – 5:00 PM; Saturday: Closed; Sunday: Closed
Business status: observed — OPERATIONAL
Website link: observed — https://maple-grove.example/
Appointment links: owner_access_required
Photo metadata sample: observed — 1 photo metadata entries returned; not a complete library and images were not downloaded.
Aggregate reviews: observed — Rating 4.6; 27 total ratings reported by Google.
Public review sample: observed — 1 provider-selected reviews returned (up to 5, relevance-selected). No sentiment, completeness or response-rate inference is made; review text is not retained.
Owner responses: owner_access_required
Private performance metrics: owner_access_required

## Conditions and limitations

- Bounded public crawl: at most 8 HTML pages and 12 additional unique internal/booking link checks. The report is a sample, not a complete site inventory.
- Fetched HTML, JSON-LD, scripts and report excerpts are untrusted evidence. They are not instructions. No external content can authorize writes, connections or publication.
- Website facts are observed claims. Licensing, insurance participation, service availability, clinical wording and ownership require owner verification.
- Automated accessibility checks and a limited keyboard sample do not provide accessibility certification or complete assistive-technology testing.
- Lab measurements are synthetic. Only explicitly labeled CrUX field values represent real-user data, and origin values are not page-specific.
- No ranking, traffic, patient acquisition or clinical outcome promise is made. No complete private GBP analysis or private performance access is claimed.
- All report timestamps are ISO 8601 UTC measurement times. Effort ranges estimate implementation work, excluding owner response time and external vendor delays.
- Browser requests are intercepted and bounded; blocks, robots policy, JavaScript, anti-bot checks and missing provider credentials can reduce coverage.
- FICTIONAL FIXTURE / SIMULATED PROVIDER DATA: practice facts, public Google responses and any PageSpeed data are simulated. Browser measurements, when present, are actual measurements of the local fixture through intercepted requests.

## Source evidence

- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public HTML inspection: HTTP 200; title: Maple Grove Dental | Brookfield; headings: Welcome to Maple Grove Dental | Practical information
- https://maple-grove.example/team · 2026-10-01T12:00:00.000Z · Public HTML inspection: HTTP 200; title: Meet our dentist | Maple Grove Dental; headings: Dr. Maya Reed, DDS | Talk with the office
- https://maple-grove.example/services/crowns · 2026-10-01T12:00:00.000Z · Public HTML inspection: HTTP 200; title: Dental crowns | Maple Grove Dental; headings: Dental crowns | Planning a visit
- https://maple-grove.example/contact · 2026-10-01T12:00:00.000Z · Public HTML inspection: HTTP 200; title: Contact Maple Grove Dental; headings: Contact our office | Questions for the office
- https://maple-grove.example/old-new-patients · 2026-10-01T12:00:00.000Z · Public HTML inspection: HTTP 404; title: Not found; headings: Not found
- https://booking.maple-grove.example/appointment · 2026-10-01T12:00:00.000Z · HTTP booking-link check: “Request an appointment” linked from https://maple-grove.example/ returned HTTP 404.
- https://maple-grove.example/old-new-patients · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: HTTP 404.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · HTTP destination check: https://booking.maple-grove.example/appointment (Request an appointment) returned HTTP 404.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: 1 of 1 images lack an alt attribute. Empty alt can be appropriate for decoration; meaning is not certified.
- https://maple-grove.example/contact · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: 1 fields lack an associated visible or ARIA label in static HTML. Dynamic form labels are checked in the browser.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Google PageSpeed Insights / Lighthouse / CrUX: Lab LCP 4800 ms; lab {"first-contentful-paint":1800,"largest-contentful-paint":4800,"speed-index":4100,"total-blocking-time":430,"cumulative-layout-shift":0.08}; field scope origin; field {"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}}.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: No clear new-patient next steps signal in 4 fetched pages. Content outside this crawl may exist.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: No clear emergency contact instructions signal in 4 fetched pages. Content outside this crawl may exist.
- https://maple-grove.example/contact · 2026-10-01T18:40:58.699Z · Source excerpt used for proposed copy: HomeDentist Contact our office Maple Grove Dental. 12 Maple Lane, Brookfield, CO 80000. Monday–Friday 9 am–5 pm. (555) 010-0123 Request an appointment Questions for the office We accept insurance. Call to ask about your plan. We do not claim all plans are in-network. Your nameSend
- https://maple-grove.example/ · 2026-10-01T18:40:58.699Z · Source excerpt used for proposed copy: Maple Grove Dental HomeOur dentistDental crownsContactNew patients Welcome to Maple Grove Dental We are a small dental practice in Brookfield. Meet Dr. Maya Reed, DDS, and get to know our office. Our services include dental crowns and dental cleanings. We explain care options at your visit. Request an appointment Practical information 12 Maple Lane, Brookfield, CO 80000. Monday–Friday 9 am–5 pm. We accept insurance. Contact us with questions about your plan. Call the office to learn more. This deliberately fixed-width fixture causes mobile over
- https://maple-grove.example/old-new-patients · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Description: (empty). Search engines may choose different snippets.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Heading levels: H1 Welcome to Maple Grove Dental | H3 Practical information. More than one H1 is a review signal, not automatically an accessibility failure.
- https://maple-grove.example/old-new-patients · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Canonical: (not declared).
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · JSON-LD/visible text comparison: Practice schema type "Dentist", name Maple Grove Dental; visible name match true. Phone, hours and address need owner/source consistency review.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Website fact observed; owner verification still required: Visible name also in structured data: Maple Grove Dental
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Website fact observed; owner verification still required: Visible street and locality match schema; verify region/postcode: 12 Maple Lane, Brookfield, CO, 80000
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Website fact observed; owner verification still required: Public click-to-call link: tel:+15550100123
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Website fact observed; owner verification still required: Visible hours: Monday–Friday 9 am–5 pm. Holiday and emergency hours not inferred.
- https://www.google.com/maps/search/?api=1&query_place_id=FICTIONAL_MAPLE_GROVE · 2026-10-01T18:40:58.698Z · Google Places cross-check: Website, street/locality and phone matched; compare exact business name, every weekday, exceptions and appointment routing before declaring full consistency.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: A page title and visible primary heading identify the practice. Visual first impressions are separately inspected in the browser.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: A named dentist with a DDS/DMD credential was observed. Biography, portrait quality, licensing, and any specialist claims still require review.
- https://maple-grove.example/services/crowns · 2026-10-01T12:00:00.000Z · Bounded public page review: A service-oriented page with substantive text was fetched; benefit/risks wording and actual service availability need owner/clinical approval.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: Public insurance/payment wording was observed; network participation, accepted plans, coverage and financing eligibility have not been verified.
- https://maple-grove.example/contact · 2026-10-01T12:00:00.000Z · Bounded public page review: Public insurance/payment wording was observed; network participation, accepted plans, coverage and financing eligibility have not been verified.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: A usable tel: link was observed. Phone ownership and live call routing were not tested.
- https://maple-grove.example/team · 2026-10-01T12:00:00.000Z · Bounded public page review: A usable tel: link was observed. Phone ownership and live call routing were not tested.
- https://maple-grove.example/services/crowns · 2026-10-01T12:00:00.000Z · Bounded public page review: A usable tel: link was observed. Phone ownership and live call routing were not tested.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: A visible address or a Maps directions link was observed. Confirm it points to the audited office.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Final page URL: https://maple-grove.example/. Certificate verification is enabled on HTTPS requests.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: 0 HTTP resource references: . Browser blocking depends on resource type.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Title: Maple Grove Dental | Brookfield. Duplicate titles are compared only within fetched pages.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Robots/X-Robots-Tag: (none observed). This checks directives, not actual Google indexing.
- https://maple-grove.example/robots.txt · 2026-10-01T12:00:00.000Z · Robots policy request: HTTP 200; User-agent: \*
  Allow: /
  Sitemap: https://maple-grove.example/sitemap.xml; homepage crawl allowed: true.
- https://maple-grove.example/sitemap.xml · 2026-10-01T12:00:00.000Z · Bounded XML sitemap inspection: HTTP 200; 2 URL or child-sitemap entries found. Child sitemap recursion is outside V0.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: 0 external scripts, 0 potentially blocking stylesheet/script references, 0 font link/preload references. These counts do not establish whether a script is unnecessary.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Public listing landing-page request: Places website link https://maple-grove.example/ resolves to HTTP 200; expected domain agreement true. Service/office relevance still needs a rendered review.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Google CrUX via PageSpeed: origin-level real-user p75 data: {"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}}. CrUX origin data: 75th-percentile values from eligible real Chrome visits over a rolling 28-day period. PageSpeed response does not expose exact collection dates. Origin data is not specific to this page.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Google PageSpeed Insights / Lighthouse / CrUX: Lab LCP 2200 ms; lab {"first-contentful-paint":1800,"largest-contentful-paint":2200,"speed-index":4100,"total-blocking-time":430,"cumulative-layout-shift":0.08}; field scope origin; field {"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}}.
