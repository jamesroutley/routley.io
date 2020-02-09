---
title: "mmv, a tool for batch renaming files"
date: 2020-02-09T16:00:11Z
---

A couple of months a go, I wrote a command-line tool called `mmv`, which lets
you batch rename files. You can find its
[source code on GitHub](https://github.com/jamesroutley/mmv/).

`mmv` takes a single argument, a path to a directory. It opens a list of the
files in that directory in the text editor of your choice. You can edit the file
names and when you save and exit your editor, it'll rename the files.

I think this is a neat solution to an occasional problem. Changing lots of file
names is basically a text editing problem, and most people have a text editor
they're already proficient with.
