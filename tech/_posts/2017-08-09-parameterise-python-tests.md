---
layout: post
title: "Improve python testing with parameterisation"
tags:
    - python
    - tdd
---

Parameterisation is a technique which makes testing simpler, more concise and
more effective. It does this by separating test logic from test data. Let's
consider a test for a simple function, and how it can be improved by
parameterisation.

## Simple test

Let's test the following function:

```python
# prime.py
import math


def is_prime(x):
    """
    is_prime returns True or False indicating whether x is prime or not.
    """
    if x <= 1:
        return False
    for i in range(2, int(math.sqrt(x))):
        if x % i == 0:
            return False
    return True
```

We can test this for a range of inputs with the following code:

```python
# test_prime.py
import unittest

from prime import is_prime


class TestIsPrime(unittest.TestCase):

    def test_x_negative(self):
        self.assertEqual(is_prime(-1), False)

    def test_x_zero(self):
        self.assertEqual(is_prime(0), False)

    def test_x_one(self):
        self.assertEqual(is_prime(1), False)

    def test_x_two(self):
        self.assertEqual(is_prime(2), True)

    def test_x_three(self):
        self.assertEqual(is_prime(3), True)

    def test_x_ten(self):
        self.assertEqual(is_prime(10), False)

    def test_x_fifty_three(self):
        self.assertEqual(is_prime(53), True)


if __name__ == "__main__":
    unittest.main()
```

We run the tests with:

```sh
$ python test_prime.py
Ran 7 tests in 0.000s

OK
```

All our tests pass, but our test code is verbose. Although each test is
basically the same, we need to add a new method for each one. There is a lot
of repeated boilerplate code.

## Parameterisation

We can reduce this boilerplate by parameterising the tests:

```python
# test_prime.py
import unittest

from prime import is_prime


class TestIsPrime(unittest.TestCase):

    def test_is_prime(self):
        test_cases = [
            (-1, False),
            (0, False),
            (1, False),
            (2, True),
            (3, True),
            (10, False),
            (53, True),
        ]
        for x, output in test_cases:
            self.assertEqual(is_prime(x), output)


if __name__ == "__main__":
    unittest.main()
```

We've extracted the test data into the `test_cases` variable. The test logic is
then run on each of the test cases in turn. This is an improvement, but still
has some flaws. When we run the test, we get the following output:

```sh
% python test_prime.py
Ran 1 test in 0.000s

OK
```

The test output says we're running one test, even though we still have seven
test cases. Even worse, if one of our tests fails, we aren't given any
information on which test failed:

```sh
$ python test_prime.py
F
======================================================================
FAIL: test_is_prime (__main__.TestIsPrime)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test_prime_parameterised.py", line 19, in test_is_prime
    self.assertEqual(is_prime(x), output)
AssertionError: True != False

----------------------------------------------------------------------
Ran 1 test in 0.000s

FAILED (failures=1)
```

## Parameterisation with pytest

The [pytest](https://docs.pytest.org/en/latest/) framework solves these problems
for us. We can install it with `pip install pytest`.

Pytest contains a [feature](https://docs.pytest.org/en/latest/parametrize.html)
which allows us to parameterise test cases:

```python
# test_prime.py
import pytest

from prime import is_prime


@pytest.mark.parametrize("x,output", [
    (-1, False),
    (0, False),
    (1, False),
    (2, True),
    (3, True),
    (10, False),
    (53, True),
])
def test_is_prime(x, output):
    assert is_prime(x) == output
```

Parameterisation is implemented with the `pytest.mark.parametrize` decorator.
This decorator takes two arguments. The first is a comma separated string of the
names given to the test cases defined in the second argument. The second
argument is a list of tuples. Each tuple contains the data needed for a test
case.

The decorator makes seven separate calls to `test_is_prime`, supplying each of
the test cases in turn. When we run the tests, we see that seven tests are run:

```sh
$ pytest test_prime_pytest.py
test_prime_pytest.py .......

7 passed in 0.02 seconds
```

Importantly, when a test fails, pytest gives us information about which test
failed:

```sh
$ pytest test_prime.py
test_prime_pytest.py ...F...

FAILURES
test_is_prime[2-False]

x = 2, output = False

>       assert is_prime(x) == output
E       assert True == False
E        +  where True = is_prime(2)

test_prime_pytest.py:16: AssertionError
1 failed, 6 passed in 0.04 seconds
```

## Conclusion

Parameterising tests is a powerful technique. By separating test logic from
data, the focus is shifted away from boilerplate code and onto testing features.
It becomes trivial to add new test cases.

Parameterised tests work best with pure functions. A pure function is a
function which satisfies the following constraints:

- Its return value is determined exclusively by the input values (e.g.. it
  doesn't use global or object variables)
- Its execution doesn't cause any side effects (e.g. it doesn't print or write
  data to a file)

A pure function's behaviour depends only on the arguments passed to it, so they
can often be exhaustively tested with a single parameterised test.
