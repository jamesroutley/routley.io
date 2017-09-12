---
layout: post 
title: How text editors store text
--- 

I've recently been writing a text editor. One of the first problems I faced was
deciding how to store the contents of the file being edited.

There are actually three representations of the text we need to consider.

1. How it is stored on disk
2. How it is stored in memory as we're editing it
3. How it is displayed on screen

This post explores how to efficiently do 2, but we will see that our decisions
here will also affect 3. TODO: think of nouns

## Problem

We wish to find a data structure which supports the following operations:

- Insert a character at row `x`, column `y`
- Delete the character at `(x, y)`
- Insert a new line at row `x`
- Delete the row at `x`
- Initialise the data structure from a newline separated string
- Return a newline separated string of the stored text

## Array of strings

The simplest way to represent text is with an array of strings. As strings are
just arrays of characters, we're really storing a 2D array of characters. This
data structure offers a naive solution to the problem. Most programming
languages have built in array and string data structures. Initialising the data
structure and returning a newline separated string are simple.

However, we see that it has poor performance for the insert and delete
operations. If we want to insert a character, we have to shift every character
that comes after it one position over. Given a body of text with a lines of
length `n`, inserting a character at position 0 would require moving `n`
characters over, giving insert a time complexity of `O(n)`.  Similarly, deleting
characters, and inserting and deleting nodes all have linear time performance.

## Gap Buffer

A [gap buffer](https://en.wikipedia.org/wiki/Gap_buffer) is a simple extension
of the array of strings which can improve inserts and deletes, when they are
clustered in the same location.

Gap buffers are an array of characters and empty spaces (the gap):

```
['t', 'e', 'n', '_', '_', '_', '_', '_', '_']
```

Say we want to insert the character `h` at position `1`. We move the gap to the
insert position:

```
['t', '_', '_', '_', '_', '_', '_', 'e', 'n']
```

We then insert the letter, decreasing the size of the gap:

```
['t', 'h', '_', '_', '_', '_', '_', 'e', 'n']
```

At first, this doesn't seem to be much better than the array of strings. To
insert, we must still shift characters around. However, we soon see the benefit
when we continue to insert letters:

```
['t', 'h', '_', '_', '_', '_', '_', 'e', 'n']
['t', 'h', 'i', '_', '_', '_', '_', 'e', 'n']
['t', 'h', 'i', 'r', '_', '_', '_', 'e', 'n']
['t', 'h', 'i', 'r', 't', '_', '_', 'e', 'n']
['t', 'h', 'i', 'r', 't', 'e', '_', 'e', 'n']
```

Once the gap is in the correct position, it is very cheap (`O(1)`) to insert
further letters. Luckily for us, this pattern of inserts is common in text
editing.



