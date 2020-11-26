new p5(terazzo, "terazzo");
new p5(threeIdealChips, "threeIdealChips");
new p5(pathWalking, "pathWalking");
new p5(pathWalkingBad, "pathWalkingBad");
new p5(chipGeneration, "chipGeneration");
new p5(circleIntersection, "circleIntersection");
new p5(chipPlacement, "chipPlacement");

function terazzo(p) {
  // 24 = 2 * default <body> padding
  let width = p.min(700, p.displayWidth - 24);
  const height = 400;
  const minGap = 5;

  p.windowResized = function () {
    width = p.min(700, p.displayWidth - 24);
    p.resizeCanvas(width, height);
  };

  p.setup = function () {
    p.frameRate(1);
    p.angleMode(p.DEGREES);
    p.noStroke();

    const seed = Math.floor(p.random(1000000));
    p.randomSeed(seed);

    p.createCanvas(width, height);

    drawTerazzo();
  };

  p.draw = function () {
    if (p.frameCount % 3 !== 0) {
      return;
    }
    drawTerazzo();
  };

  function drawTerazzo() {
    p.clear();
    chips = [];

    for (let i = 0; i < 500; i++) {
      // Propose a chip location. We check if it intersects with an existing
      // chip, and repeat if it does
      const chip = {
        x: p.random(width),
        y: p.random(height),
        radius: p.random(5, 30),
      };

      function chipIntersects() {
        for (other of chips) {
          if (
            p.dist(other.x, other.y, chip.x, chip.y) <
            other.radius + chip.radius + minGap
          ) {
            return true;
          }
        }
        return false;
      }

      if (chipIntersects()) {
        continue;
      }

      // Doesn't intersect - draw chip
      chips.push(chip);

      const colour = p.random(["#f8bbd0", "#b2ebf2", "#ffecb3", "#b0bec5"]);
      p.fill(colour);

      drawChip(p, chip.x, chip.y, chip.radius);
    }
  }
}

function threeIdealChips(p) {
  const width = 370;
  const height = 200;
  const y = height / 2;

  p.setup = function () {
    p.createCanvas(width, height);
    p.angleMode(p.DEGREES);
    p.frameRate(1);
    p.translate(width / 2, height / 2);
    drawChips();
  };

  p.draw = function () {
    if (p.frameCount % 2 !== 0) {
      return;
    }
    p.translate(width / 2, height / 2);
    p.clear();
    drawChips();
  };

  function drawChips() {
    drawChip(p, -120, 0, 42);
    drawChip(p, 0, 0, 42);
    drawChip(p, 120, 0, 42);
  }
}

function pathWalking(p) {
  const width = 305;
  const height = 305;
  const radius = 150;

  const points = [
    { x: 50, y: 50 },
    { x: 150, y: 70 },
    { x: 200, y: 250 },
    { x: 40, y: 100 },
  ];

  p.setup = function () {
    p.frameRate(1);
    p.createCanvas(width, height);
    p.fill(0);

    p.circle(points[0].x, points[0].y, 5);
  };

  p.draw = function () {
    const frame = p.frameCount % 5;

    // A bit annoying to have to explicitly declare these, but I think all
    // these switch cases share a scope.
    let pointA, pointB;

    switch (frame) {
      case 0:
        p.clear();
        p.circle(points[0].x, points[0].y, 5);
        return;
      case 1:
        pointA = points[0];
        pointB = points[1];
        p.circle(pointB.x, pointB.y, 5);
        p.line(pointA.x, pointA.y, pointB.x, pointB.y);
        return;
      case 2:
        pointA = points[1];
        pointB = points[2];
        p.circle(pointB.x, pointB.y, 5);
        p.line(pointA.x, pointA.y, pointB.x, pointB.y);
        return;
      case 3:
        pointA = points[2];
        pointB = points[3];
        p.circle(pointB.x, pointB.y, 5);
        p.line(pointA.x, pointA.y, pointB.x, pointB.y);
        return;
      case 4:
        pointA = points[3];
        pointB = points[0];
        p.circle(pointB.x, pointB.y, 5);
        p.line(pointA.x, pointA.y, pointB.x, pointB.y);
        return;
    }
  };
}

function pathWalkingBad(p) {
  const width = 305;
  const height = 305;
  const radius = 150;

  const points = [
    { x: 50, y: 50 },
    { x: 200, y: 250 },
    { x: 40, y: 150 },
    { x: 150, y: 70 },
  ];

  p.setup = function () {
    p.frameRate(1);
    p.createCanvas(width, height);
    p.fill(0);

    p.circle(points[0].x, points[0].y, 5);
  };

  p.draw = function () {
    const frame = p.frameCount % 5;

    // A bit annoying to have to explicitly declare these, but I think all
    // these switch cases share a scope.
    let pointA, pointB;

    switch (frame) {
      case 0:
        p.clear();
        p.circle(points[0].x, points[0].y, 5);
        return;
      case 1:
        pointA = points[0];
        pointB = points[1];
        p.circle(pointB.x, pointB.y, 5);
        p.line(pointA.x, pointA.y, pointB.x, pointB.y);
        return;
      case 2:
        pointA = points[1];
        pointB = points[2];
        p.circle(pointB.x, pointB.y, 5);
        p.line(pointA.x, pointA.y, pointB.x, pointB.y);
        return;
      case 3:
        pointA = points[2];
        pointB = points[3];
        p.circle(pointB.x, pointB.y, 5);
        p.line(pointA.x, pointA.y, pointB.x, pointB.y);
        return;
      case 4:
        pointA = points[3];
        pointB = points[0];
        p.circle(pointB.x, pointB.y, 5);
        p.line(pointA.x, pointA.y, pointB.x, pointB.y);
        return;
    }
  };
}

