---
title: "Vim diff"
date: 2020-02-05T20:03:04Z
---

I was digging through Vim's documentation, and came across the help article
`diff.txt`. It turns out that Vim implements a visual diff feature, which shows
the 'difference between two to eight versions of the same file'.

I occasionally need to find the differences between two files, and have
historically used `diff` for this. Unfortunately, I find the output quite hard
to parse:

```sh
$ diff file_1 file_2
32c32
< TODO: screenshot of diff
---
> ![Image showing what a diff looks like in Vim][vim-diff]
41a42,43
>
> [vim-diff]: /img/posts/vim-diff/diff.png
```

Vim's visual diff is much clearer to me:

```sh
$ vim -d file_1 file_2
```

![Image showing what a diff looks like in Vim][vim-diff]

Vim sets some options to make browsing the diff easier:

1. `scrollbind` is set to `on`, so when you scroll through one file, the other
   will scroll alongside it
2. Sections of common text are hidden with a fold

There are commands for jumping between diffs, and copying text from one file to
the other. You can find out more by typing `:help diff.txt` from inside Vim.

[vim-diff]: /img/posts/vim-diff/diff.png
