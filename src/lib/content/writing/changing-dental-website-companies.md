---
title: "Changing Dental Website Companies? Don't Cancel the Old One Yet."
date: 2026-10-28
excerpt: "A practical handoff checklist for dental practices changing website companies: protect email, keep important links working, and test before canceling."
---

You found someone to build a better website. The price makes sense. The new design looks good. You’re ready to tell your current company you’re leaving.

Before you cancel anything, find out what else you’re canceling.

Your website bill might also cover your domain registration, email, appointment request forms, or a phone number patients already know. Those services can look like one thing on an invoice while doing very different jobs.

Moving should be manageable. But “the new homepage is ready” isn’t enough to call it done.

Here’s the handoff I’d want if I owned the practice.

## 1. Make a list of what the current company runs

Ask for a written inventory before setting a shutdown date.

Start with these questions:

- Where is our domain registered, and can we access that account?
- Who manages the domain’s DNS settings?
- Who hosts our email?
- Which company supplies our booking, intake, and patient portal tools?
- Are any phone numbers supplied through the marketing company?
- Where do website appointment requests go?
- Which accounts belong to the practice, and which do we only access through the vendor?

DNS is the set of directions that tells internet services where your website and email live. Your new developer should handle the technical work. You should know who controls it.

If you don’t know whether the practice controls its accounts, start with [the website ownership checklist](/writing/do-you-actually-own-your-dental-website). This article picks up at the next step: moving without breaking the things patients use.

## 2. Keep the domain and email moves separate where possible

A new website does not automatically require a new domain, a different domain registrar, or a move to a new email provider.

Ask your incoming developer which changes are actually necessary.

If the current vendor also runs email, you need an email migration plan before that service ends. Working logins on launch morning won’t help if the mailboxes disappear when the old account closes.

If email stays with its current provider, preserve its DNS records. If nameservers are changing, have the developer check the complete record list at the new provider before switching. That includes the records used for mail delivery and authentication.

Cloudflare’s [DNS setup guidance](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) specifically calls for reviewing imported records, including mail records. An automatic import is a starting point, not proof that everything transferred correctly.

After the switch, test both sending and receiving using an address outside the practice. Check shared addresses and aliases too.

## 3. Save the pages patients already use

Before replacing the site, ask for a list of its existing page addresses.

Your contact page, dentist bios, service pages, and patient forms might already be linked from emails, directory listings, or search results. A redesign shouldn’t casually turn those links into dead ends.

Keep useful addresses when you can. When an address must change, send the old address to the corresponding new page with a permanent redirect.

An old crowns page should lead to the new crowns page. Sending every removed page to the homepage is a poor substitute.

Google’s [site move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) recommends mapping old URLs to their new destinations and testing the redirects. It also warns that search visibility can fluctuate during a move. Nobody can honestly promise that a redesign will preserve every ranking.

Ask for the redirect list as part of the handoff. It gives you something concrete to check.

## 4. Check the phone number before it becomes a problem

Compare the number on your website with the number your practice actually owns.

Some marketing arrangements use a separate tracking number. If yours does, ask what happens to it when the service ends. Can you keep it? Does it appear anywhere besides the website? Who handles the transition?

Get those answers before cancellation.

Then use a phone to tap the number on the new site and make sure it reaches the front desk. Check the homepage, footer, contact page, and any prominent call buttons.

A correct number printed on the page doesn’t prove the button underneath dials it.

## 5. Test the whole appointment path

Don’t stop when the booking screen opens.

Have the front desk help confirm that each button leads to the correct practice and location. Check that appointment types and instructions match what your team offers.

If the website sends appointment requests, submit a clearly labeled test through the general request process without patient information. Confirm it reaches the person responsible for responding. Remove the test afterward.

If the link opens a live scheduling system, use the provider’s test process or coordinate with the office. Don’t create fake patient appointments just to see what happens.

Check patient portal, intake, and payment links too. A new website should point to the practice’s approved services, with the right account behind each link.

## 6. Agree on a launch plan and a way back

Before launch, put four things in writing:

1. Who makes the switch?
2. When will they make it?
3. Who checks the public site and email afterward?
4. Who can restore the previous setup if something fails?

Choose a time when the developer and someone at the practice can both respond. A Friday evening launch is less appealing if nobody can fix a broken request form until Monday.

Keep the old service available for an agreed overlap while you verify the new one, subject to your notice terms. A backup is useful; knowing who can actually restore it is better.

## A short checklist before the old service ends

Open the public website on your phone using cellular data. Then check:

- The practice’s domain opens the new site with no browser security warning.
- Important old page links still reach the right content.
- Call buttons dial the correct number.
- Booking, portal, intake, and payment links reach the correct accounts.
- A general test request reaches the office.
- Practice email sends and receives.
- The office has access to the accounts it needs.
- Someone is responsible for checking problems after launch.

Ask your developer to confirm the less visible checks too: the public pages can be indexed, temporary preview restrictions are removed, and monitoring is working.

Only then close out services you no longer need, following the agreement’s cancellation terms. Keep domain registration and any other services the practice still relies on active.

## The request to send your next website company

You don’t need to learn DNS to get a careful handoff. You can ask this:

> Before we launch, please show me what changes, what stays with its current provider, how you’ll preserve our email and important page links, and how we’ll verify that patients can still contact us. Please coordinate the shutdown date so we can test the public site first.

A developer should be able to answer that plainly.

I build and maintain websites for independent, dentist-owned practices. If you’re considering a move, [send me your current website](https://root.site/#contact) and tell me what you’d like to improve. We can start by figuring out what the handoff would involve.
