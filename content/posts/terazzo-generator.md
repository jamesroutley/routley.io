---
title: "Random terazzo generator"
date: 2020-11-16T11:32:38Z
draft: true
scripts:
  - "/js/p5-v1-1-9.min.js"
  - "/js/terazzo.js"
---

<noscript>This article has diagrams which require JavaScript to show</noscript>

<div id="terazzo"></div>

[Terazzo](https://en.wikipedia.org/wiki/Terrazzo) is a material made by binding
small coloured chips in cement. After it's set, it's cut and polished, revealing
a pattern made by the chips. I recently built a random terazzo pattern
generator, using the JavaScript drawing library P5. I think the implementation
is quite neat - it produces decent results, doesn't involve complex maths and
uses a couple of techniques common in generative art. This post explains how it
works. The [source code](https://github.com/jamesroutley/terrazzo) is also
available.

## Goals

When implementing the generator, I had the following goals:

1.  Each chip should be drawn as a randomly generated 3-5 sided shape
2.  The pattern should be made up of a large number of these chips, against a
    coloured background, which represents the cement
3.  The chips can't overlap (in real terazzo, each chip is a physical object -
    they can't overlap because that would require two physical things to be in
    the same place)
4.  The implementation should be simple and easy to understand

## Chip generation

We want to generate random 3-5 sided shapes, which look like this:

<div id="threeIdealChips"></div>

My first thought was to draw the outline of the shape by:

1.  Picking a point to start at
2.  Draw a line in a random direction for a random distance to give the next
    point
3.  Repeat this a number of times
4.  Close the shape by drawing a line from the final point to the starting point

<div id="pathWalking"></div>

However, this can give shapes with unwanted features:

1.  The lines sometimes cross over themselves
2.  The random choices sometimes give a very long and thin shape

<div id="pathWalkingBad"></div>

While considering how to bound the size of a chip, I remembered that there are
certain shapes (known as
[cyclic polygons](https://en.wikipedia.org/wiki/Circumscribed_circle)) where
each of their corners sits on the edge of a circle. We can use these shapes to
solve the two problems above:

1.  If all corners sit on the edges of a circle, then if you draw lines between
    the corners next to each other on the circle, they're guaranteed to not
    cross over each other
2.  We know the size of the shape will be smaller than the size of the circle,
    preventing the creation of long, thin shapes

We actually generate the chips by:

1.  Creating a bounding circle with a random radius. This radius determines the
    maximum size the chip can be
2.  Selecting 3-5 random points on the circle. We do this by selecting 3-5
    random angles between 0 and 360 degrees, sorting them, and converting each
    angle to a point with `x = radius * cos(angle)` and
    `y = radius * sin(angle)`
3.  Because we sorted the angles, the points we've just calculated are all next
    to each other on the circle. To create the shape, we draw lines from each
    point to its two neighbours

<div id="chipGeneration"></div>

## Chip placement

Now we can generate these chips, we need a way to draw lots of them, in a way
that they don't overlap. Luckily, the fact that each of our chips is bounded by
a circle can help us out.

Calculating whether two arbitrary shapes overlap requires complex maths, but we
can simplify this by just checking whether the bounding circles of any two chips
overlap. We can tell if two circles overlap by checking the distance between
them. If this distance between them is less than the two circles' radiuses added
together, then they overlap.

<div id="circleIntersection"></div>

To draw the final pattern, we repeatedly generate chips with random sizes,
colours and positions. If the chip's bounding circle overlaps with an existing
chip's bounding circle, we discard it. If not, we draw it.

<div id="chipPlacement"></div>

## Wrapping up

That's about it! There are a couple of limitations I've encountered with this
approach. Most notably, if you have a small chip with a large bounding circle,
you end up with some empty space which will never be filled. This leads to
sparser patterns than you can get with real terazzo.

I've also noticed that we sometimes generate very thin shapes when we (for
example) generate a triangle with two corners close to one another. We could fix
this by picking angles that are at least a certain distance away from each other
when generating the chip.