function chipGeneration(p) {
  const width = 305;
  const height = 305;
  const radius = 150;

  const angles = [15, 100, 200, 345];

  p.setup = function () {
    p.frameRate(1);
    p.createCanvas(width, height);
    p.angleMode(p.DEGREES);
    p.translate(width / 2, height / 2);

    // Draw the zeroth frame on the initial render. This frame isn't drawn the
    // first time p.draw is called because frameCount starts at 1
    draw1();
  };

  p.draw = function () {
    p.translate(width / 2, height / 2);
    const frame = p.frameCount % 11;

    switch (frame) {
      case 0:
        p.clear();
        draw1();
        return;
      case 1:
        drawAngle(angles[0]);
        return;
      case 2:
        drawAngle(angles[1]);
        return;
      case 3:
        drawAngle(angles[2]);
        return;
      case 4:
        drawAngle(angles[3]);
        return;
      case 5:
        drawLine(angles[0], angles[1]);
        return;
      case 6:
        drawLine(angles[1], angles[2]);
        return;
      case 7:
        drawLine(angles[2], angles[3]);
        return;
      case 8:
        drawLine(angles[3], angles[0]);
        return;
      case 9:
      // fallthrough
      case 10:
        p.clear();
        drawLine(angles[0], angles[1]);
        drawLine(angles[1], angles[2]);
        drawLine(angles[2], angles[3]);
        drawLine(angles[3], angles[0]);
        return;
    }
  };

  function draw1() {
    p.push();
    p.drawingContext.setLineDash([5, 15]);
    p.circle(0, 0, radius * 2);
    p.line(0, 0, 0, -200);
    p.pop();
  }

  function drawAngle(angle) {
    p.push();
    p.drawingContext.setLineDash([3, 6]);
    const point = {
      x: radius * p.cos(angle - 90),
      y: radius * p.sin(angle - 90),
    };
    p.line(0, 0, point.x, point.y);
    p.fill(0);
    p.circle(point.x, point.y, 5);
    p.pop();
  }

  function drawLine(angle1, angle2) {
    p.push();
    // TODO: pull this into a function
    const point1 = {
      x: radius * p.cos(angle1 - 90),
      y: radius * p.sin(angle1 - 90),
    };
    const point2 = {
      x: radius * p.cos(angle2 - 90),
      y: radius * p.sin(angle2 - 90),
    };
    p.line(point1.x, point1.y, point2.x, point2.y);
    p.pop();
  }
}

function circleIntersection(p) {
  const width = 370;
  const height = 200;
  const radiusL = 80;
  const radiusR = 60;
  const xL = -90;
  const xR = 90;

  p.setup = function () {
    p.frameRate(30);
    p.noFill();

    p.createCanvas(width, height);
  };

  p.draw = function () {
    p.clear();
    p.translate(width / 2, height / 2);

    // LHS circle. This stays still
    p.circle(xL, 0, radiusL * 2);

    // RHS circle. This moves between x = 200 and x = 400
    const x = xR * p.cos(p.frameCount / 30);
    p.circle(x, 0, radiusR * 2);

    // Line between centres. This is green if intersecting,
    // red if not
    const distance = p.dist(xL, 0, x, 0);
    const lineColor = distance < radiusL + radiusR ? "green" : "red";
    p.push();
    p.stroke(lineColor);
    p.line(xL, 0, x, 0);
    p.pop();
  };
}

function chipPlacement(p) {
  // 24 = 2 * default <body> padding
  let width = p.min(700, p.displayWidth - 24);
  const height = 400;
  const minGap = 5;

  let chips = [];

  p.windowResized = function () {
    width = p.min(700, p.displayWidth - 24);
    p.resizeCanvas(width, height);
  };

  p.setup = function () {
    p.frameRate(1);
    p.createCanvas(width, height);
    p.angleMode(p.DEGREES);
    p.noFill();
  };

  p.draw = function () {
    // Each time draw is called, draw a chip. If we fail to place a chip ten
    // times (an indication that our canvas is full), we clear the canvas
    for (let i = 0; i < 20; i++) {
      // Propose a chip location. We check if it intersects with an existing
      // chip, and repeat if it does
      const chip = {
        x: p.random(width),
        y: p.random(height),
        radius: p.random(20, 50),
      };

      function chipIntersects() {
        for (other of chips) {
          if (
            p.dist(other.x, other.y, chip.x, chip.y) <
            other.radius + chip.radius + minGap
          ) {
            return true;
          }
        }
        return false;
      }

      if (chipIntersects()) {
        continue;
      }

      // Doesn't intersect - draw chip
      chips.push(chip);

      drawChip(p, chip.x, chip.y, chip.radius);

      p.push();
      p.drawingContext.setLineDash([3, 6]);
      p.circle(chip.x, chip.y, chip.radius * 2);
      p.pop();

      return;
    }

    // We've fallen out of the loop above
    chips = [];
    p.clear();
  };
}

function drawChip(p, x, y, radius) {
  const numCorners = Math.floor(p.random(3, 6));
  // Pick points on the edge of the circle, in a clockwise direction
  // We join all these points to create the shape. Moving clockwise means the
  // lines connecting two adjacent points never cross
  let angles = [];
  for (let i = 0; i < numCorners; i++) {
    angles.push(p.random(360));
  }
  // lol - https://www.digitalocean.com/community/tutorials/js-array-sort-numbers
  angles.sort((a, b) => a - b);

  points = angles.map((angle) => {
    return {
      px: x + radius * p.cos(angle),
      py: y + radius * p.sin(angle),
    };
  });

  p.beginShape();
  for (let point of points) {
    p.vertex(point.px, point.py);
  }
  p.endShape(p.CLOSE);
}
