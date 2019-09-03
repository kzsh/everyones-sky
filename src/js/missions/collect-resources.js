import { EVENT_PICKUP_RESOURCE } from "../constants";
import { TimedMissionStep } from "./timed-mission-step";

export class CollectResources extends TimedMissionStep {
  constructor() {
    super();

    this.prompt = "Collect some resources for us";

    this.requiredResources = 100;
    this.collectedResources = 0;
  }

  instructions() {
    return (
      "Collect resources - " +
      this.collectedResources +
      "/" +
      this.requiredResources
    );
  }

  attach() {
    super.attach();

    this.listen(EVENT_PICKUP_RESOURCE, () => {
      U.playerShip.civilization.resources--; // make sure the player doesn't get these resources

      if (++this.collectedResources >= this.requiredResources) {
        this.reach(
          this.civilization.center,
          "Return to " + this.civilization.center.name
        );
      }
    });
  }
}
