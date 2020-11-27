# Documentation

This is 'private' documentation about how parts of this website. By private, I
mean I'm writing it for my future self, to document how parts of it I don't
touch often work. As such, it might be sparse or incomplete.

## P5

Include both P5 and the sketch JS files by adding this to the post's front
matter:

```yaml
scripts:
    - "/js/p5-v1-1-9.min.js"
    - "/js/terazzo.js"
```

P5 sketches should be written in instance mode:

```javascript
new P5(sketch, "mySketch");

function sketch(p) {
  p.setup = function() {
    // TODO
  };
}
```

And inserted into the post with a div with a matching ID:

```html
<div id="mySketch"></div>
```
