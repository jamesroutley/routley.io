---
title: "This website has small text on Firefox for mobile"
date: 2020-02-14T15:41:31Z
---

<style>
article img {
    max-width: 350px;
}
</style>

This website is currently rendered with very small text in Firefox on mobile.
Here's a screenshot of what it looks like on a Pixel 2:

![](/img/posts/firefox-mobile-default-css/website-firefox.png)

While debugging this, I tried removing all CSS from my website. It turns out
that the issue isn't to do with anything I've written (I think), but the way
Firefox displays unstyled HTML on mobile:

![](/img/posts/firefox-mobile-default-css/firefox.png)

I'm a bit surprised by this - I would have assumed that rendering unstyled HTML
would be legible in any browser. For comparison, here's how Chrome displays the
same page on mobile:

![](/img/posts/firefox-mobile-default-css/chrome.png)

I'm not sure how to fix this yet - I'll do some digging and post back. It's
completely plausible that this is just user error 🤷‍♀️
