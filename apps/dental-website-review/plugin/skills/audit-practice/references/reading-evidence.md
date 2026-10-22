# Reading the evidence

The tools report what they saw. These notes prevent the false positives automated audits
are known for. Each one comes from a real mistake.

## Text

- `headerText` and `footerText` repeat on most pages. Hours, phone and address there count
  as shown on every page. Hours are often written like `Monday 8:30 - 4:00`, without
  am/pm.
- An address in the footer is shown even if `structuredData` lacks it. Missing structured
  data is a separate, polish-level point.
- `mainText` is capped at 2,500 characters (`mainTextTruncated`). Use `read_page` for the
  rest before concluding something isn’t on that page.
- Text inside testimonials or reviews is the patient speaking. “Best dentist I’ve had” in a
  review is not an advertising claim by the practice.

## Absence

- Absence means “not in the pages fetched”. Before calling something missing, search every
  page’s header, main and footer text, then check `sitemap.unfetchedUrls` and `read_page`
  the likeliest URL. Write “I didn’t find…”.
- `crawl.duplicatesSkipped` lists URLs that served a page already fetched (for example `/`
  and `/home/`). That is normal CMS behaviour, not a defect.
- Squarespace, Wix and similar builders add a cart link (often a bare “0” pointing at
  `/cart`) and account links to every page. They are template chrome; don’t report them.
- `linksNotChecked` were skipped because the target’s robots.txt forbids automated checks
  (common for patient-form vendors). They are not broken. `brokenLinks` are links that
  returned an error status or failed to connect.
- A broken link to a third-party scheduler or form is weak evidence on its own: vendors
  often reject automated requests that a patient’s browser would pass. Say “an automated
  check of the Schedule Online link got an error; open it on a phone to confirm”, rate it
  **next**, and don’t let it make the booking journey blocked. Don’t try to confirm it by
  fetching the vendor yourself: you’ll hit the same wall.

## Contact and booking

- `phoneLinks` are tappable `tel:` links; `phoneNumbersInText` are numbers in the text. A
  number in the text with no `tel:` link on that page can’t be tapped on a phone.
- `bookingLinks` include internal request pages and external schedulers. A `vendor` (for
  example NexHealth or LocalMed) usually means real-time online scheduling; an internal
  page usually means a request form.
- In rendered views, `callAboveFold` and `bookAboveFold` at 360 and 390px wide describe
  the phone’s first screen. `stickyActions` means a call or book control stays visible
  while scrolling.

## Forms and trackers

- `forms` in `collect_site_evidence` come from the HTML as delivered. Many CMSs
  (Squarespace, Wix) build forms with JavaScript, so a booking page can show no forms
  there. The rendered `forms` in `inspect_rendered_pages` show the fields a patient
  actually sees. Check both before saying a page has no form.
- `thirdParty` lists scripts named in the HTML. The rendered `thirdPartyRequests` lists
  every host the page tried to contact while loading, including what a tag manager loads.
  Prefer the rendered list for privacy findings.
- Common hosts: `connect.facebook.net` or `facebook.com` is Meta (advertising);
  `googleads.g.doubleclick.net`, `googleadservices.com`, `pagead2.googlesyndication.com`
  and `ad.doubleclick.net` are Google advertising; `googletagmanager.com` is a tag
  container; `google-analytics.com` is analytics; `hotjar`, `clarity.ms` and `fullstory`
  are session replay.
- A form field asks for health information when it collects symptoms, a reason for the
  visit (including checkboxes like “Emergency Dental Care”), insurance, date of birth,
  medications, or a free-text message about a dental problem.

## Measurements

- `axeViolations` are automated WCAG A/AA results; count is per rule. They show real
  defects but not full accessibility.
- `smallTapTargets` counts controls under 24px on one axis; inline text links are often
  exempt. Mention it only on the main journeys.
- Performance `not_tested` means PageSpeed isn’t configured. Lab metrics are synthetic;
  `field` data is from real Chrome users.
- When `fixture` is true, the practice is fictional. Say so.
