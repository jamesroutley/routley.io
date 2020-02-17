---
title: "Analytics server"
date: 2020-02-16T04:57:42Z
---

This website runs as a static site hosted on GitHub pages. I don't currently
have any way of telling how many people are reading it, or what pages they're
reading etc.

The simple way to get this data would be to add Google Analytics to the website.
However, I think it's an interesting exercise to work out how to implement
something similar ourselves. This would let us specify the amount of information
we'd like to log about each visitor and we'd also have control of the data
ourselves, rather than shipping it to a third party.

## Overview

On each visit to my blog, some JavaScript code would run, which would make an
HTTP request to a web server with some information about the page view.

The web server accepts requests, and stores the information in a database.

## What analytics do we care about?

We get a couple of data points from the HTTP request itself:

- The visitor's country (derived from the IP address)
- Timestamp

On top of this, we can send the following in the request body:

- URL of the visited page
- Referrer URL
- Screen width (so we can tell if the user is on web or mobile)

## User privacy

I'm interested in preserving the privacy of website visitors, so we:

- Won't store IP addresses
- Won't set any cookies to uniquely identify visitors
- Will honour the Do Not Track (`DNT`) header

## Request format

Requests will be `POST`ed to `https://analytics.routley.io/track` with the body

```json
{
  "page_url": "https://routley.io/posts/a-blog-post",
  "referer_url": "google.com",
  "screen_width": 1000
}
```

## Database

I think I'm going to start with a SQLite database. I'm going to run the
analytics server on a free Google Cloud Instance, and I'm not sure if I need the
power or scalability of MySQL or Postgres. I'm not super worried about losing
historic data if the instance dies for whatever reason.

Arguably a time series database like Prometheus would be a better fit for our
data - I'm avoiding this because I use Prometheus at work but don't use SQL and
would like to get more experience with it.

## Querying

We can write SQL queries to find out information about our visitors:

- Number of views per page per day
- Bucketed screen widths, so we can see what devices visitors are using
- What countries people are visiting from
- Where visitors are being referred form
