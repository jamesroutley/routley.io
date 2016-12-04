---
layout: post
title: "Moving from Jekyll, Part 00: Motivation and Roadmap"
date: 2016-11-28
---

This series of articles documents the move of this website from a heavily managed site powered by [Jekyll](https://jekyllrb.com/) and hosted on [GitHub Pages](https://pages.github.com/), to a site backed by a custom website engine and self-hosted on AWS.

## Motivation

Moving a way from Jekyll is a bad idea for the following reasons:

- Jekyll is a mature website engine which has attracted widespread community support and is backed by GitHub. A home-spun website engine will be less tested, less reliable and possibly less secure.
- Hosting on GitHub Pages is free, self hosted is not.

However, it does offer the following opportunities:

- Learn how lots of things work.
- Set up SSL on the site, which is [possible but not natively supported](https://github.com/isaacs/github/issues/156) for GitHub Pages with custom domains.
- Jekyll is written in Ruby, I would prefer my website engine to be implemented in Python.

## Roadmap

- [Part 01]({% post_url 2016-11-29-from-jekyll-01-css %}): CSS. Update the website's CSS. The old website's CSS is based on [Bootstrap](http://getbootstrap.com/), but only uses it for its [grid system](http://getbootstrap.com/css/#grid). The old website carries around a lot of unused CSS, which is inelegant and wastes bandwidth. Fonts and page design could also be improved.
- [Part 02](% post_url 2016-11-29-from-jekyll-02-s3-ssl %): Deployment to S3 and SSL. GitHub doesn't natively support SSL, but AWS S3 does. Jekyll produces a static website and S3 can be used to cheaply and availably [host it](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).
- Part 03: Website engine design. High level design for the website engine.
- Part 04: Website engine implementation.
- Part 05: Continuous Integration. One of the neatest parts of the GitHub Pages/Jekyll ecosystem is the ability to deploy the website with a `git push`. This can be implemented for an S3 website with an [AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html) function, triggered by a GitHub push notification, that compiles the website and pushes it to S3.
