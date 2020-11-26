---
title: "Bash Python"
date: 2020-02-23T15:51:44Z
draft: true
---

There are a class of tasks I encounter as a programmer, which have the following
characterestics:

- They're automatable, and big enough to warrant doing programatically
- I care about solving them quickly much more than solving them well
- Non-repeatable

Examples:

- Making an API request with a user ID in in the body for each user ID in a file

My flow for solving these frequently goes something like:

1. Try and write a Bash one-liner to solve it. This will probably include
2. Realise it's a bit too complex for a one-liner, and try and write a Bash
   script to solve it
3. Realise I don't know how to write Bash, switch to Python, and have to
   re-implement things which are quick and familiar in Bash (e.g. filtering with
   `jq`, searching whole directories with `ripgrep` etc)

The jump from 1 to 2 is relatively pleasant, because there's minimal context
switching. I can copy and paste the one-liner into a file, and continue from
exactly the same position, writing the same language, but with more space.

The jump from 2 to 3 is worse. You're now writing a different language
