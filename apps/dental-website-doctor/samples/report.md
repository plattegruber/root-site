# Dental Website Doctor — Bright Smiles Family Dentistry
Publisher: root.site · FICTIONAL FIXTURE / SIMULATED PROVIDER RESULTS · 2026-10-02T05:24:06.364Z

Bright Smiles Family Dentistry: 32 of 63 checks found a problem (19 specific to dental practices, 24 measured, 8 editorial). 3 urgent. Start with: Click-to-call phone number; Health information in forms next to tracking pixels; Patient form submits insecurely. 8 items need the owner to confirm a fact. 8 checks did not run (see limitations). No overall score is assigned.

Office resolution: single_location_observed. One visible street/locality pair was found. This is a website observation; it does not establish independent ownership or prove no other offices exist.

## Start here

1. **Click-to-call phone number** (measured, dental-specific) — Most dental appointments still start with a phone call, usually from a phone. Without a tappable number, a patient has to memorize or copy it.
2. **Health information in forms next to tracking pixels** (measured, dental-specific) — A dental practice is a HIPAA covered entity. Meta, TikTok and Google Ads pixels on a page where patients type “tooth pain, Delta Dental, DOB” have been the basis of class actions and OCR enforcement since the 2022 HHS tracking bulletin. This is a legal exposure, not a UX nit.
3. **Patient form submits insecurely** (measured, dental-specific) — A form that emails or GETs health details sends them in plain text through systems no BAA covers. Patients cannot see this; regulators can.
4. **Appointment booking route** (measured, dental-specific) — Roughly half of prospective patients prefer to book outside office hours. Phone-only booking loses them to a practice with online scheduling.
5. **New-patient path** (measured, dental-specific) — A first-time patient is deciding whether this office is easy to deal with. “Are you taking new patients, what do I fill out, what do I bring, how long will it take” are the four questions they arrive with.

How to read this report: *Measured* findings describe something the tool observed (a broken link, a missing page, a tracker next to a form). *Opinion* findings are editorial judgements with their reasoning shown; disagree freely. *Dental-specific* findings would not appear in a generic website audit. Each finding has a line for the practice owner (why it matters) and a line for the developer (what to change).

## Urgent: fix this week

### Click-to-call phone number
Measured · Dental-specific · status: failed · severity: high

**For the practice:** Most dental appointments still start with a phone call, usually from a phone. Without a tappable number, a patient has to memorize or copy it.
**For the developer:** Wrap the office number in an <a href="tel:+1…"> link in the site header and footer, and on the contact and emergency pages.
**Effort:** 1 hour: header and footer template
- Evidence: https://brightsmiles.example/ · Bounded public page review — No tel: link on any of 5 fetched pages. A phone number written as plain text cannot be tapped on a phone.

### Health information in forms next to tracking pixels
Measured · Dental-specific · status: failed · severity: high

**For the practice:** A dental practice is a HIPAA covered entity. Meta, TikTok and Google Ads pixels on a page where patients type “tooth pain, Delta Dental, DOB” have been the basis of class actions and OCR enforcement since the 2022 HHS tracking bulletin. This is a legal exposure, not a UX nit.
**For the developer:** Remove advertising pixels from every page with a form (or from the whole site), or move intake to a HIPAA-compliant forms vendor with a signed BAA. Review the tag manager container; use server-side conversion tracking without PHI if ads must be measured.
**Effort:** 2–4 hours plus marketing sign-off
**Why we think so:** Based on the HHS OCR bulletin on online tracking technologies (Dec 2022, updated Mar 2024). Parts were vacated for unauthenticated pages in June 2024, but a form that asks for symptoms or insurance is exactly the case the bulletin still covers.
- Evidence: https://brightsmiles.example/contact · Static HTML: form fields and third-party script hosts — Form fields that would carry health or insurance details: Date of Birth, Insurance Provider, Reason for Visit / Describe your dental concern, Are you a new patient?. Advertising trackers on the same page: connect.facebook.net. Analytics/session tools: www.googletagmanager.com, static.hotjar.com.

### Patient form submits insecurely
Measured · Dental-specific · status: failed · severity: high

**For the practice:** A form that emails or GETs health details sends them in plain text through systems no BAA covers. Patients cannot see this; regulators can.
**For the developer:** Submit forms over HTTPS with POST to a HIPAA-compliant handler or forms vendor; never use mailto: for anything beyond a name and phone number.
**Effort:** 1–3 hours
- Evidence: https://brightsmiles.example/contact · Static HTML form attributes — posts by mailto: (mailto:frontdesk@brightsmiles.example)


## Worth doing: the next month

### Appointment booking route
Measured · Dental-specific · status: failed · severity: moderate

**For the practice:** Roughly half of prospective patients prefer to book outside office hours. Phone-only booking loses them to a practice with online scheduling.
**For the developer:** Add real-time online scheduling from your practice management system or a vendor (NexHealth, LocalMed, Flex, Zocdoc, etc.), or at minimum a short appointment-request form with a stated callback time.
**Effort:** 1–2 days: vendor setup and integration
- Evidence: https://brightsmiles.example/ · Bounded public page review — No booking link, scheduling widget or appointment form on 5 fetched pages.

### New-patient path
Measured · Dental-specific · status: failed · severity: moderate

**For the practice:** A first-time patient is deciding whether this office is easy to deal with. “Are you taking new patients, what do I fill out, what do I bring, how long will it take” are the four questions they arrive with.
**For the developer:** Create a /new-patients page: accepting-new-patients statement, how to book, what the first visit includes and how long it takes, what to bring, insurance and payment basics, and a link to forms.
**Effort:** 3–5 hours: owner input plus one page
- Evidence: https://brightsmiles.example/ · Bounded public page review — No new-patient or first-visit page among 5 fetched pages.

### Insurance and payment clarity
Measured · Dental-specific · status: failed · severity: moderate

**For the practice:** “We accept most insurance” is the sentence patients trust least. They want to know whether you are in network with their plan, because that decides their bill.
**For the developer:** Publish an insurance page that lists the plans you are in network with, explains how out-of-network billing works, names your financing partner and any in-house membership plan, and says what an uninsured new-patient visit costs.
**Effort:** 2–3 hours: owner provides the list; one page
- Evidence: https://brightsmiles.example/ · Bounded public page review — No insurer is named. No in-network / participating-provider statement. Vague wording: “…ral health and exceptional dental care. We accept all insurance plans. Call us today! Learn More Read M…”. No financing provider named. No in-house membership plan mentioned.

### Emergency and after-hours instructions
Measured · Dental-specific · status: failed · severity: moderate

**For the practice:** Someone searching “emergency dentist near me” at 9 pm is in pain and will call the first office whose site tells them what to do. This is the highest-intent traffic a practice gets.
**For the developer:** Create an /emergency page with: the number to call, what happens after hours (answering service, on-call dentist, or “go to the ER if…”), which problems are true emergencies, and whether same-day visits are realistic.
**Effort:** 2–3 hours: owner decides routing; one page
- Evidence: https://brightsmiles.example/ · Bounded public page review — No emergency or urgent-care wording on 5 fetched pages.

### Service pages that lead to a next step
Measured · Dental-specific · status: failed · severity: moderate

**For the practice:** Patients search for the procedure (“dental implants near me”), not the practice. One page listing twenty services cannot rank for any of them or answer the question “should I come to you for this?”.
**For the developer:** Create one page per high-value service (implants, Invisalign, emergency, crowns, whitening, kids): who it is for, what the visit involves, how long, cost range or how it is estimated, and a book/call action.
**Effort:** 4–8 hours per page for the top five services
- Evidence: https://brightsmiles.example/ · Bounded public page review — 0 individual service pages fetched; sitemap suggests about 1 service URLs in total. Sedation/anxiety options are mentioned. Children/family wording is present.

