---
layout: post
title: "Learning Rust 01: a pwd clone"
---

*I'm learning Rust, and documenting the process. These posts are my notes -
they're not guaranteed to be useful, interesting or correct!*

In this post, I'm writing my first Rust program. It's a simplified clone of the
Unix tool `pwd`, which prints out the current directory. I'm calling it `rpwd`.

## Creating a project

I started a new executable application with:

```sh
$ cargo rwpd --bin
```

## Code

The code is simple:

```rust
use std::env;

fn main() {
    let path = env::current_dir().unwrap();
    println!("{}", path.display());
}
```

## Importing a module

The first line imports the [`env`
module](https://doc.rust-lang.org/std/env/index.html) from the standard
library, which implements functions to inspect and manipulate the process's
environment.

## Variable declaration

`let path` declares a new variable, `path`. Variables are
[immutable](https://doc.rust-lang.org/book/second-edition/ch03-01-variables-and-mutability.html)
in Rust. This variable is set to the result of the function call
`env::current_dir().unwrap()`.

## Current directory, Results

`env::current_dir()` calls the `current_dir()` function in the `std::env`
module. `current_dir` returns a `std::io::Result<PathBuf>`. A
[`Result`](https://doc.rust-lang.org/std/result/index.html) is a type which
represents a success or an error. To get at the success value, we must deal with
any potential errors. In Rust, 'functions return `Result` whenever errors are
expected and recoverable'. It's a way to ensure errors are dealt with.

## Unwrap

`.unrap()` calls `Result`'s `unwrap` method, which returns the success value if
the `Result` is `Ok`, or
[`panics`](https://doc.rust-lang.org/std/macro.panic.html) if there's an error.
According to `env::current_dir`'s
[docs](https://doc.rust-lang.org/std/env/fn.current_dir.html#errors), the
function can error if:

- Current directory does not exist
- There are insufficient permissions to access the current directory.

## Printing

Assuming there are no errors, `path` will hold `current_dir`'s success value, an
object of type `std::path::PathBuf`. This object represents an owned, mutable
path.

Finally, we print out the path. This uses the `println!` macro. Before printing
the path, we must call `PathBuf`'s `display` method. This converts the path into
a format [printable](https://stackoverflow.com/a/24061240) by `println!`.
