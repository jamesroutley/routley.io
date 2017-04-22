---
layout: post
title: "Moving from Jekyll, Part 03: Website Engine Design"
date: 2016-11-28
---

This series of articles documents the move of this website from a heavily managed site powered by [Jekyll](https://jekyllrb.com/) and hosted on [GitHub Pages](https://pages.github.com/), to a site backed by a custom website engine and self-hosted on AWS.


## Goals

The website engine should:

- Compile pages and blog posts written in `Markdown` to a static `HTML` website
- Offer a layout template system, where web pages can be composed from `Markdown` content and `HTML` snippets.
- Offer a configuration template system, where global configuration values, such as base urls and page descriptions can be inserted into pages.
- Have a plugin-based extensibility model, so users can easily customise the behaviour of the engine.
- Allow the user to add arbitrary files (such as images or stylesheets) to the static website in an intuitive way
- Have a development server which displays the user's website
- Be written in Python