### Privacy policy and HIPAA notice
Measured · Dental-specific · status: failed · severity: moderate

**For the practice:** Any site with a form needs a privacy policy, and a dental practice must post its HIPAA Notice of Privacy Practices. Its absence is the first thing a complaint investigator checks.
**For the developer:** Add a footer link to a privacy policy that covers the forms and trackers in use, and a link to the Notice of Privacy Practices.
**Effort:** 1–2 hours
- Evidence: https://brightsmiles.example/ · Bounded public page review — No privacy, HIPAA or notice-of-privacy link on 5 fetched pages.

### Advertising claims a dental board may question
Measured · Dental-specific · status: failed · severity: moderate

**For the practice:** State dental practice acts prohibit false, misleading or unverifiable advertising, and competitors do file complaints. “Painless”, “guaranteed” and “best” are the usual triggers.
**For the developer:** Rewrite to what you can substantiate: “we use topical and local anesthetic and go slowly”, “voted Best of [City] 2025 by [publication]”, “most whitening lasts 1–3 years with touch-ups”.
**Effort:** 1–2 hours of copy edits
**Why we think so:** The text is objectively present; whether a given state board would act on it is a judgement, so confidence is medium. Have the dentist review against their state’s rules.
- Evidence: https://brightsmiles.example/ · Visible copy review — “no further for all of your dental needs. We offer painless dentistry and we guarantee you will love your new” — promises an outcome (“painless”) no clinician can guarantee.
- Evidence: https://brightsmiles.example/ · Visible copy review — “dental needs. We offer painless dentistry and we guarantee you will love your new smile. Dr. Smith is a cosm” — offers a guarantee; many boards treat guaranteed results as misleading.
- Evidence: https://brightsmiles.example/ · Visible copy review — “stry and family dentistry. We have been voted the best dentist in Fairview and we are the #1 choice for families” — superiority claim that must be substantiated and attributed (who voted, when).
- Evidence: https://brightsmiles.example/ · Visible copy review — “fect. I used to hate the dentist!” — Jennifer R. “Best dental office in Fairview. The whole staff is wonderful.” — Mar” — superiority claim that must be substantiated and attributed (who voted, when).
- Evidence: https://brightsmiles.example/services · Visible copy review — “Veneers, teeth whitening and smile makeovers. We guarantee results you will love and our whitening is perman” — offers a guarantee; many boards treat guaranteed results as misleading.

### “Specialist” wording for a non-recognised specialty
Measured · Dental-specific · status: failed · severity: moderate

**For the practice:** Cosmetic, implant, sedation and family dentistry are not ADA-recognised specialties. Many states let only licensed specialists use “specialist”/“specializes in”; a general dentist can be disciplined for it.
**For the developer:** Use “focuses on”, “with advanced training in” or “provides” instead, and name the actual training (e.g. “AAID credentialed”, “300+ hours of implant CE”).
**Effort:** 30–60 minutes
**Why we think so:** Rules differ by state and courts have struck some down on First Amendment grounds; this is a review flag for the dentist, not a verdict.
- Evidence: https://brightsmiles.example/ · Visible copy review — “…d we guarantee you will love your new smile. Dr. Smith is a cosmetic dentistry specialist and specializes in implant dentistry, sedation dentistry an…”
- Evidence: https://brightsmiles.example/ · Visible copy review — “…new smile. Dr. Smith is a cosmetic dentistry specialist and specializes in implant dentistry, sedation dentistry and family dentistry. We have…”
- Evidence: https://brightsmiles.example/about · Visible copy review — “…dental technology in a relaxing environment. Dr. Smith is a cosmetic dentistry specialist who is passionate about creating beautiful smiles. Our frie…”

### Page titles
Measured · Any website · status: failed · severity: moderate

**For the practice:** A missing or repeated title makes search results and browser tabs harder to understand.
**For the developer:** Write one descriptive title per page that reflects its purpose and verified office facts.
**Effort:** 1–2 hours: title map and CMS update
- Evidence: https://brightsmiles.example/ · Public HTML/HTTP inspection — Title: Bright Smiles Family Dentistry. Duplicate titles are compared only within fetched pages.
- Evidence: https://brightsmiles.example/contact · Public HTML/HTTP inspection — Title: Bright Smiles Family Dentistry. Duplicate titles are compared only within fetched pages.
- Evidence: https://brightsmiles.example/about · Public HTML/HTTP inspection — Title: Bright Smiles Family Dentistry. Duplicate titles are compared only within fetched pages.
- Evidence: https://brightsmiles.example/services · Public HTML/HTTP inspection — Title: Bright Smiles Family Dentistry. Duplicate titles are compared only within fetched pages.
- Evidence: https://brightsmiles.example/blog · Public HTML/HTTP inspection — Title: Bright Smiles Family Dentistry. Duplicate titles are compared only within fetched pages.

### Image alternative text
Measured · Any website · status: failed · severity: moderate

**For the practice:** People using screen readers may miss information carried by meaningful images.
**For the developer:** Add useful alt text to informative images; use empty alt for purely decorative images after a visual review.
**Effort:** 1–3 hours: image purpose and text review
- Evidence: https://brightsmiles.example/ · Public HTML/HTTP inspection — 1 of 3 images lack an alt attribute. Empty alt can be appropriate for decoration; meaning is not certified.

### Mobile Lighthouse lab performance
Measured · Any website · status: failed · severity: moderate

**For the practice:** Slow loading or unstable pages can make it harder for patients to find information and contact the practice.
**For the developer:** Use the Lighthouse diagnostics and resource trace to optimize the LCP element, images, critical styles, fonts and nonessential scripts. Retest under comparable conditions and monitor field trends.
**Effort:** 4–12 hours: diagnose, optimize, validate; hosting changes may add time
- Evidence: https://maple-grove.example/ · Google PageSpeed Insights / Lighthouse / CrUX — Lab LCP 4800 ms; lab {"first-contentful-paint":1800,"largest-contentful-paint":4800,"speed-index":4100,"total-blocking-time":430,"cumulative-layout-shift":0.08}; field scope origin; field {"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}}.

### Desktop Lighthouse lab performance
Measured · Any website · status: failed · severity: moderate

**For the practice:** Slow loading or unstable pages can make it harder for patients to find information and contact the practice.
**For the developer:** Use the Lighthouse diagnostics and resource trace to optimize the LCP element, images, critical styles, fonts and nonessential scripts. Retest under comparable conditions and monitor field trends.
**Effort:** 4–12 hours: diagnose, optimize, validate; hosting changes may add time
- Evidence: https://maple-grove.example/ · Google PageSpeed Insights / Lighthouse / CrUX — Lab LCP 4800 ms; lab {"first-contentful-paint":1800,"largest-contentful-paint":4800,"speed-index":4100,"total-blocking-time":430,"cumulative-layout-shift":0.08}; field scope origin; field {"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}}.

### Patient testimonials and before/after photos need authorization
Measured · Dental-specific · status: failed · severity: low

**For the practice:** Using a patient’s name, photo or treatment story in marketing requires a signed HIPAA marketing authorization, separate from the consent to treat. Several states also require a disclaimer on before/after images.
**For the developer:** Keep a signed authorization on file for every named testimonial and photo; add “Actual patient. Individual results vary.” under galleries; remove anything you cannot document.
**Effort:** 1–2 hours of records review
- Evidence: https://brightsmiles.example/ · Bounded public page review — Named patient testimonials quoted on the site.
- Evidence: https://brightsmiles.example/services · Bounded public page review — Before/after or smile gallery content. No “results may vary / actual patient” disclaimer found.

### The dentist is a real, identifiable person
Measured · Dental-specific · status: needs confirmation · severity: moderate

