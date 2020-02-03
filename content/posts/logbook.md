---
aliases:
  - /tech/2017/11/23/logbook
date: "2017-11-23"
layout: post
title: Using a logbook to improve your programming
---

In this post, I'll describe the engineering practice of keeping a logbook, and
show how it can be applied to programming work.

## Logbooks

I studied engineering at university. Part of my course involved practical work,
which we recorded in a logbook. To use a logbook successfully, you have to:

1. Consider the problem you're attempting to solve
2. Describe your method for solving it
3. Describe the process of carrying out the method
4. Record what happened, and ask how it could be improved

This process is well suited to problem solving and active learning, and is
described by George Pólya in his book
[How to Solve It](https://en.wikipedia.org/wiki/How_to_Solve_It), which
describes a method for solving mathematical problems.

## Logbooks for programming

Recently, I've been trying to apply this method to writing software and
debugging code. It requires more upfront work than jumping in and trying things
out, but it offers some advantages:

- It provides a framework for solving hard problems by encouraging you to break
  them down into a series of smaller ones.
- It helps you focus on the task at hand by providing immediate context on what
  you're doing. If you forget or become distracted, you can quickly get back to
  your train of thought.
- It helps you learn quickly. You can observe your method for problem solving,
  see what works and what doesn't and make improvements.

Keeping a logbook has been a useful and interesting process for me so far - I'd
encourage you to try it out.

## Implementation

Real engineering logbooks are professional records which can be used as legal
evidence in case of patent disputes etc. They must be bound so pages can't be
inserted or removed, written in ink, each page must be dated, and each new day's
work must start on a new page.

Our logbook doesn't need to be this formal. Mine is a collection of Markdown
files each titled with today's date. I store them all in the directory
`~/logbook`. To simplify this, I've added a shell function for quickly opening
today's entry in Vim:

```sh
function lb() {
    vim ~/logbook/$(date '+%Y-%m-%d').md
}
```

Although it's simple enough to be added as an `alias`, I'd recommend using the
function. The function re-evaluates `date` each time its run, while the alias
only evaluates it when your `bashrc` or `zshrc` is evaluated. If you leave a
shell open overnight, `lb` will open yesterday's page.
