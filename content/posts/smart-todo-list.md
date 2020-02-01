---
title: "A scheduling todo list"
date: '2020-02-01'
layout: post
draft: true
---

Todo lists store a list of things you need to do, but don't offer any advice on the order in which to tackle the tasks. This system works well - it's simple, and people are generally pretty good at quickly working out what to work on next. However, I've noticed a couple of issues with the system:

1. When there are lots of tasks, working out what to work on next can be complicated. This is especially true if there are multiple constraints on each task - for example if each task has a deadline and priority
2. There are certain tasks which I easy tasks, which I irrationally avoid. For example, I don't particularly like replying to email, so I avoid it, even though it won't take me long to do. 
3. Context switching / decision fatigue. Once you finish a task, you need to work out what to work on next, which requires an amount of thinking and can break your focus.

I think we could solve these issues with a 'smart' todo list which tells you what to work on next. An algorithm run by a computer would run basically instantly, and would remove the need for the user to make any decisions, solving 1) and 3). It also wouldn't have any biases against types of task, so wouldn't be caught out by 2). To do this, we'd need to give the todo list more information about each task than we currently do.

In the rest of this post, we'll design a scheduling todo list.

## Goal

The goal of our todo list is return 

## A first version

I think the smallest amount of information we need about each task is:

1. How long the task will take to complete (roughly)
2. When the task is due

With this information, we want to put the tasks in an order which means that each one is done by the time its due. There will be lists of tasks where it's impossible to complete each of them by their due date, and others where there are multiple valid orderings.


## User experience considerations