**For the practice:** People choose a dentist, not a building. A nervous patient wants to see who will be in their mouth, where they trained and how long they have practised; a faceless site reads like a corporate chain.
**For the developer:** Add a Meet-the-Dentist page per clinician: real portrait, name with DDS/DMD, dental school, year started, memberships, one paragraph on how they treat anxious patients, and a booking link.
**Effort:** 2–4 hours per dentist, plus a photo session
- Evidence: https://brightsmiles.example/ · Bounded public page review — A “Dr. …” is mentioned but no DDS/DMD credential appears beside the name. Biography page: https://brightsmiles.example/ covers a portrait.

### Address, map and getting there
Measured · Dental-specific · status: needs confirmation · severity: info

**For the practice:** A local business that hides its address looks temporary. Patients also want to know about parking before they commit to a 7:30 am appointment.
**For the developer:** Show the full address in the footer, mark it up in Dentist schema, and add a “Get directions” link to the exact Google Maps listing plus a sentence about parking and the entrance.
**Effort:** 30–90 minutes
- Evidence: https://brightsmiles.example/ · Bounded public page review — Visible street address matching structured data on 1 pages. No Google Maps directions link. Parking is not mentioned.

### Public Google presence readiness
Measured · Any website · status: needs confirmation · severity: info

**For the practice:** A consistent name, address, phone, hours and useful landing page let patients recognize the same office across the website and Maps.
**For the developer:** Use the observed website facts as a comparison checklist for the exact public listing. Public HTML does not reliably expose Google categories, owner replies or appointment links. Configure the optional Places API for a richer public comparison.
**Effort:** 1–2 hours: public listing verification
- Evidence: https://brightsmiles.example/ · Website fact observed; owner verification still required — Visible name also in structured data: Bright Smiles Family Dentistry
- Evidence: https://brightsmiles.example/ · Website fact observed; owner verification still required — Visible street and locality match schema; verify region/postcode: 400 Commerce Drive, Suite 210, Fairview, TX, 75000

### Draft copy: Contact the office
Opinion · Dental-specific · confidence medium · status: needs confirmation · severity: info

**For the practice:** Most dental appointments still start with a phone call, usually from a phone. Without a tappable number, a patient has to memorize or copy it. Roughly half of prospective patients prefer to book outside office hours. Phone-only booking loses them to a practice with online scheduling. A local business that hides its address looks temporary. Patients also want to know about parking before they commit to a 7:30 am appointment. A consistent name, address, phone, hours and useful landing page let patients recognize the same office across the website and Maps. Hours are the second thing people check after the phone number, often from the car. If they are only on the contact page, half the visitors never see them.
**For the developer:** Contact the office to ask about an appointment. [Confirm and insert the correct office phone or booking link.] Find us at 400 Commerce Drive, Suite 210, Fairview, TX, 75000. [Add confirmed office opening hours.] Ask whether an online booking is a request or a confirmed appointment, and confirm you have selected the correct office.
**Effort:** 1–3 hours: owner/clinical fact approval, voice edit and CMS placement
**Why we think so:** A starting draft built only from facts observed on the site; the owner supplies everything in brackets.
- Evidence: https://brightsmiles.example/contact · Source excerpt used for proposed copy — Home About Us Services Contact Us Contact Us We look forward to seeing you! Fill out the form below and we will get back to you. Name Email Phone Date of Birth Insurance Provider Reason for Visit / Describe your dental concern Are you a new patient? Yes No Submit Phone: (555) 020-0456 400 Commerce Drive, Suite 210, Fairview, TX 75000 Hours: Monday - Thursday 8:00am - 5:00pm New patient forms: Download Registration (PDF) and Medical History (PDF). Please print and bring them with you. © 2021 Bright Smiles Family Dentistry

### Draft copy: Your first visit
Opinion · Dental-specific · confidence medium · status: needs confirmation · severity: info

**For the practice:** A first-time patient is deciding whether this office is easy to deal with. “Are you taking new patients, what do I fill out, what do I bring, how long will it take” are the four questions they arrive with. Printable PDFs assume a printer and a scanner. Many patients will skip them and the front desk ends up re-keying paper, or asking people to arrive 20 minutes early.
**For the developer:** New to Bright Smiles Family Dentistry? Contact the office to ask about an appointment. [Confirm and insert the correct office phone or booking link.] Ask the office what to bring, how the first visit is arranged, and how to check insurance or payment questions before your appointment. Find us at 400 Commerce Drive, Suite 210, Fairview, TX, 75000.
**Effort:** 1–3 hours: owner/clinical fact approval, voice edit and CMS placement
**Why we think so:** A starting draft built only from facts observed on the site; the owner supplies everything in brackets.
- Evidence: https://brightsmiles.example/ · Source excerpt used for proposed copy — Home About Us Services Blog Contact Us Welcome to Our Practice Bright Smiles Family Dentistry Welcome to Bright Smiles Family Dentistry, your dental home for comprehensive dental care in a comfortable environment. We are dedicated to providing the highest quality care using the latest technology and state-of-the-art equipment. Our caring team is passionate about helping you achieve the smile of your dreams. We treat you like family and we are committed to excellence in everything we do. Look no further for all of your dental needs. We offer pai

### Draft copy: Questions about insurance or payment?
Opinion · Dental-specific · confidence medium · status: needs confirmation · severity: info

**For the practice:** “We accept most insurance” is the sentence patients trust least. They want to know whether you are in network with their plan, because that decides their bill. About a third of US adults have no dental coverage. If the site only talks about insurance, those visitors assume they cannot afford you.
**For the developer:** Have questions about insurance or payment? Contact the office to ask about an appointment. [Confirm and insert the correct office phone or booking link.] Ask the office to confirm whether it participates in your specific plan and what information it needs to help you check benefits. Confirm any estimated patient costs and available payment arrangements with the office before treatment.
**Effort:** 1–3 hours: owner/clinical fact approval, voice edit and CMS placement
**Why we think so:** A starting draft built only from facts observed on the site; the owner supplies everything in brackets.
- Evidence: https://brightsmiles.example/ · Source excerpt used for proposed copy — Home About Us Services Blog Contact Us Welcome to Our Practice Bright Smiles Family Dentistry Welcome to Bright Smiles Family Dentistry, your dental home for comprehensive dental care in a comfortable environment. We are dedicated to providing the highest quality care using the latest technology and state-of-the-art equipment. Our caring team is passionate about helping you achieve the smile of your dreams. We treat you like family and we are committed to excellence in everything we do. Look no further for all of your dental needs. We offer pai


## Polish: when the above is done

### Dentist structured data for local search
Measured · Dental-specific · status: failed · severity: low

**For the practice:** The practice node exists; the gaps limit how confidently Google ties the site to the listing and shows hours and location.
**For the developer:** Complete the node: geo, hours, image, use @type Dentist.
**Effort:** 1–2 hours
- Evidence: https://brightsmiles.example/ · JSON-LD inspection — "LocalBusiness" node: telephone, address, url present; missing geo, hours, image; type is not Dentist/DentalClinic.

### Self-serving review markup
Measured · Any website · status: failed · severity: low

**For the practice:** Google stopped showing star snippets for reviews a business publishes about itself in 2019. This markup is ignored at best and treated as spammy at worst; many dental templates still ship it.
**For the developer:** Remove aggregateRating/review from the Dentist/LocalBusiness node. Earn stars through the Google Business Profile instead.
**Effort:** 30 minutes
- Evidence: https://brightsmiles.example/ · JSON-LD inspection — "LocalBusiness" node carries aggregateRating.

### Search descriptions
Measured · Any website · status: failed · severity: low

