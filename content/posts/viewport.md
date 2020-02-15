---
title: "Mobile viewports"
date: 2020-02-15T07:16:55Z
---

Yesterday, I wrote about how [this website looks small on Firefox on
mobile]({{< ref "/posts/firefox-mobile-default-css" >}}). It turns out, this is
a viewport issue, which is fixed by adding the following line to each page's
`<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## What's going on?

A browser's viewport is the area of the page which can currently be seen.

When smartphones were first introduced, most web pages weren't optimised for
mobile and would have looked broken when viewed from mobile devices, because
mobiles have much smaller viewports than desktop browsers. To fix this, mobile
browsers render the page to a virtual viewport which is wider than the device
screen, then shrink the rendered content down to fit onto the device screen.

This website is optimised for mobile, and we tell this to mobile browsers with
the HTML tag above.
