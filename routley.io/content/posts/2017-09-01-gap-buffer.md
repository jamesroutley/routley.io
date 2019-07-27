---
aliases:
- /tech/2017/09/01/gap-buffer
date: '2017-09-01'
layout: post
title: 'Gap Buffers: a data structure for editable text'
---

I've recently been writing a text editor. One of the first problems I faced was
deciding how to store the contents of the file being edited. This post looks at
gap buffers, the data structure I ended up using.

## Problem

We wish to find a data structure which supports the following operations:

- Insert or delete a character at column `x`, row `y`
- Insert or delete the column `x`

## A naive solution: array of strings

The simplest way to represent text is with an array of strings. As strings are
just arrays of characters, we're really storing a 2D array of characters. 

However, we see that it has poor performance for the insert and delete
operations. If we want to insert or delete a character, we have to shift every
character that comes after it one position over. 

```python
['h', 'e', 'y']
    \    \    \
['t', 'h', 'e', 'y']
```

Given a body of text with a lines of length `n`, inserting a character at
position 0 would require moving `n` characters over, giving insert a time
complexity of `O(n)`. 

Similarly, inserting and deleting rows all have linear time performance.

## Gap Buffer

A [gap buffer](https://en.wikipedia.org/wiki/Gap_buffer) is a simple extension
of the array of strings which can improve inserts and deletes, when they are
clustered in the same location.

Gap buffers are an array of characters and empty spaces (the gap):

```python
['t', 'e', 'n', '_', '_', '_', '_', '_', '_']
```

The gap can be kept track of by storing the index of the start and the end of
the gap. Often, the start index points to the first character in the gap, and
the end index points to the first character *after* the gap:

```python
['t', 'e', 'n', '_', '_', '_', '_', '_', '_']
                 ^ start                       ^ end
```

### Insert

Say we want to insert the character `h` at position `1`. We move the gap to the
insert position:

```python
['t', '_', '_', '_', '_', '_', '_', 'e', 'n']
```

We then insert the letter, decreasing the size of the gap:

```python
['t', 'h', '_', '_', '_', '_', '_', 'e', 'n']
```

At first, this doesn't seem to be much better than the array of strings. To
insert, we must still shift characters around. However, we see the benefit
when we continue to insert letters:

```python
['t', 'h', '_', '_', '_', '_', '_', 'e', 'n']
['t', 'h', 'i', '_', '_', '_', '_', 'e', 'n']
['t', 'h', 'i', 'r', '_', '_', '_', 'e', 'n']
['t', 'h', 'i', 'r', 't', '_', '_', 'e', 'n']
['t', 'h', 'i', 'r', 't', 'e', '_', 'e', 'n']
```

Once the gap is in the correct position, it is cheap (`O(1)`) to insert further
letters. Luckily, this pattern of inserts is common in text editing.

### Delete

Deleting characters behaves similarly. Move the gap to the delete position, then
increase the size of the gap by 1. 
 
```python
['t', 'h', '_', '_', '_', '_', '_', 'e', 'n']
            ^ start                  ^ end
['t', 'h', '_', '_', '_', '_', '_', 'e', 'n']
       ^ start                       ^ end
```

Note that we don't have to change the value
of the deleted character. Simply increasing the size of the gap is enough.

### Expanding the gap

If enough characters are added, a gap buffer can become full. To add more, we
need to increase the size of the gap. This happens in `O(n)` time, where `n` is
the number of characters in the gap buffer. In practice, these expansions happen
infrequently, so the cost is
[amortised](https://stackoverflow.com/questions/200384/constant-amortized-time/)
over all the insert operations.

### Rows

To deal with rows, we can store the lines in a secondary gap buffer, which
allows us to easily insert and delete lines.

## Conclusion

Gap Buffers offer a simple, decent solution to the problem of storing editable
text. They are not quite as performant as others, such as
[ropes](https://en.wikipedia.org/wiki/Rope_(data_structure)), but are
considerably simpler to implement, and should be adequate for most situations.


