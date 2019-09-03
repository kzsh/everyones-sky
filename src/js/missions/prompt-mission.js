import { dismiss } from "../globals";
import { EVENT_CYCLE, RELATIONSHIP_UPDATE_MISSION_IGNORED } from "../constants";
import { formatTime } from "../util/format-time";
import { MissionStep } from "./mission-step";

export class PromptMission extends MissionStep {
  constructor(missionStep) {
    super();
    this.missionStep = missionStep;
  }

  attach() {
    super.attach();

    let timeleft = 15;
    this.listen(EVENT_CYCLE, e => {
      if ((timeleft -= e) < 0) {
        this.proceed();
      }
    });

    G.showPrompt(
      () =>
        "Incoming communication from " +
        this.missionStep.civilization.center.nameWithRelationship() +
        " - " +
        formatTime(timeleft),
      [
        {
          label: "Respond",
          action: () => {
            timeleft = 15;
            G.showPrompt(
              () => this.missionStep.prompt + " - " + formatTime(timeleft),
              [
                {
                  label: "Accept",
                  action: () => this.proceed(this.missionStep)
                },
                {
                  label: "Refuse",
                  action: () => this.proceed()
                }
              ]
            );
          }
        },
        {
          label: "Ignore",
          action: () => this.proceed()
        }
      ]
    );
  }

  proceed(missionStep) {
    super.proceed(missionStep);

    if (!missionStep) {
      this.missionStep.civilization.updateRelationship(
        RELATIONSHIP_UPDATE_MISSION_IGNORED
      );
      G.showPrompt(
        "Communication ignored. " +
          this.missionStep.civilization.center.name +
          " will remember that",
        [
          {
            label: dismiss,
            action: () => G.showPrompt()
          }
        ]
      );
      setTimeout(() => G.showPrompt(), 5000);
    }
  }
}
