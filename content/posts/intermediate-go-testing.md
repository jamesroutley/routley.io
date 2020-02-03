---
aliases:
  - /tech/2017/11/05/intermediate-go-testing
date: "2017-11-05"
layout: post
title: Intermediate Testing in Golang
---

I've been writing Golang in production at Monzo for a couple of months now. This
post shares some things I've learnt about testing Go code.

## Parallelisation

Golang tests can be easily parallelised by calling `t.Parallel()` at the
beginning of a test:

```go
func TestThing(t *testing.T) {
    t.Parallel()
    // test code
}
```

This test will now be run in parallel with other tests marked as parallel.
Parallel tests are run in a number of goroutines. This number is defaulted to
`GOMAXPROCS`, but can be set by passing the `-parallel` flag to `go test`.

## Skipping tests

Sometimes it's useful to skip a particular test. If a change causes multiple
tests to fail, I like to skip all but one, to reduce noise while debugging. I
used to do this by commenting out functions, but it can also be done by calling
`t.SkipNow()` at the beginning of the test:

```go
func TestThing(t *testing.T) {
    t.SkipNow()
    // test is skipped
}
```

`SkipNow` should be called at the top of the function. If a test fails before
`SkipNow` is called, the test is still considered to have failed.

`SkipNow` is useful if skipping a test needs to be committed to version control.
Explicitly skipping a test is less confusing to future readers than a commented
test. Was the commented out test done so intentionally? Is that test meant to
pass? Skipping can be made even more explicit by calling `Skip` or `Skipf`,
which logs a (formatted) message before skipping the test.

```go
func TestThing(t *testing.T) {
    t.Skip("Temporarily skipping test because ...")
}
```

## Sub tests

A popular paradigm in Golang is table-driven testing, where a single test is run
with an array of different input parameters:

```go
func TestAdd(t *testing.T) {
    testCases := []struct{
        a, b, expected int
    }{
       {a: 0, b: 0, expected: 0},
       {a: -1, b: 1, expected: 0}
    }

    for _, tc := range testCases {
        if tc.a + tc.b != tc.expected {
            t.Errorf("%d + %d != %d", tc.a, tc.b, tc.expected)
        }
    }
}
```

Although this is written as a single test, it's really multiple. If one of the
test cases fails, the whole test function fails, and it can be difficult to tell
which one failed without a useful error message.

The `testing` package contains a function which allows tests like this to be
split out into explicit sub-tests:

```go
func TestAdd(t *testing.T) {
    testCases := []struct{
        a, b, expected int
    }{
       {a: 0, b: 0, expected: 0},
       {a: -1, b: 1, expected: 0}
    }

    for _, tc := range testCases {
        name := fmt.Sprintf("%d + %d != %d", tc.a, tc.b, tc.expected)
        t.Run(name, func(t *testing.T) {
            t.Parallel()
            if tc.a + tc.b != tc.expected {
                t.Error("incorrect addition")
            }
        })
    }
}
```

Each of these subtests can also now be parallelised.

## Assertions

Golang doesn't have a built in `assert` function. Manual comparison is the
recommended way to check that two objects are the same. This can be verbose, and
the comparison method depends of the object's type:

```go
func TestThing(t *testing.T) {
    a := 0
    b := 1
    if a != b {
        t.Errorf("%d != %d", a, b)
    }

    c := []int{1, 2, 3}
    d := []int{4, 5, 6}
    // Comparing slices is different to comparing ints
    if !reflect.DeepEqual(c, d) {
       t.Errorf("%v != %v", c, d)
    }
}
```

I've started using the `assert`
[package](https://godoc.org/github.com/stretchr/testify/assert) to simplify this
code:

```go
func TestThing(t *testing.T) {
    a := 0
    b := 1
    assert.Equal(t, a, b)

    c := []int{1, 2, 3}
    d := []int{4, 5, 6}
    // ✨ API is now the same
    assert.Equal(t, c, d)
}
```

`assert` comes with lots of functions for verifying your data.

## Examples

Golang offers an easy way to write example functions which are displayed on the
package's godoc page. These example functions are defined alongside a package's
tests, and are run with the tests, to make sure they aren't outdated.

If there's any ambiguity about how a function should be used, I like to add an
example to make it easier to understand.

## Helper functions

Sometimes it's useful to refactor code used in multiple tests into a helper
function:

```go
package main

import "testing"

func TestThing(t *testing.T) {
	AssertEqualInt(t, 1, 2)
}

func AssertEqualInt(t *testing.T, a, b int) {
	if a != b {
		t.Errorf("%d != %d", a, b)
	}
}
```

When we run this test, we get the error:

```sh
$ go test .
--- FAIL: TestThing (0.00s)
        scratch_test.go:11: 1 != 2
```

This error message tells us which test failed, but the line given (11), is the
line that `Errorf` is called. If this helper is called multiple times, it can be
difficult to work out which call is erroring.

Golang provides a way, `t.Helper`, to explicitly mark that function as a helper:

```go
func AssertEqualInt(t *testing.T, a, b int) {
    t.Helper()
	if a != b {
		t.Errorf("%d != %d", a, b)
	}
}
```

`go test` now prints out the line number where the helper function was called:

```sh
$ go test .
--- FAIL: TestThing (0.00s)
        scratch_test.go:6: 1 != 2
```
