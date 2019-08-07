---
aliases:
- /tech/2017/10/31/first-impressions-elm
date: '2017-10-31'
layout: post
title: First impressions of Elm
---

This week, I've been learning Elm. While at the Recurse Center, I came across
the book [Seven Languages in Seven
Weeks](https://pragprog.com/book/btlang/seven-languages-in-seven-weeks). The
book's concept appealed to me. While I don't think it's possible to learn a
programming language in a week, I think there's value in broadening your
horizons with the quick study of a wide range of concepts.

This post summarises my initial thoughts about Elm, and lists some resources
which may help you learn it.

## Features

Elm is a front-end language. It compiles to JavaScript, HTML and CSS. It is a
strongly typed, purely functional language, and it borrows syntax from Haskell.
It has a small [syntax](http://elm-lang.org/docs/syntax), and only implements a
few [core
libraries](http://package.elm-lang.org/packages/elm-lang/core/latest/).

Elm defines the [Elm Architecture](https://guide.elm-lang.org/architecture/), a
pattern that most applications should follow. This architecture splits code into
three sections:

1. Model - the state of an application
2. Update - the way to update the state
3. View - how the state is presented as HTML

## Impressions

- Fun to write. Elm aims to be a beginner friendly language. It's accessible,
  and seems to have a good community.
- Friendly compiler. I think Elm's compiler is the most helpful compiler I've
  used. It offers helpful debugging notes. It also writes in the first person!
- Community. Elm's community seems friendly. It's not huge, and there are fewer
  stack overflow questions etc than I'm used to. 
- Single ecosystem. Elm is relatively self contained. It's easy to set the
  compiler up, without having to configure babel, react, redux, webpack etc.
- Architecture. Having a fixed architecture makes it easy to start developing in
  Elm. I think more languages should offer example architectures.
- Safety. Elm aims to be a safe language. It has a strict type system which if
  used well can catch a lot of bugs at compile time. It doesn't have a [concept
  of null](https://guide.elm-lang.org/error_handling/maybe.html), and forces the
  user to account for procedures which [may
  fail](https://guide.elm-lang.org/error_handling/result.html). 
- Haskell introduction. Elm shares features with Haskell, but is simpler and
  carries less baggage. It may be a useful stepping stone to learning Haskell.
- Javascript interop. Interacting with plain JavaScript libraries happens via 
  [ports or flags](https://guide.elm-lang.org/interop/javascript.html). From
  what I understand, these allow safe interaction with potentially unsafe
  external code. I haven't actually done this so I can't say any more about
  this!

## Resources

- [Elm Guide](https://guide.elm-lang.org/install.html). I'd recommend working
  through this to get an overview of how to install, setup and write Elm.
- [Learn Elm in Y Minutes](https://learnxinyminutes.com/docs/elm/). A useful
  guide to Elm's syntax.
- elm-repl. Elm's repl is useful for quickly testing ideas out.
- [elm-test](https://github.com/elm-community/elm-test). I found writing tests
  useful for confirming that functions behave as expected.
- [Let's be
  mainstream](http://www.elmbark.com/2016/03/16/mainstream-elm-user-focused-design).
  A talk by Evan Czaplicki, Elm's inventor, on some of the philosophy behind the
  language.
