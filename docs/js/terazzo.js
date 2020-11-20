new p5(terazzo, "terazzo");
new p5(circleIntersection, "circleIntersection");

function terazzo(p) {
  p.setup() = function () {
    p.angleMode(DEGREES);
    p.noStroke();

    const width = 800;
    const height = 800;

    const minGap = 5;

    const seed = Math.floor(p.random(1000000));
    p.randomSeed(seed);
    console.log(seed);

    p.createCanvas(width, height);

    // circle(200, 200, 80);
    p.fill(150);
    // chip(200, 200, 40);

    chips = [];

    for (let i = 0; i < 1000; i++) {
      // Propose a chip location. We check if it intersects with an existing
      // chip, and repeat if it does
      const chip = {
        x: random(width),
        y: random(height),
        radius: random(5, 30)
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
    }
  }

}

function circleIntersection(p) {
  const width = 600;
  const height = 200;
  const radiusL = 70;
  const radiusR = 50;
  const y = height / 2;

  p.setup = function () {
    p.frameRate(30);
    p.noFill();

    p.createCanvas(width, height);
  };

  p.draw = function () {
    p.clear();

    // LHS circle. This stays still
    p.circle(200, y, radiusL * 2);

    // RHS circle. This moves between x = 200 and x = 400
    const x = 300 + 100 * p.cos(p.frameCount / 15);
    p.circle(x, y, radiusR * 2);

    // Line between centres. This is green if intersecting,
    // red if not
    const distance = p.dist(200, y, x, y);
    const lineColor = distance < radiusL + radiusR ? "green" : "red";
    p.push();
    p.stroke(lineColor);
    p.line(200, y, x, y);
    p.pop();
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

  points = angles.map(angle => {
    return {
      px: x + radius * cos(angle),
      py: y + radius * sin(angle)
    };
  });

  const colour = random(["#f8bbd0", "#b2ebf2", "#ffecb3", "#b0bec5"]);
  p.fill(colour);

  p.beginShape();
  for (let point of points) {
    p.vertex(point.px, point.py);
  }
  p.endShape(CLOSE);
}