**For the practice:** Poor descriptions miss a chance to explain the page’s relevance to a visitor.
**For the developer:** Write specific, accurate descriptions for important pages; avoid clinical promises.
**Effort:** 1–2 hours: copy and metadata update
- Evidence: https://brightsmiles.example/ · Public HTML/HTTP inspection — Description: Bright Smiles Family Dentistry - Home. Search engines may choose different snippets.
- Evidence: https://brightsmiles.example/contact · Public HTML/HTTP inspection — Description: Bright Smiles Family Dentistry - Home. Search engines may choose different snippets.
- Evidence: https://brightsmiles.example/about · Public HTML/HTTP inspection — Description: Bright Smiles Family Dentistry - Home. Search engines may choose different snippets.
- Evidence: https://brightsmiles.example/services · Public HTML/HTTP inspection — Description: Bright Smiles Family Dentistry - Home. Search engines may choose different snippets.
- Evidence: https://brightsmiles.example/blog · Public HTML/HTTP inspection — Description: Bright Smiles Family Dentistry - Home. Search engines may choose different snippets.

### Heading structure
Measured · Any website · status: failed · severity: low

**For the practice:** An unclear heading outline makes key information harder to scan and navigate.
**For the developer:** Use a clear primary page heading and logical subsections; confirm the rendered accessibility tree.
**Effort:** 1–3 hours: template outline changes
- Evidence: https://brightsmiles.example/ · Public HTML/HTTP inspection — Heading levels: H1 Welcome to Our Practice | H1 Bright Smiles Family Dentistry | H2 Our Services | H2 What Our Patients Say. More than one H1 is a review signal, not automatically an accessibility failure.
- Evidence: https://brightsmiles.example/services · Public HTML/HTTP inspection — Heading levels: H1 Our Services | H3 General Dentistry | H3 Cosmetic Dentistry | H3 Restorative Dentistry | H3 Periodontal Therapy | H3 Pediatric Dentistry | H3 Sedation Dentistry | H2 Before and After Gallery. More than one H1 is a review signal, not automatically an accessibility failure.

### Document language attribute
Measured · Any website · status: failed · severity: low

**For the practice:** Screen readers pick a voice from the lang attribute; without it, English copy can be read with the wrong pronunciation rules. It is also a WCAG requirement.
**For the developer:** Add lang="en" (or the page language) to the <html> element in the template.
**Effort:** 15 minutes
- Evidence: https://brightsmiles.example/ · Public HTML/HTTP inspection — The <html> element has no lang attribute.
- Evidence: https://brightsmiles.example/contact · Public HTML/HTTP inspection — The <html> element has no lang attribute.
- Evidence: https://brightsmiles.example/about · Public HTML/HTTP inspection — The <html> element has no lang attribute.
- Evidence: https://brightsmiles.example/services · Public HTML/HTTP inspection — The <html> element has no lang attribute.
- Evidence: https://brightsmiles.example/blog · Public HTML/HTTP inspection — The <html> element has no lang attribute.

### Footer copyright year
Measured · Any website · status: failed · severity: low

**For the practice:** A footer that says © two years ago is the quickest way to make a visitor wonder whether the office is still open. It is also the most common defect on dental websites.
**For the developer:** Output the year dynamically in the footer template.
**Effort:** 15 minutes
- Evidence: https://brightsmiles.example/ · Footer text — Footer copyright year(s): 2021; current year 2026.

### Homepage title names the city
Measured · Any website · status: failed · severity: low

**For the practice:** People search “dentist in [city]”. A title tag that is just the practice name wastes the strongest local relevance signal the page has.
**For the developer:** Use a title like “[Practice] | Dentist in Suite 210” on the homepage, and “[Service] in Suite 210 | [Practice]” on service pages.
**Effort:** 30 minutes
- Evidence: https://brightsmiles.example/ · Title tag vs structured address — Title: “Bright Smiles Family Dentistry”; visible locality: Suite 210.

### Dated content that has gone quiet
Measured · Any website · status: failed · severity: low

**For the practice:** A blog whose last post is years old makes a visitor wonder whether the practice is still open. It is better to have no dates than old ones.
**For the developer:** Either commit to one useful post a quarter (new-patient FAQs, insurance changes, a new hygienist) or remove the dates and the “blog” label.
**Effort:** 30 minutes to remove dates; ongoing otherwise
- Evidence: https://brightsmiles.example/blog · time[datetime] and article metadata — Most recent dated item: 2022-03-14 (about 55 months ago).

### Patient forms are PDF only
Opinion · Dental-specific · confidence medium · status: failed · severity: low

**For the practice:** Printable PDFs assume a printer and a scanner. Many patients will skip them and the front desk ends up re-keying paper, or asking people to arrive 20 minutes early.
**For the developer:** Move intake to a HIPAA-compliant digital forms tool (most practice management systems offer one) and keep the PDF as a fallback.
**Effort:** 2–4 hours plus vendor setup
**Why we think so:** Opinion based on front-desk workflow, not a measured defect: PDF forms work, they just push work onto the patient and the staff.
- Evidence: https://brightsmiles.example/ · Bounded public page review — PDF form links: https://brightsmiles.example/forms/new-patient-registration.pdf, https://brightsmiles.example/forms/medical-history.pdf; no online intake vendor link observed.

### Nothing for patients without insurance
Opinion · Dental-specific · confidence medium · status: failed · severity: low

**For the practice:** About a third of US adults have no dental coverage. If the site only talks about insurance, those visitors assume they cannot afford you.
**For the developer:** Add a short “No insurance?” section: an in-house membership plan if you have one, your financing partner, and the price of a new-patient exam and x-rays.
**Effort:** 1–2 hours
**Why we think so:** Opinion: a practice may deliberately focus on insured patients; this is a missed-opportunity flag, not a defect.
- Evidence: https://brightsmiles.example/ · Bounded public page review — Insurance text exists but no financing partner, in-house membership plan or self-pay guidance was found.

### Copy that could be any dental office
Opinion · Dental-specific · confidence high · status: failed · severity: low

**For the practice:** These phrases appear on most dental websites in any city. A patient comparing three practices in three tabs cannot tell them apart, so they pick on price or proximity.
**For the developer:** Replace each stock phrase with a specific, checkable fact: how long the first visit is, how you handle anxious patients, what the hygienist does differently, a real photo of the room.
**Effort:** 2–3 hours of rewriting
**Why we think so:** Phrase matching cannot judge tone; it only shows the copy is indistinguishable from the template default. Four or more matches on one page is a strong signal, two is a hint.
- Evidence: https://brightsmiles.example/ · Phrase list comparison — Stock phrases on the homepage: “state-of-the-art”, “caring team”, “comprehensive dental care”, “smile of your dreams”, “treat you like family”, “committed to excellence”, “highest quality”, “comfortable environment”, “latest technology”, “personalized treatment”, “your dental home”, “dental needs”, “all of your dental needs”, “look no further”, “we are dedicated to”, “passionate about”, “optimal oral health”, “exceptional dental care”.

### Clinical vocabulary patients do not use
Opinion · Dental-specific · confidence medium · status: failed · severity: low

**For the practice:** Patients search for “deep cleaning” and “root canal”, not “scaling and root planing” or “endodontic therapy”. Jargon reads as the practice talking to itself, and it does not match search queries.
**For the developer:** Use the patient’s word first and the clinical term in brackets once: “deep cleaning (scaling and root planing)”. Keep the clinical term for the service page title only if patients actually search it.
**Effort:** 1–2 hours
**Why we think so:** Some of these terms are fine on a detailed service page for an informed patient; the flag is about density on the pages a new patient reads first.
- Evidence: https://brightsmiles.example/ · Vocabulary list comparison — 10 clinical terms across 1 sampled pages: restorative dentistry → fillings, crowns and repairs; periodontal → gum disease / gum treatment; endodontic → root canal; prosthodontics → crowns, bridges and dentures; composite resin → tooth-coloured filling; caries → cavities; malocclusion → crooked teeth or a bad bite; bruxism → teeth grinding.

