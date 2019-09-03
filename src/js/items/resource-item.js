import { PLANET_MAX_RESOURCES, EVENT_PICKUP_RESOURCE } from "../constants";
import { pickupSound } from "../sound/sounds";
import { renderResourcesIcon } from "../graphics/assets";
import { Item } from "./item";

export class ResourceItem extends Item {
  renderGraphic() {
    scale(0.3, 0.3);

    fs("#fff");
    renderResourcesIcon();
  }

  pickUp(ship) {
    ship.civilization.resources = min(
      PLANET_MAX_RESOURCES,
      ship.civilization.resources + 1
    );
    G.eventHub.emit(EVENT_PICKUP_RESOURCE, this);

    G.resourceAnimation();

    pickupSound();
  }
}
