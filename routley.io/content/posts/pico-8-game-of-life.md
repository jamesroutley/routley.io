---
aliases:
- /tech/2018/02/25/pico-8-game-of-life
date: '2018-02-25'
layout: post
title: Pico-8 Game of life
---

The [Pico-8](https://www.lexaloffle.com/pico-8.php) is a 'fantasy console' built
by Lexaloffle. It's a program that runs on your computer that lets you write an
play small games written in Lua. I recently implemented Conway's Game of Life
for Pico-8 and it was a fun and rewarding experience. You can play with my
implementation
[here](https://routley.io/projects/pico-8-game-of-life/index.html).

This post contains some thoughts I had while making the game.

## Lua

This was my first time writing Lua and found it easy to pick up. It's similar to
other scripting languages, including Python, which I've written extensively. I
like that Lua's fundamental data type is the hash table - they're useful for a
large number of problems.

## Pico-8 standard library isn't Lua's standard library

This tripped me up a bit - I'd get something working using Stack Overflow
answers and the Lua REPL to find that it wouldn't work in Pico-8. This [GitHub
Gist](https://gist.github.com/josefnpat/bfe4aaa5bbb44f572cd0) outlines the
discrepancies.

## Performance matters

The Pico-8 runtime is CPU and memory restricted. This means the algorithmic
complexity of your game update function actually matters. My initial, naive, Game
of Life implementation ran in `O(n^2)` time, where `n^2` is the number of pixels
on the board. This was too slow to run smoothly, so I had to rewrite it, and
ended up with a `O(m)` implementation, where `m` is the number of 'alive' pixels
on the board. Usually, `m << n^2`.

I round this limited runtime fun to work with. Most code I write is
performance-limited by network latency, so its algorithmic complexity doesn't
matter as much. It was rewarding to *have* to write fast code.

## Debugging

You can access live Memory and CPU usage with the builtin `stat` function. I
used this to print out debug information when trying to get my frame rate high
enough:

```lua
-- debug printing
debug = false

function _draw()
    -- ...
    if debug then
            print(stat(0))
            -- you want this to be below than 1. Greater than 1 means you're
            -- dropping frames
            print(stat(1)) 
    end
end
```

You can find out more about the `stat` function
[here](http://pico-8.wikia.com/wiki/Stat).

## Overall

Pico-8 is cute, fun platform to develop for. The challenges you face are
different to those faced in day-to-day programming, and I'd recommend having a
go at it!
