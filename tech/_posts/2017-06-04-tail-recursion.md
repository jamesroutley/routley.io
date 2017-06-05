---
layout: post
title: Tail recursion for imperative programmers
---

At the Recurse Center, I've been working my way through The Structure and
Interpretation of Computer Programs (SICP) book. It's an introductory 
programming book written for an MIT course in 1985. It teaching programming 
using the language Scheme, a LISP dialect. Scheme is functional, and I've
been enjoying learning new functional concepts.

This article aims to explain tail recursion to programmers without experience
in functional languages or concepts.

Before looking at tail recursion, let's look at recursion in an imperative
language, Python.

## An issue with recursion

```python
>>> def factorial(n):
        if n == 1:
            return 1
        else:
            return n * factorial(n - 1)
>>> factorial(4)
24
```

The snippet above defines a function which returns the factorial of some number
`n`. `factorial(n) = n * n - 1 * ... * 2 * 1`. For `n = 4`, we
expect the result to be `4 * 3 * 2 * 1 = 24`, which we do get.

What happens behind the scenes when we run a recursive function? When any
function call is made, a frame containing data associated with that function is
added to the stack. We can see this happening using the `inspect` package in
Python:

```python
import inspect

print inspect.stack()

def a():
    print inspect.stack()
a()
```

Running this script gives:

```python
[
    (<frame object at 0x1042a9c20>, ...)  # output truncated
]
[
    (<frame object at 0x7fa702d2a000>, ...), 
    (<frame object at 0x1042a9c20>, ...)  
]
```

We can see that when `inspect.stack()` is called the first time, a single frame
is on the stack. When it is called again, there are two.

Frames take up memory, and a Python process is allocated a limited amount of
memory. If a stack contains too many frames, the process can run out of memory,
or the stack may expand into memory not allocated to its process, causing a
stack overflow. To stop this from happening, the interpreter sets a maximum 
recursion limit, which can be found with `sys.getrecursionlimit()`. On my
computer, this limit is set to 1000 [^maxrecursion].

For each call to `factorial()`, a new frame is added to the stack. If too many
frames are added, we'll excede the maximum recursion limit and the interpreter
will throw an exception:

```python
>>> factorial(999)
4023872600770937735437024339230039...
>>> factorial(1000)
RuntimeError: maximum recursion depth exceeded
```

Recursion in imperative languages can be memory intensive, due to the frame
overhead. Compare it to a function which finds a factorial iteratively:

```python
>>> def factorial_iter(n):
        total = 1
        for i in range(1, n + 1):
            total *= i
        return total
>>> factorial(1000)
40238726007709377354370243392300398...
>>> factorial(10000)
28462596809170545189064132121198688...
```

This function only uses a single frame, and can easily handle values of `n` ten
times larger than the largest value handled by our recursive version.

## Iterative recursion

Consider what happens when the interpreter executes `factorial(4)`.

```python
factorial(4)
4 * factorial(3)
4 * 3 * factorial(2)
4 * 3 * 2 * factorial(1)
4 * 3 * 2 * 1
24
```

We see that a chain of deferred operations builds up. The total isn't
calculated until the base case of `n = 1` is hit. The interpreter must keep
track of operations which must be performed later.

If we reformulate the factorial function:

```python
>>> def factorial_new(n, total):
        if n == 1:
            return total
        else:
            return factorial_new(n - 1, n * total)
>>> factorial(4, 1)  # initial total = 1
```

And reconsider what the interpreter does:

```python
factorial_new(4, 1)
factorial_new(3, 4)
factorial_new(2, 12)
factorial_new(1, 24)
24
```

We see a flat sequence of calls to `factorial()`. The state is stored in the
variable `total`, not by the interpreter.

## Tail recursion

In tail-recursive languages, recursive procedures defined in the second way are
interpreted as *iterative* processes, and do not exhibit the downsides of
recursive processes. You get the performance benefits of an iterative process,
with the elegance of a recursive procedure.

Unfortunately, Python is not a tail-recursive language, so 
`factorial_new(1000)` still throws `RuntimeError: maximum recursion depth 
exceeded`.

For more information, I recommend section `1.2.1` of SICP.

---

[^maxrecursion]: The maximum recursion limit can be set in Python with
    `sys.setrecursionlimit()` but it's generally not advised. Functions which
    recurse that far down should probably be rewritten to use an iterative
    process.
