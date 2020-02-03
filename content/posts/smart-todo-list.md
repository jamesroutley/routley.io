---
title: "Thoughts on a scheduling todo list"
date: "2020-02-02"
layout: post
---

## Some issues with todo lists

Todo lists store a number of tasks, but don't offer any advice on which order to
tackle the tasks in. This system works well - it's simple, and people are
generally pretty good at quickly working out what to work on next. However, I've
noticed a couple of issues with the system:

1. When there are lots of tasks, working out the next task can be complicated.
   This is especially true if there are multiple constraints on each task - for
   example if each task has a deadline and priority
2. There are certain easy tasks which I irrationally avoid. For example, I don't
   particularly like replying to email so I avoid it, even though it won't take
   me long to do.
3. Context switching / decision fatigue. Once you finish a task, you need to
   work out what to work on next, which requires an amount of thinking and can
   break your focus.

## A scheduling todo list

I think we could solve these issues with a 'smart' todo list which tells you
what to work on next. An algorithm run by a computer would run basically
instantly, and would remove the need for the user to make any decisions,
solving 1) and 3). It also wouldn't have any biases against types of task, so
wouldn't be caught out by 2).

The goal of this todo list is to put a list of tasks in an order which they
should be tackled. This order should mostly match the order that the user would
put them in.

## Missing context

With a normal todo list, the user understands the context of each task, and uses
this context to decide what to do next. There are many different types of
context, but common ones include:

- How long the task will take to complete
- When the task is due
- When the task can be started
- Whether the task is blocked by another task
- How important the task is
- Location - some tasks e.g. doing laundry can only be done in certain places
- Home/work tasks - you might not want to do a home tasks when you're at work

This smart todo list would need to collect this sort of context about each task
to correctly order the tasks.

## Working out the order

Once we've got the context of each task, we need to order them. I think this is
a complex problem, which I haven't thought through deeply. Some initial
thoughts:

- The tasks' contexts give you some constraints that must be solved if possible.
  For example:
  - Tasks should be scheduled so there's enough time to complete them before
    their due date
  - Tasks with a location can only be worked on if you're at that location
  - If a task is blocked, it can't be scheduled until it's unblocked
- The tasks' context also give you some nice-to-haves. E.g:
  - If there are two tasks with the same due date, you should put the higher
    priority one first
  - If there are two tasks with the same priority and due date, you could
    schedule the shorter one first
- We won't be able to satisfy all constraints for some lists. For example, there
  might not be enough time to complete all tasks before they're due
- Some lists might have multiple 'correct' orders, where all tasks are
  completable before they're due

## User experience

- In my experience, users don't like products which are hard to understand or
  feel in control of. Our todo list should present the ordered list of tasks to
  the user, but untimately let them reorder things if they want to
- For our smart todo list to work, the user has to enter a greater amount of
  context than with a normal todo list. This takes time, and might take longer
  than the time saved
- I think less tech is generally a good thing - normal todo lists work anywhere
  where someone can write something down, but our version requires a computer

## Conclusion

Having thought through things, I'm not sure if the saved time justifies the
extra complexity for most people's todo lists. As mentioned in the first
section, working out what to do next is a harder problem when there are lots of
tasks. A scheduling todo list might make more sense in scenarios with lots of
tasks, like a todo list shared between members of a team, or strict time
constraints, like when cooking lots of things at once.
