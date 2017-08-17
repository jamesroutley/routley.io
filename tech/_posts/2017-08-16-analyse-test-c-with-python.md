---
layout: post
title: "Analyse and test C with Python"
---

I've recently been implementing data structures in C. Writing C is fun and
educational, because it's lower level than most other common languages. It's
fast, and writing it teaches you to understand what's happening at a machine
level. 

However, C is also relatively difficult to write, making it harder to analyse
and test. It would be helpful to be able to do this with a higher level
language, such as Python. Analysis and testing don't affect performance of the
actual data structure, so using a slower but easier and more productive language
for this seems reasonable.

In this article, we walk though a simple example of doing this with a built-in
Python library for interfacing with C called `ctypes`.

## Example C code

For this example, I've written a simple (but unsafe)
[stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)) data
structure, which defines the following API:

```c
// stack.h
typedef struct {
    int stk[100];
    int top;
} stack;

void stack_push(stack* s, int x);
int stack_pop(stack* s);
```

The stack's source code is included below[^1].

## Shared library

`ctypes` interacts with with shared libraries. We can compile our stack to a
shared library with:

```
$ clang -shared -o stack.so -fPIC stack.c
```

## Python wrapper

Next, we need to define a wrapper module[^2], which creates the Python objects used
to interact with the shared library.

```python
# stack_wrapper.py
import ctypes

class stack(ctypes.Structure):
    _fields_ = [
        ("stk", ctypes.c_int*100),
        ("top", ctypes.c_int),
    ]

_lib = ctypes.cdll.LoadLibrary("stack.so")

new = _lib.stack_new
new.restype = ctypes.POINTER(stack)

push = _lib.stack_push
push.argtypes = [ctypes.POINTER(stack), ctypes.c_int]

pop = _lib.stack_pop
pop.restype = ctypes.c_int
pop.argtypes = [ctypes.POINTER(stack)]
```

**Note**: It seems idiomatic from examples in the Python documentation to use
the global import `from ctypes import *` to reduce code verbosity. I haven't
done this here to make it clear what objects come from `ctypes`.

## Use

It's now simple to import and use this module:

```python
>>> import stack_wrapper as stack
>>> s = stack.new()
>>> stack.push(s, 5)
>>> stack.push(s, 15)
>>> stack.pop(s)
15
>>> stack.pop(s)
5
```

We're now fully in Python land, with a set of objects which let us call into our C code. These objects are native Python, and can be used in any way that native Python objects can be used. We can use them with:

- `unittest` or `pytest` for testing
- `timeit` for benchmarking
- `bokeh` or `matplotlib` for analytics
- `AFL` for fuzz testing

---

[^1]: **Warning**: This stack implementation was written to be as simple as
    possible, and isn't really safe to use.

    ```c
    // stack.c
    #include <stdlib.h>
    #include "stack.h"

    stack* stack_new() {
        stack* s = malloc(sizeof(stack));
        s->top = -1;
        return s;
    }

    void stack_push(stack* s, int x) {
        s->top++;
        s->stk[s->top] = x;
    }

    int stack_pop(stack* s) {
        int x = s->stk[s->top];
        s->top--;
        return x;
    }
    ```

[^2]: When using `ctypes`, we end up writing a Python wrapper module, which is
    basically a Python translation of the C header file. Other libraries for
    calling into C try to remove this repeatition. One example is
    [`cffi`](https://cffi.readthedocs.io/en/latest/), written by the PyPy team.
