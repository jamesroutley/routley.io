---
title: "A gratitude journal design"
date: 2020-02-12T09:22:53Z
---

I've been thinking about how I'd design a gratitude journal product. A gratitude
journal lets you keep a record of things you're grateful for. Proponents say
gratitude journaling offers a number of mental health benefits.

## Why build a product?

1. Habit building. One of the common issues with starting a gratitude journal is
   developing the habit of writing consistently. Products can help develop
   habits by reminding users to write. There's a dark side to habit building
   products, so we'd want to stay away from being too intrusive.
2. Encouraging best practice. For example, journaling too frequently can lead to
   writing for the sake of it, without properly thinking things through.
   Journaling too infrequently can mean you drop the habit. A product can nudge
   users to do things well.

## Minimum set of features

1. Prompt users to list things they're grateful for
2. Let users to write them down
3. Store this list

## Implementation

I think the simplest way to implement this (as a centralised product) is via
email. Let's look at each of the steps:

### Account setup and onboarding

1. Send an email to our email address. It'll see that we haven't received an
   email from you before, and send you an onboarding email
2. Reply choosing how frequently you'd like to be prompted to write a journal
   entry

### Journal entries

1. Every X days, you'll receive an email prompting you to write an entry
2. Write it by repling to the email

### Changing settings

1. Send an email asking to change settings? This might need to preformatted so
   we can parse the email automatically

### Closing your account / offboarding

1. Either: send an email asking to close your account. We'll stop sending
   reminder emails
2. Or: if you haven't replied to the last X emails, we'll stop sending
   reminders. You can resume reminders by emailing

## Analysis

Using email as the main interface means we don't need to worry about a few
things:

- Building a text editor
- Account manaagement
- Persistence - users can just look through their email history
- Web/mobile support

However, dealing with email is always annoying, because you don't control the
channel. You need to maintiain a good sending reputation, not get marked as spam
by any email providers etc.

## Conclusion

An email-based system seems like quite a good fit for this problem. Working
through this design has made me wonder if the 'products built on email' pattern
can be abstracted out, and we can build a more generic email workflow system.
I'll have a think about this and might write something up about it at some
point.
