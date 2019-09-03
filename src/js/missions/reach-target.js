import { EVENT_CYCLE } from "./constants";
import { dist } from "../math";
import { TimedMissionStep } from "./timed-mission-step";

export class ReachTarget extends TimedMissionStep {
  constructor(target, prompt) {
    super();
    this.targets = [target];
    this.prompt = prompt;
  }

  instructions() {
    return this.prompt;
  }

  attach() {
    super.attach();

    this.listen(EVENT_CYCLE, () => {
      if (dist(this.targets[0], U.playerShip) < this.targets[0].radius * 3) {
        G.missionDone(true);
      }
    });
  }

  reach(target, prompt) {
    const step = new ReachTarget(target, prompt);
    step.civilization = this.civilization;
    this.proceed(step);

    step.timeleft = this.timeleft;
  }
}