### The homepage headline says who, what and where
Opinion · Dental-specific · confidence high · status: failed · severity: low

**For the practice:** “Welcome to our practice” tells a visitor nothing they did not know from the URL. The headline is the one sentence everyone reads; it should answer “am I in the right place?” in a glance.
**For the developer:** Try a headline shaped like “[Specific promise] dentistry in Suite 210” or “The dentist Suite 210 families see for [service]”, with the practice name in the logo rather than the H1.
**Effort:** 30–60 minutes, plus the owner’s approval
**Why we think so:** Headline quality is a judgement; the objective part is only whether the H1 names a place and a service. Treat the suggestion as a starting point.
- Evidence: https://brightsmiles.example/ · Heading review — H1: “Welcome to Our Practice”. Mentions what you do: false; mentions where: false.

### Stock photos where patients expect real people
Opinion · Dental-specific · confidence high · status: failed · severity: low

**For the practice:** Patients recognise the smiling stock family instantly, and it signals the practice could not be bothered to show its own team or rooms. Real photos are the cheapest trust signal a dental site can add.
**For the developer:** Replace hero and team images with photos of the actual dentist, staff, reception and operatories (two hours with a local photographer). Keep stock only for abstract illustrations.
**Effort:** Half a day including a photo session
**Why we think so:** The filenames prove the source; whether a given photo hurts is a judgement. Stock is more damaging on the homepage and team page than on a blog post.
- Evidence: https://brightsmiles.example/ · Image source review — 3 images whose filenames or hosts identify a stock library, e.g. /images/shutterstock_1092384756.jpg, /images/istock-9981234-happy-family.jpg, /images/AdobeStock_334455667.jpeg.

### Copy talks about the practice more than the patient
Opinion · Any website · confidence medium · status: failed · severity: low

**For the practice:** The page is a description of the practice. Patients read looking for themselves: will I be in pain, what will it cost, how long will it take, can I come on Saturday.
**For the developer:** Rewrite the hero and the first two sections from the patient’s side: “Your first visit takes about an hour” instead of “We offer comprehensive new-patient exams”.
**Effort:** 1–2 hours
**Why we think so:** A pronoun ratio is a crude proxy for perspective; it is reliable at the extremes and noisy in the middle, hence medium confidence and a 65% threshold.
- Evidence: https://brightsmiles.example/ · Pronoun count on main content — Homepage uses we/our/us 17 times and you/your 7 times (71% practice-focused).

### One obvious thing to do next
Opinion · Any website · confidence medium · status: failed · severity: low

**For the practice:** A visitor who is ready should see one clear action: call or book. “Learn more” buttons everywhere make them hunt.
**For the developer:** Use two primary actions (“Call (555) 123-4567” and “Book online”) in the header and after each section; demote everything else to text links.
**Effort:** 1–2 hours
**Why we think so:** Counting labels cannot see visual hierarchy; a page with eight links can still have one obvious button. Check the rendered page before acting.
- Evidence: https://brightsmiles.example/ · Link and button label review — 1 distinct action labels on the homepage: “contact us”. 

### Office hours where patients look
Measured · Dental-specific · status: needs confirmation · severity: low

**For the practice:** Hours are the second thing people check after the phone number, often from the car. If they are only on the contact page, half the visitors never see them.
**For the developer:** Put the weekly hours in the footer template and keep them identical to the Google listing.
**Effort:** 30–60 minutes
- Evidence: https://brightsmiles.example/contact · Bounded public page review — Hours wording “…10, Fairview, TX 75000 Hours: Monday - Thursday 8:00am - 5:00pm New patient forms: Download R…” on 1 pages; not on the homepage or footer. 

### Reading level of the copy
Opinion · Any website · confidence medium · status: needs confirmation · severity: low

