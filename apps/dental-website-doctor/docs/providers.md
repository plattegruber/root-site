# Providers, credentials and costs

Modules report observations/availability independently. Provider failures preserve
completed website results. Keys remain server-side and never appear in report
errors. The default core and fixture need no external account.

| Provider              | Exact setup                                                                                                                                                                 | Cost/coverage                                                                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Crawler/Chromium      | Public egress, Chromium/system libraries and browser process/local socket support. No user account.                                                                         | Server CPU, memory and bandwidth; bounded concurrency, pages, links, requests, bytes and time. Intercepted resources affect synthetic browser navigation timing.                                                             |
| PageSpeed Insights v5 | Enable the API in Google Cloud; `PAGESPEED_ENABLED=true`, optional restricted `PAGESPEED_API_KEY`. Unkeyed calls may be quota-limited/rejected.                             | Google quotas apply; verify project terms/limits rather than assume unlimited access. One mobile and one desktop Lighthouse run; eligible CrUX URL/origin data. No field eligibility is not a failure.                       |
| Places API (New)      | Enable Places API (New), project billing, API/server-IP restrictions; `GOOGLE_PLACES_API_KEY`.                                                                              | Billable Text Search with field mask. Ratings/reviews/photo fields may trigger higher-priced tiers. Configure quotas/budgets and check live regional pricing. One search, up to 5 candidates, and one matched website fetch. |
| Owner GBP             | **Not implemented.** Approved Business Profile API project, OAuth consent, `business.manage` owner grant, exact account/location selection, linked-account MCP OAuth layer. | Approval/quotas, engineering and operations. No private metrics or owner access is claimed. Places access is separate.                                                                                                       |

Official setup references:

- [PageSpeed](https://developers.google.com/speed/docs/insights/v5/get-started)
- [Places fields](https://developers.google.com/maps/documentation/places/web-service/place-details)
- [Text Search](https://developers.google.com/maps/documentation/places/web-service/text-search)
- [Maps pricing](https://developers.google.com/maps/billing-and-pricing/overview)
- [Places policies/attribution](https://developers.google.com/maps/documentation/places/web-service/policies)
- [GBP prerequisites](https://developers.google.com/my-business/content/basic-setup)
- [Business Information](https://developers.google.com/my-business/reference/businessinformation/rest)
- [Place Actions](https://developers.google.com/my-business/reference/placeactions/rest)
- [Performance](https://developers.google.com/my-business/reference/performance/rest)

Place Details and GBP prerequisite pages were fetched during this implementation;
the other links are setup references, not executed provider calls or proof of
authorization. Recheck fields/policies before owner-access implementation.

## Public Google checks

Anonymous Maps HTML may be a shell, consent wall or anti-bot response. Unexposed
fields remain unavailable; photos/categories/replies/links are never called
missing. Without a Places key, the report still offers website identity,
contact/directions readiness and a checklist for the exact public listing. That
is useful public readiness analysis, not private listing access.

Associate Places only after a unique domain, visible street/locality and phone
match. Ambiguous offices/candidates withhold listing facts. Places types are
**not** actual GBP primary/additional categories. Reviews are a selected sample
(up to five), not full history; text is not retained and no sentiment/response rate
is inferred. Photos are metadata samples, not complete galleries. Google Maps
source attribution is shown; future review snippets/images need required
individual attributions and policy-compliant display.

Do not add persistent Places caching/exports without reviewing Google’s
storage/display terms. Production artifact retention requires policy review.
The CLI saves explicitly requested local artifacts; checked-in samples contain
fictional provider data, not cached Google data.

## Richer owner access

Add `BusinessProfileProvider` mapping supported APIs into `google.fields` with
`source='owner_authorized'`. Require owner consent, exact office selection and
per-call account/location authorization. Read supported business information,
categories, hours, appointment actions, photos, reviews/replies. Performance
metrics need approved API access, supported metrics and exact date windows.
Do not assume private performance exists in Places or that one scope grants
unrelated Google API access.

This server accepts no owner tokens. A future connection needs encrypted storage,
revocation/deletion, tenant isolation, least-privilege reads and standard MCP OAuth.

## Performance interpretation

Preserve Lighthouse version/config, lab metrics/units and timestamp separately
from field scope. TBT is not INP; lab LCP/CLS do not replace real-user values. CrUX
is p75 for rolling 28-day eligible Chrome visits; the PageSpeed response does not
expose exact collection dates. Origin fallback is labeled, not presented as a page
measurement. Missing field data indicates availability/eligibility limitations.
