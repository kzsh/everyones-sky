import { dismiss } from "../globals";
import { EVENT_SHOT, EVENT_CYCLE } from "../constants";
import { dist } from "../math";
import { MissionStep } from "./mission-step";

export class PromptTutorialStep extends MissionStep {
  attach() {
    V.targetScaleOverride = 1;

    G.showPrompt("Follow a quick tutorial?", [
      {
        label: "Yes",
        action: () => this.proceed(new MovementStep())
      },
      {
        label: "No",
        action: () => this.proceed(new InstructionsStep())
      }
    ]);
  }
}

class MovementStep extends MissionStep {
  attach() {
    G.showPrompt("Use arrow keys to control your ship");

    const start = { x: U.playerShip.x, y: U.playerShip.y };
    this.listen(EVENT_CYCLE, () => {
      if (dist(start, U.playerShip) > 500) {
        this.proceed(new ShootingStep());
      }
    });
  }
}

class ShootingStep extends MissionStep {
  attach() {
    G.showPrompt("Press [SPACE] for blasters, [ENTER] for torpedoes");

    let shots = 20;
    this.listen(EVENT_SHOT, projectile => {
      if (projectile.owner === U.playerShip && !--shots) {
        this.proceed(new OfflineStep());
      }
    });
  }
}

class OfflineStep extends MissionStep {
  attach() {
    G.showPrompt("Communications OFFLINE. Find resources to repair", [
      {
        label: "Help",
        action: () =>
          G.showPrompt("Resources can be collected by destroying asteroids")
      }
    ]);

    this.listen(EVENT_CYCLE, () => {
      if (U.playerShip.civilization.resources >= 20) {
        this.proceed(new TutorialFinishedStep());
      }

      if (U.bodies.length < 10) {
        U.randomAsteroid();
      }
    });
  }
}

class TutorialFinishedStep extends MissionStep {
  attach() {
    G.showPrompt("Communications ONLINE. Good job");

    setTimeout(() => this.proceed(new InstructionsStep()), 5000);
  }
}

class InstructionsStep extends MissionStep {
  attach() {
    V.targetScaleOverride = 0;

    U.generateUniverse();

    G.showPrompt("Bring PEACE to the galaxy, or WAR...", [
      {
        label: dismiss,
        action: () => this.proceed()
      }
    ]);

    G.nextMission = 0;
  }
}
