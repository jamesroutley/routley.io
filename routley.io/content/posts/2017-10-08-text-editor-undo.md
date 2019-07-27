---
layout: post
title: "Implementing 'undo' in a text editor"
tags:
    - algorithms
---

This post explores an elegant method for implementing undo/redo functionality in
text editors.

## Problem

We wish to implement functionality that allows the user of a text editor to undo
their last action. If they accidentally undo an action, we want to let them redo
it.

For the purposes of this post, let's assume that a text editor makes edits to a
`text` object. This `text` object is an array of string pointers[^pointer],
with each string representing a line of text[^gap-buffer].

## A solution

This technique for implementing undo is simple, but requires that the text
editor is written so that all edit commands are immutable. Immutability means
that the edit commands won't change the `text` object, but will return a copy of
the `text`, with the changes made to it. If we store each of these text objects
(let's call them 'states'), we can undo by reverting the text to the previous
version.

Making a full copy of the `text` object on every edit would be wasteful. We can
make things better by copying pointers, rather than full objects. 

## Example

Consider a document which contains the text:

```
Hello
world
```

Let's assume this is stored in an array of pointers to strings. Our strings are
stored at two locations in memory[^memory]:

```
0: "Hello"
1: "world"
```

Our array contains pointers to those memory locations:

```c
[*0, *1]
```

When we make an edit, we create a new array of strings, where all pointers are
the same, apart from the edited one:

```
0: "Hello"
1: "world"
2: "James"
```

```python
[*0, *2]
```

The trick to implementing undo is to realise that our previous array, containing
the string `"Hello\nworld"` still exists. To undo our changes, we simply revert
to the previous array.


## (In)finite history 

To implement infinite history, we store the states in a linked list. To undo, we
move back a state. To redo, we move forward a state. Infinite undo history can
take up an unbounded amount of memory, and with high enough usage will cause the
program to crash.

To implement finite undo, we must store the states in a doubly linked list. We
keep track of the length of the list by incrementing a counter whenever a new
state is added to the list. We decrement this counter on undo and increment it
again on redo. If the length exceeds some predefined limit, we delete the state
from the tail end of the list.

## Garbage collection

When deleting the oldest state, we need to be careful to make sure we don't
delete any strings which are reused by other states. In a garbage collected
language, this is managed by the runtime. 

We remove the state from our linked list. Because it is no longer used, it can
be deleted. The strings that are only used in that state can also be deleted.
Strings used in other states are kept.

This technique can be used in non-garbage collected languages, but this
object management must be done manually. 

---

[^pointer]: This technique doesn't actually require a language with pointers;
    Pointers just offer a convenient notation for this example.

[^gap-buffer]: This isn't actually a good way to store text in a text editor.
    For a better solution, see a post I wrote about [gap
    buffers](/tech/2017/09/01/gap-buffer.html).

[^memory]: Note that the memory addresses in this example have been simplified
    for the sake of clarity and don't make physical sense.
