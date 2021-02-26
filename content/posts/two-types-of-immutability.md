---
title: "Two types of immutability"
date: 2021-01-26T18:40:11Z
draft: true
---

I've been implementing a programming language recently, which has led me to
notice two distinct forms of immutability which crop up in the context of
programming languages. Let's look at an example.

In this piece of JavaScript, we have a 'value' `1`, being bound to an
'identifier', `a`.

```javascript
let a = 1;
```

The naming for these varies (e.g. `a` might be called a 'variable'), but the
concept is the same.

The two distinct forms of immutability are:

1. Identifier binding immutability
2. Value immutability

JavaScript's `const` keyword highlights this:

```javascript
const a = 1;
a = 2; // Uncaught TypeError: invalid assignment to const 'a'

const l = [];
l.push(1); // [1]
```

Here, the `const` keyword creates an immutable identifier binding. After `a` is
bound to the value 1, it's an error to try to assign it to anything else.
However, `const` doesn't mean that the value is immutable. The second statements
show this - the Array is still mutable.

Let's look at the implications of each.

## Identifier binding immutability

This prevents the value of an identifier from changing 'underneath you', leading
to bugs where you expect the value of an identifier to be different to what it
actually is.

This can happen in synchronous code, and underpins the suspicion a lot of
developers have for global variables:

```javascript
function f() {
  a = 2;
}

let a = 1;
f();
console.log(a); // 2
```

This example is obviously contrived, but it hints at the issue; when anything
can change the value of an identifier, it can be hard to reason about a program.
This issue becomes a lot more apparent when we introduce concurrency. With
multiple threads running at once, it becomes impossible to deterministically
reason about what the value of a mutated global variable could be.

## Value immutability

In the example above, we saw that JavaScript's arrays are mutable. Operations
like `push` change the array itself. An alternate way of structuring these
operations is to have them return a new version of data structure, rather than
changing the existing one. Interestingly, the JavaScript Array method `concat`
does this already:

```javascript
let list = [1, 2, 3];
let list2 = list.concat(4);
console.log(list2); // [1, 2, 3, 4]
console.log(list1); // [1, 2, 3]
```

JavaScript's Array has some methods which mutate it, but you could imagine a
data structure where all methods return the new version.

### Mutability and equality

Mutable data structures present a problem when it comes to equality. There are
two possible possible definitions we could use:

1. The structures are equal if they refer to the same data structure in memory
2. The structures are equal if they contain the same items

There's a difference here introduced by mutability. In the first case, if you
mutate one, the statement will remain equal (because), but in the second, they
won't.

For two mutable data structures to be equal, should just they contain the same
items, or should

Again, let's look at JavaScript:

```javascript
let a = [1, 2, 3];
let b = [1, 2, 3];
console.log(a === b); // false
```

Here, these two arrays aren't equal,

An interesting property of languages where all values are immutable is that it
simplifies calculating equality. If you
