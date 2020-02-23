---
title: "Scraping a website"
date: 2020-02-22T19:06:09Z
draft: True
---

I've spent today writing some code to scrape a series of lessons from a website.
Each lessons consists of text and image data. I wanted to save the content of
each lesson, so I could read through them offline.

I'll go through what I did, the issues I ran into and how I solved them.

## Overview

I split the crawling into two steps:

1. Finding all the URLs to scrape
2. Scraping data from each one

I ended up using a mix of Python and JavaScript for this. I chose Python because
I know it well and can write it quickly, and I used JavaScript for scripting
Chrome because it has better library support.

## Finding all URLs

This was surprisingly hard. The website has an index page which links to all the
content I wanted to scrape, but the index is populated using JavaScript. This
meant I couldn't pull the links from the HTML the server sent me, but had to
pull them from the HTML that my browser renders.

I couldn't find a native way to do this in Firefox or Chrome, so ended up
installing a Chrome extension which let me copy the rendered HTML.

Once I had the HTML, I use the Python library Beautiful Soup to find all `a`
tags with the relevant class:

```python
with open(index.html) as f:
    body = f.read()
soup = BeautifulSoup(body, "html.parser")
links = soup.find_all("a", class_="content_link", href=True)
urls = [link["href"] for link in links]
```

## Scraping each page

The way you scrape each page depends on your desired output format. Initially, I
considered fetching the HTML, converting it to Markdown and saving that. This
would have worked, but the data I was scraping contained a lot of images, and
the generated Markdown would contain links to the images hosted on the website.
To prevent link rot, we'd need to download all of these images manually.

To avoid this, I dedcided to save each page to a PDF. You can script Chrome to
save websites as PDFs using the JavaScript library Puppeteer.

## Puppeteer

Navingating to a page and saving it as a PDF is simple with Puppeteer:

```javascript
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://example.com");
  await page.pdf({ path: "example.pdf", format: "A4" });

  await browser.close();
})();
```

However, I needed to add some extra code to get mine working:

### Authentication

The website I was scraping required authentication. I spent a long time trying
to solve this by getting Puppeteer to:

1. Open my personal Chrome profile, where I was already logged in
2. Script Puppeteer to go through the log in flow and enter my username and
   password

In the end, I was looking through the cookies stored by the website, and found
two which looked related to authentication: `_session` and `_token`. I set the
authentication cookies on the page that Puppeteer opens, which makes the server
think we're logged in:

```javascript
// Set cookies before we visit the webpage
// so it doesn't ask us to log in.
await page.setCookie(
  {
    name: "_session",
    value: "abc...",
    domain: "example.com"
  },
  {
    name: "_token",
    value: "def...",
    domain: "example.com"
  }
);

await page.goto("https://example.com");
// ...
```

### Cleaning up the PDF

The page didn't look particularly good when it was saved as a PDF - elements
like the header, navigation and footer were present and I didn't want them to
be.

Puppeteer lets you run arbitrary JavaScript on the website before saving the
PDF, which you can use to remove those elements:

```javascript
try {
  // Hide navbar
  await page.evaluate(() => {
    let items = document.querySelectorAll(".navbar");
    items.forEach(e => {
      e.parentNode.removeChild(e);
    });
  });

  // ...
} catch (err) {
  console.log(err);
}
```

I wrapped this in a `try/catch` block so we don't crash on pages that don't
happen to have these elements.

## Automating the scraping

We've got a list of URLs to scrape, and a method to scrape each one. We now need
write some code which calls the scraper for each URL.

There's one final bit of complexity here. The lessons we're scraping are split
across sections and topics. There are a number of sections, which are each split
into a number of topics, and each topic contains a number of lessons.

On the website, the index page lays out the lessons in a specific order, but
this order isn't explicit in the page URLs or titles.

I'd like to save the files in directories which match this format. I'd also like
to number each section, topic and lesson to preserve the order they're meant to
be read in.

I did all of this with the following code:

```python
current_section, current_topic = "", ""
section_count, topic_count, lesson_count = 0, 0, 0
for url in urls:
    # Read the section, topic and lesson name
    parts = url.split("/")
    section, topic, lesson = parts[3], parts[4], parts[5]

    if section != current_section:
        # We're at a new section. Increment the section count, and reset the
        # topic count. We could also reset the lesson count, but we don't need
        # to because we do that in the block below
        current_section = section
        section_count += 1
        topic_count = 0

    if topic != current_topic:
        # We're at a new topic. Increment the topic count and reset the lesson
        # count
        current_topic = topic
        topic_count += 1
        lesson_count = 1

    # Calculate the path to store the PDF at
    path = os.path.join(
        "_output",
        str(section_count) + "-" + section,
        str(topic_count) + "-" + topic,
        str(lesson_count) + "-" + lesson + ".pdf",
    )
    lesson_count += 1

    if os.path.exists(path):
        # We've already downloaded this file
        continue

    # Make any intermediate directories we need
    directory = os.path.dirname(path)
    os.makedirs(directory, exist_ok=True)

    # Download the PDF by calling our Puppeteer script
    print("Downloading", path)
    subprocess.run(
        ["node", "get_pdf.js", url, path],
        check=True
    )
```

The counting logic above might seem incorrect, but it works. Sections, topic and
lessons are numbered from 1. In the first iteration of the loop, we increment
the section and topic counters from 0 to 1, and set the lesson counter to 1.
There's probably a better way of writing this.

## Conclusion

I spent a couple of hours working on this, a big chunk of which was spent trying
to get Puppeteer to use my personal Chrome profile. Some thoughts on how it
went:

- The Puppeteer script crawls a single page, and starts and stops Chrome each
  time it does this. This takes a long time (~12 seconds). You could speed this
  up by reusing the browser for multiple page visits. I chose not to do this,
  because I wanted a bit of rate limiting, which starting and stopping Chrome
  gave for free.
- Using a mix of languages saved me time, but it makes the project more complex.
  I think it was the correct trade off here, because I won't be running this
  code again.
- I really like Python as a scripting language, but I sometimes wish it were a
  bit more like Bash. Bash makes it super easy to write 'glue code' which calls
  out to different programs and combines the results together, but Bash is
  complex and error prone as an actual language. Python is sort of the
  opposite - it's a much cleaner and intuitive language, but it encourages you
  to stay within its ecosystem. I think a combination of Python and Bash would
  make an extremely productive language for hacky ephemeral projects like this
  one.
