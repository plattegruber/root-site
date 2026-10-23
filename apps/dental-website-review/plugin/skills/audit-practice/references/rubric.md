# root.site’s dental website rubric

This is root.site’s opinion of what matters, not an industry standard. Hold it with
conviction: the practice is paying attention because you take a position.

**The test for every page:** can a nervous person on a phone, possibly in pain, find what
they need and contact the practice in under a minute? A dental website exists to get the
right patient to call or book, and to reassure them before the first visit. Judge
everything by that, not by generic SEO or design taste.

## Priority

- **Fix first** — something blocks a patient or creates real exposure:
  - no way to act from the first screen at phone width: neither a tappable phone number
    (`tel:` link) nor a book or request button. If a book button is there but the phone
    number is not, that is **next**: worth fixing, not the headline;
  - booking is broken on the practice’s own site (a dead internal link, an error page, a
    request page with no working form), or the only way to reach the practice is by
    phone during office hours. An external scheduler that only failed an automated check
    is not confirmed broken; see the evidence guide;
  - advertising or retargeting tags (Meta Pixel, Google Ads, TikTok, LinkedIn, Pinterest,
    Snap) or session-replay tools (Hotjar, Clarity, FullStory) on a page where patients
    enter health or insurance details, describe a problem, or pick a reason for the visit
    such as “emergency”; or a form that sends by `mailto:`, submits with GET, or posts to
    `http:`;
  - emergency or same-day care is advertised but the site never says what to do now or
    after hours. Check that the site actually advertises it (a service list, a heading,
    “emergencies welcome”). If the site never mentions emergencies, missing guidance is
    **next**, not fix first.
- **Next** — a question every new patient has goes unanswered or is answered vaguely,
  including a working contact form that isn’t presented as the way to request a visit.
- **Polish** — refinements once the above are handled.

For privacy findings, explain the 2022 HHS tracking bulletin and the litigation since in
plain terms, say it is not legal advice, and recommend removing ad tags from form and
booking pages or using vendors that sign a BAA.

## The eight patient journeys

Judge each journey from the patient’s side. Give it a verdict: **works** (a patient gets
what they need without effort), **friction** (they get there, but have to dig, guess or
call), **blocked** (a patient on this journey would likely give up or go elsewhere), or
**not applicable** (the practice doesn’t serve this need; say so in one line).

Calibrate honestly. “Have to call to find out” is friction for a routine question but
**blocked** for someone choosing between practices tonight. For the in-pain journey: a
tappable phone number on the first phone screen with visible hours is **friction** even
with no emergency guidance. No call button on that screen, but a tappable number one
scroll or one menu tap away (or on the emergency page), is also **friction**. It is
**blocked** only when a patient can’t find a tappable number at all, or emergencies are
advertised with no instructions for what to do.
A journey that works for a phone call but nothing else is friction, not works. If every
journey gets the same verdict, look again: some are almost always stronger than others,
and the reader needs to know which.

A good site deserves to be called good. When the journeys mostly work, lead with that,
and say plainly that the remaining items are refinements. Fix first can be empty. Don’t
promote a polish item to the top of the report just so it has a headline.

Content that looks out of place is often explained by how the practice is run: a careers
page listing other towns usually means a parent group hiring across offices. Ask the
practice to confirm instead of calling it a mistake.

### 1. “I’m looking for a new dentist”

Are they accepting new patients? Where are they, and when are they open (the footer
counts; hours without am/pm are still hours)? Who is the dentist, and why this practice
over the one down the road? Can I see verifiable reviews (a link to the Google profile)?
What happens at the first visit, how long does it take, what should I bring, can I do the
forms online?

### 2. “I’m in pain and need help now”

Online booking is not what this patient needs; don’t count its absence against this
journey. A `tel:` link on the first phone screen. A plain statement of whether they see emergencies
or same-day patients. What to do after hours (answering service, on-call number, or “go to
the ER if…”). Which problems are urgent (a knocked-out tooth, swelling, bleeding).

