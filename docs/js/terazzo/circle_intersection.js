const width = 600;
const height = 200;
const radiusL = 70;
const radiusR = 50;
const y = height / 2;

function setup() {
  frameRate(30);
  noFill();

  createCanvas(width, height);
}

function draw() {
  clear();

  // LHS circle. This stays still
  circle(200, y, radiusL * 2);

  // RHS circle. This moves between x = 200 and x = 400
  const x = 300 + 100 * cos(frameCount / 15);
  circle(x, y, radiusR * 2);

  // Line between centres. This is green if intersecting,
  // red if not
  const distance = dist(200, y, x, y);
  const lineColor = distance < radiusL + radiusR ? "green" : "red";
  push();
  stroke(lineColor);
  line(200, y, x, y);
  pop();
}
