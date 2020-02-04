---
title: "Real vs percieved simplicity"
date: 2020-02-04T08:13:04Z
---

There are certain command line tasks I need to do every few weeks or months,
which is infrequently enough that I need to look up the syntax every time I do
them. For example:

- Undoing a commit
- Getting `ripgrep` to return only the text which matches a regular expression,
  not the whole line
- Executing a command against all files in a directory

## A solution

To save time searching for how to do these things, I decided to create my own
command line tool, `cookbook`, which would let me save examples (or 'recipes')
for these tasks. I wrote this in Python, and it's about 70 lines of code with
whitespace and comments. Because I wanted it to be simple, it shells out to
other programs if it needs to do anything complicated. For example, the `edit`
command just opens a file in Vim.

## Issues

My `cookbook` tool worked well, until it didn't. I ran into several issues:

1. The `cookbook` script wouldn't be in my `$PATH`, so the command wouldn't work
2. I'd try and run it on a computer which didn't have Python 3 installed
3. `cookbook` stores examples for each tool in a separate file. You search for
   examples using the name of the tool, but some tools could plausibly be
   indexed by multiple names. For example, `ripgrep` is known by both `ripgrep`
   and `rg`. I use `neovim` as my text editor, and I could never remember if I'd
   stored examples under `neovim`, `nvim` or `vim`

By definition, these issues would crop up when I was trying to do something
else, so I'd work around them, rather than fixing them.

## Real vs perceived simplicity

Over time, I realised that the real problem was with my entire approach. I'd
tricked myself into thinking that my solution was simple because the code I'd
written was simple.

In retrospect, it's obvious that my initial approach was too complex. I fell
into a trap which is easy to fall into as a programmer. When you learn to code,
a world of automation, improved productivity and control opens up to you, and
every problem becomes solvable by writing a script or a command line tool.
Writing this code feels good, but it's important to remember that while lots of
problems can be solved by writing code, they're not always best solved by
writing code.

## A simpler solution

I've since switched to storing these examples in a single file, which I search
through with `grep`, and edit with Vim. There's no custom code involved.
