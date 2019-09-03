import { EVENT_CYCLE } from "../constants";
import { dist } from "../math";
import { Body } from "../world/body";
import { TimedMissionStep } from "./timed-mission-step";

export class StudyBody extends TimedMissionStep {
  constructor(body) {
    super();
    this.body = body;
    this.prompt =
      "Collect some data on " + body.nameWithRelationship() + " for us";
    this.targets = [body];

    this.studied = 0;
  }

  instructions() {
    if (this.isClose()) {
      return "Collecting data... - " + ~~(this.studied * 100) + "%";
    }
    return "Get close to " + this.body.name;
  }

  attach() {
    super.attach();

    this.listen(EVENT_CYCLE, e => {
      if (this.isClose()) {
        this.studied += e * (1 / 40);

        if (this.studied >= 1) {
          this.reach(
            this.civilization.center,
            "Return to " + this.civilization.center.name
          );
        }
      }
    });
  }

  isClose() {
    return dist(U.playerShip, this.body) < this.body.radius * 4;
  }
}
