---
layout: post
title: "Slingshot: an interplanetary physics game"
---

Over the weekend, Recurse Center held a [game jam](https://en.wikipedia.org/wiki/Game_jam). Over 72 hours, I built a phyics game named Slingshot. In the game, you play the pilot of a spaceship with little fuel. To survive, you must navigate around planets and neutron stars to reach a series of checkpoints. You can play Slingshot [here](https://slingshot.jamesroutley.co.uk/), and view the source code [here](https://github.com/jamesroutley/slingshot).

This post describes how the game is implemented.

## Drawing

All drawing was done using the [P5.js](https://p5js.org/) library. P5 offers a clean API for drawing on HTML canvasses. A basic P5 sketch can be created with the following code:

```javascript
const start = (p) => {
    p.setup = () => {
        // Code that is run once, at sketch initialisation
        p.createCanvas(700, 700);
    };
    p.draw = () => {
        // Code that is run at every frame of the sketch
        // Render upcoming elements in black
        p.fill('#000000');
        // Draw a 5x5 square at coordinate (10, 10)
        p.rect(10, 10, 5, 5);
    };
};
new p5(start);
```

This simple setup makes it easy to start drawing and animating with P5. `p.draw()` is called every frame, so it's possible to animate things by changing the coordinate that they're rendered at:

```javascript
let xCoord = 10;
p.draw = () => {
    p.rect(xCoord, 10, 5, 5);
    xCoord += 1;
}
```

## Physics

To animate the spaceship, we must calculate its position at each frame. Slingshot uses a custom [physics engine](https://github.com/jamesroutley/slingshot/blob/master/src/physics.js) to do this. The physics is all Newtonian (i.e. doesn't take relativity into account), and is relatively simple to calculate. As the spaceship is the only moving thing[^1], all we need to calculate is its position  

At each frame perform the following calculations[^2]:

- Calculate the force on the spaceship. `force = gravitational pull from planets + force from booster`.
- Calculate the acceleration experienced by the spaceship. `acceleration = force / mass of spaceship`.
- Calculate the velocity of experienced by the spaceship. `velocity = previous velocity + acceleration / frame rate`.
- Calculate the new position of the spaceship. `position = previous position + velocity / frame rate`.

We then draw the spaceship at this new position. With a high enough frame rate (>= 30), the spaceship appears to move.

## Game engine

Slingshot consists of multiple views:

- title
- menu
- levels (where actual gameplay takes place)
- level complete
- level failed

Each of these views are independent, and I wanted them to be implemented independently. P5 doesn't natively support switching between sketches, so I built a rough game engine handle the switching. Although the code works, it is quite [hacky](https://github.com/jamesroutley/slingshot/blob/ea6f228f596dfb7788d5939da5a73c2e0036904f/src/view.js#L72). I'm also unhappy with how sketches are switched. Currently, a sketch implements the code which
switches to the next sketch. I feel this breaks the principal of separation of concerns. Each sketch should implement the code which displays that sketch, not the code which switches between game states. At some point, I'd like to pull the game state switching code out.

## Deployment

As the game is implemented entirely in client-side javascript, the game is deployed as a static website to AWS S3.

---

[^1]: Some planets also move, but this doesn't change the force calculation for the spaceship at a particular point in time.
[^2]: As Slingshot is a 2D game, force, acceleration, velocity and position are represented as 2D vectors.
