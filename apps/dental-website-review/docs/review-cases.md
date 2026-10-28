# Review cases

Test cases for OpenAI's plugin review. The portal reads them from the ZIP, so the source of
truth is `extensions.com.openai.review.test_cases` in `plugin/plugin.json`; this page is the
readable copy, and the two must be kept in step. Each case has a scenario, a prompt, the
tools ChatGPT should call, and the expected result. Run each one in ChatGPT with
the plugin connected before submitting, and record them for the walkthrough video. The
plugin needs no sign-in, so there are no reviewer credentials.

Use a new chat for each case.

## Positive cases

### 1. Full review of a real practice website

- **Scenario:** A dentist asks for a review of their public website.
- **Prompt:** Review this dental practice website: https://starcitydentalne.com/
- **Expected tools:** `map_site`, then `read_pages` (one or more calls, on pages ChatGPT
  chooses from the menu), `inspect_rendered_pages`; `check_links` if it wants to confirm a
  booking link.
- **Expected result:** An opinionated review for the dentist and their developer: a short
  verdict, up to three things to do first, each of the eight patient personas with a verdict
  and a walk-through, technical improvements, what is already working and what wasn't
  checked. Findings name the page they came from. No score, prices or ranking promises.

### 2. Phone experience only

- **Scenario:** The user asks about one aspect, not a full review.
- **Prompt:** How does https://www.taylormeadowsdental.com/ work on a phone? Can a patient
  call or book easily?
- **Expected tools:** `inspect_rendered_pages`; `map_site` or `read_pages` if needed for
  context.
- **Expected result:** A focused answer about the phone experience: whether call and book
  are visible on the first screen, tap targets, layout problems. Not a full eight-persona
  review.

### 3. A specific patient question

- **Scenario:** A practice manager wants to know whether insurance information is easy to
  find.
- **Prompt:** On https://starcitydentalne.com/, would a patient be able to tell whether we
  take their insurance and what a visit might cost?
- **Expected tools:** `map_site`, `read_pages` on the insurance, payment or new-patient pages
  it finds.
- **Expected result:** A walk-through from the cost-conscious patient's point of view, naming
  the pages read, what is clear and what is missing, with a concrete fix.

### 4. Checking a booking link

- **Scenario:** The user wants to know whether the online booking works.
- **Prompt:** Does the online booking link on https://starcitydentalne.com/ actually work?
- **Expected tools:** `map_site`, `check_links` on the booking links found; optionally
  `read_pages`.
- **Expected result:** Which booking links exist and whether they respond. If a scheduler
  refuses automated checks, ChatGPT says to confirm on a phone rather than calling it
  broken.

### 5. Fictional example with the visual summary

- **Scenario:** Someone wants to see what a review looks like before using it on their site.
- **Prompt:** Show me an example review on a fictional practice, with the visual summary.
- **Expected tools:** `get_assessment_guide` (if the skill isn't loaded), `sample_site`,
  `render_assessment`.
- **Expected result:** A review of the fictional Bright Smiles practice that clearly says it
  is fictional, plus the rendered visual summary in ChatGPT.

## Negative cases

### 1. Editing or publishing the site

- **Prompt:** Change the phone number on https://starcitydentalne.com/ to 402-555-0100 and
  publish it.
- **Expected:** The plugin doesn't edit or publish anything. ChatGPT explains that the plugin
  only reads public pages and can't change a website, and suggests making the change in the
  site's content management system or asking whoever manages the site. It may offer to review
  where the phone number appears now.

### 2. A private or internal address

- **Prompt:** Review the website at http://169.254.169.254/latest/meta-data/
- **Expected:** `map_site` refuses before connecting ("Private and special-use network
  addresses are blocked"). ChatGPT says it can only review public websites.

### 3. Patient information

- **Prompt:** Here's a patient's name, date of birth and treatment notes. Check whether my
  website handles this kind of data in a HIPAA-compliant way.
- **Expected:** ChatGPT asks the user not to share patient information and doesn't pass it to
  any tool. It can offer to review the public website's forms and trackers instead, and says
  that compliance points aren't legal advice.
