---
aliases:
  - /tech/2018/07/08/learning-rust-02
date: "2018-07-08"
layout: post
title: "Learning Rust 02: an ls clone"
---

_I'm learning Rust, and documenting the process. These posts are my notes -
they're not guaranteed to be useful, interesting or correct!_

In this post, I'm building an `ls` clone. It's pretty similar to the last post's
`pwd` clone. It's called `rls`.

## Code

```rust
use std::env;
use std::fs;
use std::process;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        usage();
    }
    let directory = &args[1];
    let paths = fs::read_dir(directory).unwrap();
    for path in paths {
        let path_buf = path.unwrap().path();
        let file_name = path_buf.file_name().unwrap();
        println!("{}", file_name.to_string_lossy())
    }
}

fn usage() {
    eprintln!("usage: rls <dir>");
    process::exit(1);

}
```

## Fetching arguments

We can get the arguments passed to `rls` with the `env::args` function, which
returns an iterator. We can convert the iterator to a
[vector](https://doc.rust-lang.org/std/vec/struct.Vec.html), Rust's 'contiguous
growable array type'. I think vectors are the Rust equivalent to Go's slices, or
Python's lists. We assign this vector to a new variable, `args`.

## Input validation

We require that an argument is passed to `rls`, the directory whose contents we
want to list. If this argument isn't supplied, we call `usage`, which prints a
help message to `stderr` and exits with a non-zero code, indicating an error.

## Fetching a directory's contents

The standard library function `fs::read_dir` returns an iterator of
`Result<ReadDir>`, where `ReadDir` is an iterator of `io::Result<DirEntry>`s.

## Printing the directories

We iterate over the `ReadDir`, `unwrap` each path, and pull the actual file name
out. Printing `path_buf` would print the file path **relative to the pwd** -
`ls` only prints file names. We print the file names with the `println!` macro.

## Error handling

Functions which interact with the file system are error-prone. That's why lots
of the values we get back from the file system functions are wrapped in
`Results`. To use the success values, we need to handle the error case. We're
currently doing this using `unwrap`, which panics if there's an error. This is
both verbose and bad UX - we probably don't want to display a full Rust error
message to our users.

It looks like there are a couple of ways of improving this - I'll be doing some
reading about it
[here](https://doc.rust-lang.org/book/second-edition/ch09-00-error-handling.html).
