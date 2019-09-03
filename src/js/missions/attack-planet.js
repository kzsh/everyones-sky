import { EVENT_STATION_DESTROYED } from "../constants";
import { rnd } from "../math";
import { TimedMissionStep } from "./timed-mission-step";

export class AttackPlanet extends TimedMissionStep {
  constructor(planet) {
    super();
    this.planet = planet;
    this.prompt = "Destroy facilities on " + planet.nameWithRelationship();
    this.targets = [planet];

    this.destroyedStations = 0;
    this.stationsToDestroy = min(this.planet.stations.length, ~~rnd(3, 5));
  }

  instructions() {
    return (
      "Facilities destroyed: " +
      this.destroyedStations +
      "/" +
      this.stationsToDestroy
    );
  }

  attach() {
    super.attach();

    this.listen(EVENT_STATION_DESTROYED, station => {
      if (station.planet === this.planet) {
        this.destroyedStations++;
        if (this.destroyedStations >= this.stationsToDestroy) {
          G.missionDone(true);
        }
      }
    });
  }
}
