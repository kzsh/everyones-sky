import { EVENT_CYCLE } from "../constants";
import { rnd, pick } from "../math";
import { TimedMissionStep } from "./timed-mission-step";

export class Pirates extends TimedMissionStep {
  constructor() {
    super();
    this.prompt = "Help us fight these pirates";
  }

  instructions() {
    return "Destroy the pirate ships";
  }

  attach() {
    super.attach();

    const pirates = U.createPirateGroup(
      this.civilization.center.orbitsAround.x +
        pick([-1, 1]) *
          (this.civilization.center.orbitsAround.reachRadius + 2000),
      this.civilization.center.y + rnd(-2000, 2000)
    );

    this.listen(EVENT_CYCLE, () => {
      this.targets = pirates.filter(ship => ship.health > 0);

      if (!this.targets.length) {
        G.missionDone(true);
      }
    });
  }
}