### 3. “Will my insurance cover this? What will it cost?”

Named in-network plans, or exactly how to check. “We accept most insurance” on its own is
vague (judgement). What uninsured patients can do: membership plan, financing, typical price
ranges. An insurance coordinator named on the team page is a good sign; say so.

### 4. “I’m nervous about the dentist”

Concrete comfort measures (sedation or nitrous, breaks, explaining each step, headphones,
blankets), not just the word “gentle”. A dentist who comes across as a person: real photo,
name with DDS/DMD, a few human sentences. Photos of the actual office and team, not stock.
What the first visit involves. Promising “painless” dentistry is an advertising problem,
not reassurance.

### 5. “I’m ready to book”

A booking route from every page: real-time scheduling (a vendor like NexHealth or LocalMed)
or a request form that says when they’ll hear back. The form works on a phone (labels,
tap-sized controls) and asks only what it needs. Privacy on that form is part of this
journey: see the fix-first rules above.

### 6. “I’m researching a specific treatment”

For the treatments the practice wants more of (implants, aligners, crowns, whitening): who
it is for, what to expect, how cost is handled, and the next step. One list page is fine
for a small general practice. Flag claims in the practice’s own voice: “painless”,
“guaranteed”, “best” or “#1” without attribution, “specialist” outside the ADA-recognised
specialties. Patient reviews are the patient’s words, not the practice’s claims. Named
testimonials and before/after photos need written marketing authorization; remind, don’t
accuse.

### 7. “I’m finding a dentist for my kids or family”

Only if the practice markets family or children’s care. Which ages they see, what a
child’s first visit is like, whether family members can be booked together.

### 8. “I’m already a patient and need something quick”

Online forms, rescheduling, paying a bill, finding the phone number from a search result.
Mostly polish unless it is broken.

## Technical improvements

Report these separately from the journeys, ranked by how much they hurt a journey:
sideways scrolling or tiny tap targets on the main journeys; automated accessibility
violations (link names, contrast, form labels; not a certification); broken links; speed,
only when measured, preferring field data over lab data; `Dentist` structured data with
phone, address and hours; page titles that name the practice and town, and meta
descriptions; mixed content and HTTPS; a stale copyright year or an abandoned blog.

Technical findings are **next** or **polish** unless they break a journey or match a
fix-first rule above. An `http:` image on an HTTPS page is polish: browsers upgrade or
block it without a warning. An `http:` script, stylesheet or form action is more serious.

## Google Business Profile

For most patients the Google listing comes before the website. Assess what is public:

- **Is it the right listing?** Name, address, phone and hours match the website evidence.
  Any mismatch is a finding; say which source is likely wrong.
- **Primary category** is a dental one (Dentist, Cosmetic dentist, etc.), when visible.
- **Reviews:** rating, number of reviews, how recent, and whether the owner replies, as
  shown on Google itself. Never show a directory’s rating or review count (Yelp,
  Healthgrades, dental directories), even labelled as not Google’s; readers remember the
  number, not the label. A directory can still confirm or contradict the name, address and
  phone. If you couldn’t open the Google listing itself, set the status to not found or
  partial, say so in one sentence, and ask for the Google Maps link.
- **Website and booking links** point to the right pages.
- **Photos** show the real office and team.

Owner-only data (search and call insights, verification status, the full category list,
edit history) isn’t visible from outside. List it under what wasn’t checked. Never invent a
rating, review count or category; if the listing can’t be found, say so and ask for the
Google Maps link.

## Don’t report

Keyword density, word counts, page counts, “domain authority”, generic SEO checklists,
duplicate titles on a few minor pages, CMS duplicate URLs, design taste, or anything you
could not observe. Ignore template chrome the practice didn’t choose: a website builder’s
cart icon or “0” link to `/cart`, account or login links, and the builder’s own footer
credit. Never give a score or a count of problems.
