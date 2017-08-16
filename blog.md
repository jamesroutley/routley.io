---
layout: default
title: James Routley | Blog
---

# Blog

{% for post in site.categories.tech %}
- `{{ post.date | date: "%Y-%m-%d" }}` - [{{ post.title }}]({{ post.url }}) {% endfor %}

[Subscribe with rss](/feed.xml)
