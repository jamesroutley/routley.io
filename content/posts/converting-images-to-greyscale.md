---
title: "Converting images to greyscale"
date: 2019-08-04T09:46:53+01:00
draft: true
---

In this post, we'll learn about and implement some algorithms for converting
colour images to greyscale. This post uses Golang, because it has a good library
for image manipulation, but the code should be easy to follow even if you're not
familiar with it.

## Images

All image formats represent a two-dimensional grid of pixels. Each pixel
represents a colour. Different image formats (e.g. PNG, JPEG, GIF) compress
images in different ways, but they all fundamentally represent a 2D grid of
pixels.

In colour images, each pixel has a red, a green and a blue component. These
three colours can be used to represent any other colour when mixed in different
proportions. In greyscale images, each pixel has a single grey value, which
ranges from 0% (pure black) to 100% (pure white). TODO: maybe use uint16 here?

To convert an image from colour to greyscale, we need to convert the three red,
green, blue numbers into a single grey number for each pixel in the image.

## Opening a colour image

This code is adapted from the
[Go `image` package example](https://golang.org/pkg/image/#example_)
