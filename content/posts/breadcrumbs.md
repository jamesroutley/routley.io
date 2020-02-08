---
title: "Breadcrumbs"
date: 2020-02-07T23:57:10Z
---

I just implemented breadcrumb navigation for this blog. How it works is quite
neat - we iterate over the sections of the path, and store our current position
using a Hugo `Scratch` variable:

```html
<nav>
  <ul>
    <!-- Initialise a scratch variable "path" to an empty string -->
    {{ $.Scratch.Set "path" "" }}
    <li><a href="/">Home</a></li>
    <!-- For each non-empty item in the URL path -->
    {{ range $element := split .RelPermalink "/" }}{{ if ne $element "" }}
    <!-- Add the element to the scratch variable -->
    {{ $.Scratch.Add "path" "/" }}{{ $.Scratch.Add "path" $element }}
    <!-- Populate the href from the scratch variable -->
    <li><a href="{{ $.Scratch.Get "path" }}">{{ humanize . }}</a></li>
    {{ end }}{{ end }}
  </ul>
</nav>
```

I'd always thought of templating as a stateless thing, but using a stateful
variable makes this problem intuitive to solve if you're used to programming in
stateful languages.
