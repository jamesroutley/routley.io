---
aliases:
  - /tech/2017/07/20/golang-test-fixtures
date: "2017-07-20"
layout: post
tags:
  - go
  - tdd
title: Simplify Golang test fixtures with this one weird trick
---

When testing code, test functions may depend on some external dependency. For
example, if we have written a:

- Web crawler, we may want to test it on a real website
- Web server, we may want to test `GET` methods against a real database

Test fixtures are functions which launch the external dependencies our test code
requires.

Say we're writing a web crawler and want to test it against a real website. We
can define `startServer` and `stopServer` functions which are called by our test
functions to serve the website required for our testing:

```go
func startServer() net.Listener {
    // Start server
    return listener
}

func stopServer(l net.Listener) {
    // Stop server
}

func TestFeature(t *testing.T) {
    listener := startServer()
    defer stopServer(listener)
    // Run test
}
```

We can simplify this code by making the start function return the stop function:

```go
func startServer() func {
    // Start server

    func stopServer() {
        // Stop server
    }

    return stopServer
}

func TestFeature(t *testing.T) {
    stopServer := startServer()
    defer stopServer()
    // Run test
}
```

This pattern has two benefits:

1. `startServer` and `stopServer` are inherently linked and should always be
   called together. Binding the two functions together makes this explicit.
2. In the first example, the writer of `TestFeature` must know that
   `startServer` returns a `net.Listener`, which must be passed to `stopServer`.
   This leaks implementation detail. In the second example, this information is
   hidden[^1], giving a cleaner API. The `startServer` and `stopServer`
   functions can be changed internally, without affecting test code.

---

[^1]:

  The nested functions in the second example form a closure, in which the
  `net.Listener` is persisted.
