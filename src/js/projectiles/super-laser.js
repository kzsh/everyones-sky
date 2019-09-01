class SuperLaser extends Laser {
  constructor(owner, x, y, angle) {
    super(owner, x, y, angle);
    this.maxSpeed = 800;
    this.speed = 300;
    this.clock = 0;
    this.radius = 8;
    this.damage = 0.5;
    this.radius = 8;
    this.heat = 0.3;
    this.guideRadius = 1000;
  }

  cycle(e) {
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    } else if (this.speed !== this.maxSpeed) {
      this.speed += 5;
    }
    // else do nothing

    super.cycle(e);

    const s = sin((this.clock += e) * TWO_PI * 4) * 0;

    const d = 0.5;
    particle("red", [
      ["alpha", 1, 0, d],
      ["size", 16, rnd(16, 32), d]
      // [
      //   "x",
      //   this.x + cos(this.angle + PI / 2) * s * 10,
      //   this.x + cos(this.angle + PI / 2) * s * 10 + rnd(-16, 16),
      //   d
      // ],
      // [
      //   "y",
      //   this.y + sin(this.angle + PI / 2) * s * 10,
      //   this.y + sin(this.angle + PI / 2) * s * 10 + rnd(-16, 16),
      //   d
      // ]
    ]);

    for (let i = 0; i < ceil(e * 60); i++) {
      particle("#fff", [
        ["alpha", 1, 0, 1],
        ["size", rnd(2, 4), rnd(5, 10), 1],
        ["x", this.x, this.x + rnd(-20, 20), 1],
        ["y", this.y, this.y + rnd(-20, 20), 1]
      ]);
    }
  }

  render() {
    translate(this.x, this.y);
    rotate(this.angle);

    fs("red");
    fr(-5, -5, 10, 10);
  }
}
