class BigAIShip extends Ship {
  constructor(civilization, x, y) {
    super(civilization);
    this.nextDecisionChange = 0;

    this.x = x;
    this.y = y;
  }

  shipColor() {
    return this.civilization.relationshipType();
  }

  canShootEnemy() {
    if (!this.enemy) {
      return false;
    }

    if (
      dist(this, this.enemy) > 400 &&
      dist(this.civilization.center, this.enemy) >
        this.civilization.center.radius * 2
    ) {
      return false;
    }

    if (
      dist(this.civilization.center, this.enemy) <
      this.civilization.center.radius
    ) {
      return false;
    }

    return true;
  }

  currentTarget() {
    if (this.canShootEnemy()) {
      return this.enemy;
    }

    return this.target;
  }

  updateControls() {
    this.rotationDirection = 0;
    this.thrust = 0;

    const target = this.currentTarget();
    if (!target) {
      return;
    }

    const velocity = distP(0, 0, this.vX, this.vY);

    // Logic to reach the current target
    const angleToTarget = angleBetween(this, target);
    const angleDiff = normalize(angleToTarget - this.angle);

    if (abs(angleDiff) > PI / 64) {
      this.rotationDirection = sign(angleDiff);
    }

    if (abs(angleDiff) < PI / 64) {
      const moveAngle = atan2(this.vY, this.vX);
      const fullStopIn = velocity / SHIP_DECELERATION;
      const distAtFullStop =
        (-SHIP_DECELERATION * fullStopIn * fullStopIn) / 2 +
        velocity * fullStopIn;
      const positionAtFullStop = {
        x: this.x + distAtFullStop * cos(moveAngle),
        y: this.y + distAtFullStop * sin(moveAngle)
      };

      const distanceToTargetAtFullStop = dist(positionAtFullStop, target);
      this.thrust = distanceToTargetAtFullStop > AI_MOVE_TARGET_RADIUS ? 1 : 0;
    }

    if (this.canShootEnemy()) {
      if (abs(angleDiff) > PI / 64 && !this.coolingDown) {
        this.heat += 0.08; // hack to make AI ships shoot shorter bursts
        this.shoot(SuperLaser);
        this.shoot(SuperLaser);
        this.shoot(SimpleLaser);
      }
    }

    if (velocity > AI_SHIP_MAX_SPEED) {
      this.thrust = 0;
    }
  }

  cycle(e) {
    if (!V.isVisible(this, 500)) {
      return;
    }

    this.enemy =
      this.civilization.relationshipType() === RELATIONSHIP_ENEMY
        ? U.playerShip
        : null;

    if (
      !this.target ||
      dist(this, this.target) < this.targetRadius ||
      dist(this.civilization.center, this.target) <
        this.civilization.center.radius ||
      (this.nextDecisionChange -= e) <= 0
    ) {
      this.pickNewTarget();
    }

    this.updateControls();
    super.cycle(e);

    if (this.civilization.center.name) {
      // helps avoid having pirates being pushed by their center
      const angleWithPlanet = angleBetween(this.civilization.center, this);
      const distanceToPlanet = max(
        dist(this, this.civilization.center),
        this.civilization.center.radius + this.radius * 2
      );

      this.x =
        this.civilization.center.x + cos(angleWithPlanet) * distanceToPlanet;
      this.y =
        this.civilization.center.y + sin(angleWithPlanet) * distanceToPlanet;
    }
  }

  render() {
    if (!V.isVisible(this, this.radius)) {
      return;
    }

    // if (DEBUG) {
    //     G.renderedShips++;
    // }

    // wrap(() => {
    fs(
      1 - limit(0, G.clock - this.lastDamage, 0.1) / 0.1 > 0
        ? "#f00"
        : this.shipColor()
    );
    translate(this.x, this.y);
    rotate(this.angle);
    beginPath();
    moveTo(-5 * 2, 0);
    lineTo(-10 * 2, 10 * 2);
    lineTo(20 * 2, 0);
    lineTo(-10 * 2, -10 * 2);
    fill();
    // });

    // Shadow effect relative to the closest star
    const closestStar = U.stars.reduce(
      (closest, star) =>
        !closest || dist(closest, this) > dist(star, this) ? star : closest,
      null
    );

    if (closestStar) {
      const angleToClosestStar = normalize(
        this.angle - angleBetween(this, closestStar)
      );
      // const alpha = 1 - abs(abs(angleToClosestStar) / PI - 1 / 2) * 2;

      // wrap(() => {
      fs("#000");

      // This is crazy but I gotta save the byes
      R.globalAlpha =
        (1 - abs(abs(angleToClosestStar) / PI - 1 / 2) * 2) *
        limit(0, 1 - dist(closestStar, this) / 5000, 1);
      // translate(this.x, this.y);
      // rotate(this.angle);

      beginPath();
      moveTo(-5, 0);
      lineTo(-10, sign(angleToClosestStar) * 10);
      lineTo(20, 0);
      fill();
      // });
    }
  }

  pickNewTarget() {
    const pts = pointsAround(this.civilization.center, [
      this.civilization.center.radius + 150,
      this.civilization.center.radius + 250
    ]);

    const closestNode = target =>
      pts.slice().sort((a, b) => {
        return dist(a, target) - dist(b, target);
      })[0];

    // Find the node we're the closest to
    const nodeStart = closestNode(this);
    const nodeEnd = U.enemy ? closestNode(U.enemy) : pick(nodeStart.neighbors);

    const closestNodeToTarget = nodeStart.neighbors
      .concat([nodeStart])
      .reduce((closest, node) => {
        return !closest || dist(node, nodeEnd) < dist(closest, nodeEnd)
          ? node
          : closest;
      }, null);

    this.targetRadius = AI_MOVE_TARGET_RADIUS;

    // If the node we picked is further than the target, might as well go for the target instead
    this.target =
      dist(this, closestNodeToTarget) > dist(this, nodeEnd)
        ? nodeEnd
        : closestNodeToTarget;

    this.nextDecisionChange = 2;
  }

  damage(projectile, amount) {
    super.damage(projectile, amount);

    if (projectile.owner === U.playerShip) {
      this.civilization.updateRelationship(RELATIONSHIP_UPDATE_DAMAGE_SHIP);
    }
  }

  explode(projectile) {
    super.explode(projectile);

    if (projectile.owner === U.playerShip) {
      this.civilization.updateRelationship(RELATIONSHIP_UPDATE_DESTROY_SHIP);
    }
  }
}
