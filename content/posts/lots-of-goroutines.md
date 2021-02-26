---
title: "Spinning up lots of Goroutines"
date: 2020-02-18T21:21:11Z
---

Go's Goroutines are described as 'lightweight threads'. Because they're more
lightweight, you can create many more of them than threads. What happens if we
create loads of them?

## Unbounded goroutines

Let's write a program which creates an unbounded number of goroutines:

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	i := 1
	for {
		if i%1000 == 0 {
			fmt.Printf("spawning goroutine %d\n", i)
		}
		go work()
		i++
	}
}

func work() {
	time.Sleep(time.Hour * 24 * 100)
}
```

```
spawning goroutine 38970000
spawning goroutine 38971000
spawning goroutine 38972000
^C^Csignal: interrupt
```
