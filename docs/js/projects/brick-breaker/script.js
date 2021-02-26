var config = {
  type: Phaser.AUTO,
  parent: null,
  width: 1024,
  height: 768,
  // scale: {
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH
  // },
  scene: {
    // preload: preload,
    create: create
    // update: update
  },
  physics: {
    default: "arcade"
  }
};

var game = new Phaser.Game(config);

function preload() {}
function create() {
  var cube = this.add.circle();
  // cube.fillStyle(0xffffff, 1);
  // cube.fillRect(0, 0, 200, 200);
  // cube.generateTexture("snowflake", 50, 50);
  //
  console.log(cube);

  this.physics.world.enable(cube);
  cube.body.setSize(200, 200);
  cube.body.setCollideWorldBounds(true);
  cube.body.setBounce(1, 1);
  cube.body.setVelocity(100, 200);
}
function update() {}
