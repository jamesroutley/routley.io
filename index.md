---
layout: default
title: James Routley | James Routley
---

# James Routley

Backend developer at [Monzo](https://monzo.com/), co-founder of and chef at
[Bergamot and Black](http://bergamotandblack.com/), Computer Business Review [30
under 30 in
Cloud](http://www.cbronline.com/news/cloud/top-30-under-30-in-cloud/#http://www.cbronline.com/news/cloud/top-30-under-30-in-cloud/#2),
ex-cloud systems developer at [Cloudreach](https://www.cloudreach.com/), alumnus
of the [Recurse Center](https://www.recurse.com/) and the University of Oxford.

- [GitHub](https://github.com/jamesroutley)
- [LinkedIn](https://uk.linkedin.com/pub/james-routley/a8/28b/ab9)
- [Twitter](https://twitter.com/james_routley)
- [Curriculum Vitae](assets/pdf/james-routley-cv-2017-03-22.pdf) (pdf)

## Blog

[All posts](/blog.html)
{% for post in site.categories.tech limit: 3 %}
- `{{ post.date | date: "%Y-%m-%d" }}` - [{{ post.title }}]({{ post.url }}) {% endfor %}

## Projects

- [Sceptre](https://github.com/cloudreach/sceptre), a tool for launching and managing CloudFormation stacks
- [Slingshot](https://slingshot.jamesroutley.co.uk/), an interplanetary physics game.
- [Ptolemy](https://github.com/cloudreach/ptolemy), a tool for writing terse AWS DMS Mapping Tables
- [Dev](https://github.com/jamesroutley/dev), a cli tool for initialising development environments
- [AWSCM](awscm.html), an AWS Credentials Manager
- [A Flower Classification Android Application](flower.html)
