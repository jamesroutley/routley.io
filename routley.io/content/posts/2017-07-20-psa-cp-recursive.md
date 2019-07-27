---
aliases:
- /tech/2017/07/20/psa-cp-recursive
date: '2017-07-20'
layout: post
tags:
- unix
title: 'PSA: cp -r behaves differently on linux and macOS'
---

Today I found out ([the hard
way](https://github.com/cloudreach/sceptre/commit/91dc1c64056e190912577ba9c354092798589879))
that the GNU (available on linux) and BSD (available on macOS) implementations
of `cp` behave differently when used to recursively copy.

The differing behaviour comes when running `cp` with the `-r` flag on a source
directory that ends with a slash (`/`): 

- GNU/linux: copy the whole directory
- BSD/macOS: copy the contents of the directory

While this is documented behaviour (see man pages below), it can lead to unwanted behaviour if you
develop on a mac and build on a linux-based CI system.

## Man pages

GNU (linux):

```
-R, -r, --recursive
          copy directories recursively
```

BSD (macOS)

```
-R      If source_file designates a directory, cp copies the directory and the
        entire subtree connected at that point.

        If the source_file ends in a /, the contents of the directory are
        copied rather than the directory itself.

        [...]
```