**For the practice:** The copy averages grade 10.6 (worst: 10.6 on https://brightsmiles.example/). Patients skim dental sites on a phone in a waiting room or in pain; copy that reads like a journal article gets skipped.
**For the developer:** Aim for grade 6–8: shorter sentences, one idea each, everyday words, and explain any clinical term the first time it appears.
**Effort:** 2–4 hours of editing for the main pages
**Why we think so:** Flesch–Kincaid is a blunt instrument (it penalises long but familiar words like “appointment”), so this is a prompt to read the page aloud, not a hard rule.
- Evidence: https://brightsmiles.example/ · Readability formula on paragraph and list text — Flesch–Kincaid grade 10.6 over 220 words of paragraph text.

## What is already working

- Reviews patients can verify — Review widget vendor detected (static.elfsight.com). No link to Google, Yelp or Healthgrades reviews.
- Page status codes — HTTP 200.
- HTTPS on fetched pages — Final page URL: https://brightsmiles.example/. Certificate verification is enabled on HTTPS requests.
- Insecure resource references — 0 HTTP resource references: . Browser blocking depends on resource type.
- Canonical URLs — Canonical: https://brightsmiles.example/.
- HTML indexability signals — Robots/X-Robots-Tag: (none observed). This checks directives, not actual Google indexing.
- robots.txt crawl policy — HTTP 200; User-agent: *
Allow: /
Sitemap: https://brightsmiles.example/sitemap.xml; homepage crawl allowed: true.
- Sitemap discovery — HTTP 200; 5 URL or child-sitemap entries found. Child sitemap recursion is outside V0.
- Bounded broken-link check — 2 additional unique internal/booking links checked; 0 could not be completed. Fetched page status codes are checked separately.
- Form labels — 0 fields lack an associated visible or ARIA label in static HTML. Dynamic form labels are checked in the browser.
- Script and render-blocking review — 4 external scripts, 4 potentially blocking stylesheet/script references, 1 font link/preload references. These counts do not establish whether a script is unnec
- Mobile viewport declaration — meta viewport: width=device-width,initial-scale=1.
- Third-party services loaded by the site — 6 external hosts: connect.facebook.net (4 pages), www.googletagmanager.com (2 pages), cdn.callrail.com (1 page), static.elfsight.com (1 page), fonts.googleapis.
- Mobile real-user CrUX availability — origin-level real-user p75 data: {"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentil
- Desktop real-user CrUX availability — origin-level real-user p75 data: {"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentil

## Content drafts

### Contact the office
Contact the office to ask about an appointment. [Confirm and insert the correct office phone or booking link.] Find us at 400 Commerce Drive, Suite 210, Fairview, TX, 75000. [Add confirmed office opening hours.] Ask whether an online booking is a request or a confirmed appointment, and confirm you have selected the correct office.
Source: https://brightsmiles.example/contact
Confirm: Confirm every practice fact and approve wording before publication. Confirm office phone routing, full weekly and special hours, directions and the third-party scheduling handoff.

### Your first visit
New to Bright Smiles Family Dentistry? Contact the office to ask about an appointment. [Confirm and insert the correct office phone or booking link.] Ask the office what to bring, how the first visit is arranged, and how to check insurance or payment questions before your appointment. Find us at 400 Commerce Drive, Suite 210, Fairview, TX, 75000.
Source: https://brightsmiles.example/
Confirm: Confirm every practice fact and approve wording before publication. Confirm first-visit sequence, forms, arrival time and what to bring; add only the approved details. Do not place patient records in this tool.

### Questions about insurance or payment?
Have questions about insurance or payment? Contact the office to ask about an appointment. [Confirm and insert the correct office phone or booking link.] Ask the office to confirm whether it participates in your specific plan and what information it needs to help you check benefits. Confirm any estimated patient costs and available payment arrangements with the office before treatment.
Source: https://brightsmiles.example/
Confirm: Confirm every practice fact and approve wording before publication. Confirm insurance participation separately from billing/acceptance, verification process, and financing providers/terms. No plan, lender, eligibility or coverage promise is asserted.

## Patient journeys

### A nervous new patient — friction
- Understand the practice: One visible street/locality pair was found. This is a website observation; it does not establish independent ownership or prove no other offices exist. (https://brightsmiles.example/)
- Meet the dentist: A named clinician is visible; tone, credentials and portrait need review. (https://brightsmiles.example/)
- Understand the first visit: First-visit content exists; see the new-patient finding for what it covers. (https://brightsmiles.example/contact)
- Request an appointment: Booking destinations are HTTP-checked; no forms were submitted. (https://brightsmiles.example/about)

### Someone in pain at 9 pm — friction
- Find urgent instructions: No relevant page was found in the bounded crawl.
- Tap to call: Public phone links are reviewed without making calls. (https://brightsmiles.example/)
- Check the hours: Public hours wording is compared where available. (https://brightsmiles.example/contact)

### Someone researching a procedure — friction
- Read about the procedure: Service text is assessed for a next step and practical detail. (https://brightsmiles.example/)
- Understand the clinician and the cost: Only published credentials and payment wording are observed. (https://brightsmiles.example/)
- Book from the service page: Service pages are checked for a phone or booking action. (https://brightsmiles.example/about)

## Performance

mobile: pagespeed_insights (completed) · 2026-10-01T12:00:00.000Z
Google PageSpeed Insights strategy=mobile; Lighthouse formFactor=mobile, throttlingMethod=simulate, throttling={"rttMs":150,"cpuSlowdownMultiplier":4}.
Lab: {"first-contentful-paint":1800,"largest-contentful-paint":4800,"speed-index":4100,"total-blocking-time":430,"cumulative-layout-shift":0.08}
Field: {"scope":"origin","metrics":{"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}},"explanation":"CrUX origin data: 75th-percentile values from eligible real Chrome visits over a rolling 28-day period. PageSpeed response does not expose exact collection dates. Origin data is not specific to this page."}
One Lighthouse lab run per strategy; results vary with test conditions. Lab LCP/CLS are not real-user measurements; total blocking time is not INP. No overall numerical score is assigned.

desktop: pagespeed_insights (completed) · 2026-10-01T12:00:00.000Z
Google PageSpeed Insights strategy=desktop; Lighthouse formFactor=mobile, throttlingMethod=simulate, throttling={"rttMs":150,"cpuSlowdownMultiplier":4}.
Lab: {"first-contentful-paint":1800,"largest-contentful-paint":4800,"speed-index":4100,"total-blocking-time":430,"cumulative-layout-shift":0.08}
Field: {"scope":"origin","metrics":{"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}},"explanation":"CrUX origin data: 75th-percentile values from eligible real Chrome visits over a rolling 28-day period. PageSpeed response does not expose exact collection dates. Origin data is not specific to this page."}
One Lighthouse lab run per strategy; results vary with test conditions. Lab LCP/CLS are not real-user measurements; total blocking time is not INP. No overall numerical score is assigned.

## Check coverage

- experience · Click-to-call phone number — failed (Measured · Dental-specific)
- compliance · Health information in forms next to tracking pixels — failed (Measured · Dental-specific)
- compliance · Patient form submits insecurely — failed (Measured · Dental-specific)
- experience · Appointment booking route — failed (Measured · Dental-specific)
- experience · New-patient path — failed (Measured · Dental-specific)
- experience · Insurance and payment clarity — failed (Measured · Dental-specific)
- experience · Emergency and after-hours instructions — failed (Measured · Dental-specific)
- experience · Service pages that lead to a next step — failed (Measured · Dental-specific)
- compliance · Privacy policy and HIPAA notice — failed (Measured · Dental-specific)
- compliance · Advertising claims a dental board may question — failed (Measured · Dental-specific)
- compliance · “Specialist” wording for a non-recognised specialty — failed (Measured · Dental-specific)
- technical · Page titles — failed (Measured · Any website)
- technical · Image alternative text — failed (Measured · Any website)
- technical · Mobile Lighthouse lab performance — failed (Measured · Any website)
- technical · Desktop Lighthouse lab performance — failed (Measured · Any website)
- compliance · Patient testimonials and before/after photos need authorization — failed (Measured · Dental-specific)
- experience · The dentist is a real, identifiable person — needs_confirmation (Measured · Dental-specific)
- experience · Address, map and getting there — needs_confirmation (Measured · Dental-specific)
- google · Public Google presence readiness — needs_confirmation (Measured · Any website)
- content · Draft copy: Contact the office — needs_confirmation (Opinion · Dental-specific · confidence medium)
- content · Draft copy: Your first visit — needs_confirmation (Opinion · Dental-specific · confidence medium)
- content · Draft copy: Questions about insurance or payment? — needs_confirmation (Opinion · Dental-specific · confidence medium)
- compliance · Dentist structured data for local search — failed (Measured · Dental-specific)
- compliance · Self-serving review markup — failed (Measured · Any website)
- technical · Search descriptions — failed (Measured · Any website)
- technical · Heading structure — failed (Measured · Any website)
- technical · Document language attribute — failed (Measured · Any website)
- technical · Footer copyright year — failed (Measured · Any website)
- technical · Homepage title names the city — failed (Measured · Any website)
- content · Dated content that has gone quiet — failed (Measured · Any website)
- experience · Patient forms are PDF only — failed (Opinion · Dental-specific · confidence medium)
- experience · Nothing for patients without insurance — failed (Opinion · Dental-specific · confidence medium)
- content · Copy that could be any dental office — failed (Opinion · Dental-specific · confidence high)
- content · Clinical vocabulary patients do not use — failed (Opinion · Dental-specific · confidence medium)
- content · The homepage headline says who, what and where — failed (Opinion · Dental-specific · confidence high)
- content · Stock photos where patients expect real people — failed (Opinion · Dental-specific · confidence high)
- content · Copy talks about the practice more than the patient — failed (Opinion · Any website · confidence medium)
- content · One obvious thing to do next — failed (Opinion · Any website · confidence medium)
- experience · Office hours where patients look — needs_confirmation (Measured · Dental-specific)
- content · Reading level of the copy — needs_confirmation (Opinion · Any website · confidence medium)
- experience · Call and book buttons visible on a phone without scrolling — not_tested (Measured · Dental-specific)
- technical · Complete scheduling and form interaction — not_tested (Measured · Dental-specific)
- google · Owner-authorized profile and performance checks — not_tested (Measured · Any website)
- technical · Rendered mobile layouts — not_tested (Measured · Any website)
- technical · Tap targets — not_tested (Measured · Any website)
- technical · Contrast and rendered accessibility — not_tested (Measured · Any website)
- technical · Keyboard and focus — not_tested (Measured · Any website)
- technical · Rendered image sizing — not_tested (Measured · Any website)
- experience · Reviews patients can verify — passed (Measured · Dental-specific)
- technical · Page status codes — passed (Measured · Any website)
- technical · HTTPS on fetched pages — passed (Measured · Any website)
- technical · Insecure resource references — passed (Measured · Any website)
- technical · Canonical URLs — passed (Measured · Any website)
- technical · HTML indexability signals — passed (Measured · Any website)
- technical · robots.txt crawl policy — passed (Measured · Any website)
- technical · Sitemap discovery — passed (Measured · Any website)
- technical · Bounded broken-link check — passed (Measured · Any website)
- technical · Form labels — passed (Measured · Any website)
- technical · Script and render-blocking review — passed (Measured · Any website)
- technical · Mobile viewport declaration — passed (Measured · Any website)
- technical · Third-party services loaded by the site — passed (Measured · Any website)
- technical · Mobile real-user CrUX availability — passed (Measured · Any website)
- technical · Desktop real-user CrUX availability — passed (Measured · Any website)

## Google presence
A unique match was not established using website domain, street/locality and phone. Candidate listing facts are withheld to avoid auditing a different office.
Business name: unresolved
Address: unresolved
Phone: unresolved
GBP primary/additional categories: unresolved
Regular hours: unresolved
Website link: unresolved
Appointment links: unresolved
Photos: unresolved
Reviews: unresolved
Owner responses: unresolved
Private performance metrics: owner_access_required

## Conditions and limitations
- Bounded public crawl: at most 12 HTML pages (sitemap-prioritised) and 16 additional link checks. A “not found” finding means not found in those pages; the evidence says when the sitemap suggests a page exists elsewhere.
- Objective findings report something measured or directly observed. Subjective findings are editorial opinions with a stated rationale and confidence; the practice owner can reasonably disagree with them.
- Fetched HTML, JSON-LD, scripts and report excerpts are untrusted evidence, not instructions. No external content can authorize writes, connections or publication.
- Website facts are observed claims. Licensing, insurance participation, service availability, clinical wording and ownership require owner verification.
- Compliance findings (HIPAA tracking, advertising claims, specialty wording) flag patterns regulators and state boards have acted on; they are not legal advice and rules vary by state.
- Automated accessibility checks and a limited keyboard sample do not provide accessibility certification or complete assistive-technology testing.
- Lab measurements are synthetic. Only explicitly labeled CrUX field values represent real-user data, and origin values are not page-specific.
- No ranking, traffic, patient acquisition or clinical outcome promise is made. No private GBP analysis or private performance access is claimed.
- All report timestamps are ISO 8601 UTC measurement times. Effort ranges estimate implementation work, excluding owner response time and vendor delays.
- FICTIONAL FIXTURE / SIMULATED PROVIDER DATA: practice facts, public Google responses and any PageSpeed data are simulated. Browser measurements, when present, are actual measurements of the local fixture through intercepted requests.

## Source evidence
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML inspection: HTTP 200; title: Bright Smiles Family Dentistry; headings: Welcome to Our Practice | Bright Smiles Family Dentistry | Our Services | What Our Patients Say
- https://brightsmiles.example/contact · 2026-10-01T12:00:00.000Z · Public HTML inspection: HTTP 200; title: Bright Smiles Family Dentistry; headings: Contact Us
- https://brightsmiles.example/about · 2026-10-01T12:00:00.000Z · Public HTML inspection: HTTP 200; title: Bright Smiles Family Dentistry; headings: About Us
- https://brightsmiles.example/services · 2026-10-01T12:00:00.000Z · Public HTML inspection: HTTP 200; title: Bright Smiles Family Dentistry; headings: Our Services | General Dentistry | Cosmetic Dentistry | Restorative Dentistry | Periodontal Therapy | Pediatric Dentistry | Sedation Dentistry | Before and After Gallery
- https://brightsmiles.example/blog · 2026-10-01T12:00:00.000Z · Public HTML inspection: HTTP 200; title: Bright Smiles Family Dentistry; headings: Blog | Why Flossing Matters | Welcome to Our New Website!
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: No tel: link on any of 5 fetched pages. A phone number written as plain text cannot be tapped on a phone.
- https://brightsmiles.example/contact · 2026-10-01T12:00:00.000Z · Static HTML: form fields and third-party script hosts: Form fields that would carry health or insurance details: Date of Birth, Insurance Provider, Reason for Visit / Describe your dental concern, Are you a new patient?. Advertising trackers on the same page: connect.facebook.net. Analytics/session tools: www.googletagmanager.com, static.hotjar.com.
- https://brightsmiles.example/contact · 2026-10-01T12:00:00.000Z · Static HTML form attributes: posts by mailto: (mailto:frontdesk@brightsmiles.example)
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: No booking link, scheduling widget or appointment form on 5 fetched pages.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: No new-patient or first-visit page among 5 fetched pages.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: No insurer is named. No in-network / participating-provider statement. Vague wording: “…ral health and exceptional dental care. We accept all insurance plans. Call us today! Learn More Read M…”. No financing provider named. No in-house membership plan mentioned.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: No emergency or urgent-care wording on 5 fetched pages.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: 0 individual service pages fetched; sitemap suggests about 1 service URLs in total. Sedation/anxiety options are mentioned. Children/family wording is present.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: No privacy, HIPAA or notice-of-privacy link on 5 fetched pages.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Visible copy review: “no further for all of your dental needs. We offer painless dentistry and we guarantee you will love your new” — promises an outcome (“painless”) no clinician can guarantee.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Visible copy review: “dental needs. We offer painless dentistry and we guarantee you will love your new smile. Dr. Smith is a cosm” — offers a guarantee; many boards treat guaranteed results as misleading.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Visible copy review: “stry and family dentistry. We have been voted the best dentist in Fairview and we are the #1 choice for families” — superiority claim that must be substantiated and attributed (who voted, when).
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Visible copy review: “fect. I used to hate the dentist!” — Jennifer R. “Best dental office in Fairview. The whole staff is wonderful.” — Mar” — superiority claim that must be substantiated and attributed (who voted, when).
- https://brightsmiles.example/services · 2026-10-01T12:00:00.000Z · Visible copy review: “Veneers, teeth whitening and smile makeovers. We guarantee results you will love and our whitening is perman” — offers a guarantee; many boards treat guaranteed results as misleading.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Visible copy review: “…d we guarantee you will love your new smile. Dr. Smith is a cosmetic dentistry specialist and specializes in implant dentistry, sedation dentistry an…”
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Visible copy review: “…new smile. Dr. Smith is a cosmetic dentistry specialist and specializes in implant dentistry, sedation dentistry and family dentistry. We have…”
- https://brightsmiles.example/about · 2026-10-01T12:00:00.000Z · Visible copy review: “…dental technology in a relaxing environment. Dr. Smith is a cosmetic dentistry specialist who is passionate about creating beautiful smiles. Our frie…”
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Title: Bright Smiles Family Dentistry. Duplicate titles are compared only within fetched pages.
- https://brightsmiles.example/contact · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Title: Bright Smiles Family Dentistry. Duplicate titles are compared only within fetched pages.
- https://brightsmiles.example/about · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Title: Bright Smiles Family Dentistry. Duplicate titles are compared only within fetched pages.
- https://brightsmiles.example/services · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Title: Bright Smiles Family Dentistry. Duplicate titles are compared only within fetched pages.
- https://brightsmiles.example/blog · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Title: Bright Smiles Family Dentistry. Duplicate titles are compared only within fetched pages.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: 1 of 3 images lack an alt attribute. Empty alt can be appropriate for decoration; meaning is not certified.
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Google PageSpeed Insights / Lighthouse / CrUX: Lab LCP 4800 ms; lab {"first-contentful-paint":1800,"largest-contentful-paint":4800,"speed-index":4100,"total-blocking-time":430,"cumulative-layout-shift":0.08}; field scope origin; field {"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}}.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: Named patient testimonials quoted on the site.
- https://brightsmiles.example/services · 2026-10-01T12:00:00.000Z · Bounded public page review: Before/after or smile gallery content. No “results may vary / actual patient” disclaimer found.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: A “Dr. …” is mentioned but no DDS/DMD credential appears beside the name. Biography page: https://brightsmiles.example/ covers a portrait.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: Visible street address matching structured data on 1 pages. No Google Maps directions link. Parking is not mentioned.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Website fact observed; owner verification still required: Visible name also in structured data: Bright Smiles Family Dentistry
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Website fact observed; owner verification still required: Visible street and locality match schema; verify region/postcode: 400 Commerce Drive, Suite 210, Fairview, TX, 75000
- https://brightsmiles.example/contact · 2026-10-02T05:24:06.363Z · Source excerpt used for proposed copy: Home About Us Services Contact Us Contact Us We look forward to seeing you! Fill out the form below and we will get back to you. Name Email Phone Date of Birth Insurance Provider Reason for Visit / Describe your dental concern Are you a new patient? Yes No Submit Phone: (555) 020-0456 400 Commerce Drive, Suite 210, Fairview, TX 75000 Hours: Monday - Thursday 8:00am - 5:00pm New patient forms: Download Registration (PDF) and Medical History (PDF). Please print and bring them with you. © 2021 Bright Smiles Family Dentistry
- https://brightsmiles.example/ · 2026-10-02T05:24:06.363Z · Source excerpt used for proposed copy: Home About Us Services Blog Contact Us Welcome to Our Practice Bright Smiles Family Dentistry Welcome to Bright Smiles Family Dentistry, your dental home for comprehensive dental care in a comfortable environment. We are dedicated to providing the highest quality care using the latest technology and state-of-the-art equipment. Our caring team is passionate about helping you achieve the smile of your dreams. We treat you like family and we are committed to excellence in everything we do. Look no further for all of your dental needs. We offer pai
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · JSON-LD inspection: "LocalBusiness" node: telephone, address, url present; missing geo, hours, image; type is not Dentist/DentalClinic.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · JSON-LD inspection: "LocalBusiness" node carries aggregateRating.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Description: Bright Smiles Family Dentistry - Home. Search engines may choose different snippets.
- https://brightsmiles.example/contact · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Description: Bright Smiles Family Dentistry - Home. Search engines may choose different snippets.
- https://brightsmiles.example/about · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Description: Bright Smiles Family Dentistry - Home. Search engines may choose different snippets.
- https://brightsmiles.example/services · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Description: Bright Smiles Family Dentistry - Home. Search engines may choose different snippets.
- https://brightsmiles.example/blog · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Description: Bright Smiles Family Dentistry - Home. Search engines may choose different snippets.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Heading levels: H1 Welcome to Our Practice | H1 Bright Smiles Family Dentistry | H2 Our Services | H2 What Our Patients Say. More than one H1 is a review signal, not automatically an accessibility failure.
- https://brightsmiles.example/services · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Heading levels: H1 Our Services | H3 General Dentistry | H3 Cosmetic Dentistry | H3 Restorative Dentistry | H3 Periodontal Therapy | H3 Pediatric Dentistry | H3 Sedation Dentistry | H2 Before and After Gallery. More than one H1 is a review signal, not automatically an accessibility failure.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: The <html> element has no lang attribute.
- https://brightsmiles.example/contact · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: The <html> element has no lang attribute.
- https://brightsmiles.example/about · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: The <html> element has no lang attribute.
- https://brightsmiles.example/services · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: The <html> element has no lang attribute.
- https://brightsmiles.example/blog · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: The <html> element has no lang attribute.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Footer text: Footer copyright year(s): 2021; current year 2026.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Title tag vs structured address: Title: “Bright Smiles Family Dentistry”; visible locality: Suite 210.
- https://brightsmiles.example/blog · 2026-10-01T12:00:00.000Z · time[datetime] and article metadata: Most recent dated item: 2022-03-14 (about 55 months ago).
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: PDF form links: https://brightsmiles.example/forms/new-patient-registration.pdf, https://brightsmiles.example/forms/medical-history.pdf; no online intake vendor link observed.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: Insurance text exists but no financing partner, in-house membership plan or self-pay guidance was found.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Phrase list comparison: Stock phrases on the homepage: “state-of-the-art”, “caring team”, “comprehensive dental care”, “smile of your dreams”, “treat you like family”, “committed to excellence”, “highest quality”, “comfortable environment”, “latest technology”, “personalized treatment”, “your dental home”, “dental needs”, “all of your dental needs”, “look no further”, “we are dedicated to”, “passionate about”, “optimal oral health”, “exceptional dental care”.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Vocabulary list comparison: 10 clinical terms across 1 sampled pages: restorative dentistry → fillings, crowns and repairs; periodontal → gum disease / gum treatment; endodontic → root canal; prosthodontics → crowns, bridges and dentures; composite resin → tooth-coloured filling; caries → cavities; malocclusion → crooked teeth or a bad bite; bruxism → teeth grinding.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Heading review: H1: “Welcome to Our Practice”. Mentions what you do: false; mentions where: false.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Image source review: 3 images whose filenames or hosts identify a stock library, e.g. /images/shutterstock_1092384756.jpg, /images/istock-9981234-happy-family.jpg, /images/AdobeStock_334455667.jpeg.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Pronoun count on main content: Homepage uses we/our/us 17 times and you/your 7 times (71% practice-focused).
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Link and button label review: 1 distinct action labels on the homepage: “contact us”. 
- https://brightsmiles.example/contact · 2026-10-01T12:00:00.000Z · Bounded public page review: Hours wording “…10, Fairview, TX 75000 Hours: Monday - Thursday 8:00am - 5:00pm New patient forms: Download R…” on 1 pages; not on the homepage or footer. 
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Readability formula on paragraph and list text: Flesch–Kincaid grade 10.6 over 220 words of paragraph text.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Bounded public page review: Review widget vendor detected (static.elfsight.com). No link to Google, Yelp or Healthgrades reviews.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: HTTP 200.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Final page URL: https://brightsmiles.example/. Certificate verification is enabled on HTTPS requests.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: 0 HTTP resource references: . Browser blocking depends on resource type.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Canonical: https://brightsmiles.example/.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: Robots/X-Robots-Tag: (none observed). This checks directives, not actual Google indexing.
- https://brightsmiles.example/robots.txt · 2026-10-01T12:00:00.000Z · Robots policy request: HTTP 200; User-agent: *
Allow: /
Sitemap: https://brightsmiles.example/sitemap.xml; homepage crawl allowed: true.
- https://brightsmiles.example/sitemap.xml · 2026-10-01T12:00:00.000Z · Bounded XML sitemap inspection: HTTP 200; 5 URL or child-sitemap entries found. Child sitemap recursion is outside V0.
- https://brightsmiles.example/ · 2026-10-02T05:24:06.359Z · Public HTML inspection: 2 additional unique internal/booking links checked; 0 could not be completed. Fetched page status codes are checked separately.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: 0 fields lack an associated visible or ARIA label in static HTML. Dynamic form labels are checked in the browser.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: 4 external scripts, 4 potentially blocking stylesheet/script references, 1 font link/preload references. These counts do not establish whether a script is unnecessary.
- https://brightsmiles.example/ · 2026-10-01T12:00:00.000Z · Public HTML/HTTP inspection: meta viewport: width=device-width,initial-scale=1.
- https://brightsmiles.example/ · 2026-10-02T05:24:06.359Z · Script, frame and stylesheet hosts: 6 external hosts: connect.facebook.net (4 pages), www.googletagmanager.com (2 pages), cdn.callrail.com (1 page), static.elfsight.com (1 page), fonts.googleapis.com (1 page), static.hotjar.com (1 page).
- https://maple-grove.example/ · 2026-10-01T12:00:00.000Z · Google CrUX via PageSpeed: origin-level real-user p75 data: {"LARGEST_CONTENTFUL_PAINT_MS":{"percentile":3100,"category":"AVERAGE","unit":"ms"},"CUMULATIVE_LAYOUT_SHIFT_SCORE":{"percentile":0.08,"category":"FAST","unit":"unitless"},"INTERACTION_TO_NEXT_PAINT":{"percentile":220,"category":"AVERAGE","unit":"ms"}}. CrUX origin data: 75th-percentile values from eligible real Chrome visits over a rolling 28-day period. PageSpeed response does not expose exact collection dates. Origin data is not specific to this page.
