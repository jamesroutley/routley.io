---
title: "Tangle"
date: 2020-06-20T17:10:09+01:00
draft: true
---

## Some background on literate programming

In normal programming, software is written in a programming language which may
be interspersed with comments which explain why or how the code works. Literate
programming inverts this - you write in a natural language (such as English),
and intersperse snippets of source code. This document is then run through a
program which pulls out and concatenates the source code snippets, and passes
them to the compiler to be run. Donald Knuth, who came up with literate
programming, named this process 'tangling', which is what this tool is named
after.

This makes for very readable programs, but also creates a lot of extra work for
the programmer, which is why I think it hasn't caught on and become the standard
way of programming.

## Software tutorials and blog posts and the problem Tangle solves

An interesting thing about literate programs is that they closely resemble
modern software tutorials and blog posts, which contain explanations in a
natural language, interspersed with code snippets.

If you've written one of these, you might have had the issue that it's difficult
to validate that the code in the snippets is correct. My old solution to this
was to have two files open:

1. The tutorial with its code snippets
2. A file containing just the code, which I can run and validate

This works, but is quite manual. If there's a bug in the code, or I want to add
a new feature, I need to change code in two places.

Tangle aims to solve this problem. It takes a tutorial or blogpost written in
Markdown, pulls out any source code defined in code blogs, stitches them
together and writes them to a file. You can then run the file (or run tests
against it) to check that everything's working as expected.
