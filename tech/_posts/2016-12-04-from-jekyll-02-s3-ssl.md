---
layout: post
title: "Moving from Jekyll, Part 02: Deployment to S3 and SSL"
date: 2016-12-04
---

This article is part of a series detailing the move of this website from Jekyll and GitHub Pages to a self-hosted solution. Motivation and roadmap can be found [here]({% post_url /tech/2016-11-28-from-jekyll-00-motivation-and-roadmap %}).


## Previous Hosting and Deployment

Previously, the website was hosted using [GitHub Pages](https://pages.github.com/), a free static website hosting provided by GitHub. Once Pages is configured, the updated site can be deployed by pushing it to GitHub with `git push`.

The old website used the Jekyll static site generator. As Jekyll is written by GitHub, GitHub Pages also natively supports Jekyll sites, running the build step for you.


## S3 Website Hosting

AWS S3 can be [configured](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) to host static websites. As the Jekyll build process produces a static website, this static site can be hosted on S3. This requires an extra build step; with GitHub Pages the Jekyll build was managed by GitHub, on S3 it needs to be run manually. The website is deployed by uploading it to S3.

These two steps can be automated using the following `Make` process:

~~~Make
build:  # Create the static and store it in _site/
	jekyll build

deploy-prod: build  # Deploy the production website to S3
	aws s3 sync _site s3://jamesroutley.co.uk --delete
~~~

They deployment uses the AWS [CLI](the updated site), which must be correctly [configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) with AWS credentials for the destination account.

A development environment was set up at [dev.jamesroutley.co.uk](https://dev.jamesroutley.co.uk/).


## DNS

S3 static websites are assigned a URL, such as [http://jamesroutley.co.uk.s3-website-eu-west-1.amazonaws.com/](http://jamesroutley.co.uk.s3-website-eu-west-1.amazonaws.com/). To access the website from a custom domain name, a Route53 Alias Record pointing the custom domain name to the S3 bucket [should be created]((https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html)).


## SSL

While S3 can be used to host static websites, it doesn't natively support SSL. To set it up, a [CloudFront](https://aws.amazon.com/cloudfront/) distribution must be created. CloudFront is AWS's content delivery network (CDN), a geographically distributed network of servers used to deliver web content. CDNs are usually used to speed up web response times and reduce server load. CloudFront is used in this case because it supports SSL. To set it up, this [guide](https://blog.webinista.com/2016/02/enable-https-cloudfront-certificate-manager-s3/index.html) can be followed. A free SSL certificate was obtained from [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/).
