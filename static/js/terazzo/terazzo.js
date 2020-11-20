// TODO:
// - Colour picker
// - Custom size
// - Download image

function setup() {
  angleMode(DEGREES);
  noStroke();

  const width = 800;
  const height = 800;

  const minGap = 5;

  const seed = Math.floor(random(1000000));
  randomSeed(seed);
  console.log(seed);

  createCanvas(width, height);

  // circle(200, 200, 80);
  fill(150);
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
          dist(other.x, other.y, chip.x, chip.y) <
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
    drawChip(chip.x, chip.y, chip.radius);
  }
}

function drawChip(x, y, radius) {
  const numCorners = Math.floor(random(3, 6));
  // Pick points on the edge of the circle, in a clockwise direction
  // We join all these points to create the shape. Moving clockwise means the
  // lines connecting two adjacent points never cross
  let angles = [];
  for (let i = 0; i < numCorners; i++) {
    angles.push(random(360));
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
  fill(colour);

  beginShape();
  for (let point of points) {
    vertex(point.px, point.py);
  }
  endShape(CLOSE);
}
