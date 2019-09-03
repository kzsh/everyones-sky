import { EVENT_CYCLE, CANVAS_WIDTH } from "../constants";
import { sign, rnd, pick } from "../math";
import { Asteroid } from "../world/asteroid";
import { TimedMissionStep } from "../missions/timed-mission-step";

export class Asteroids extends TimedMissionStep {
  constructor() {
    super();
    this.prompt = "Destroy these asteroids for us";
  }

  instructions() {
    return "Destroy the asteroids";
  }

  attach() {
    super.attach();

    const asteroids = [];
    for (let i = 0; i < 5; i++) {
      const asteroid = new Asteroid();
      asteroid.x = U.playerShip.x + (pick([-1, 1]) * CANVAS_WIDTH) / 0.25;
      sign(U.playerShip.x - asteroid.x) * min(abs(asteroid.vX), 100);
      asteroid.vY =
        sign(U.playerShip.y - asteroid.y) * min(abs(asteroid.vY), 100);
      asteroid.preventAutomaticRemoval = true;
      U.bodies.push(asteroid);

      asteroids.push(asteroid);
    }

    this.listen(EVENT_CYCLE, () => {
      this.targets = asteroids.filter(asteroid => asteroid.health > 0);

      if (!this.targets.length) {
        G.missionDone(true);
      }
    });
  }
}
