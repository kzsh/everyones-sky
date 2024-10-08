import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants";
export const onresize = () => {
  var mw = innerWidth,
    mh = innerHeight,
    ar = mw / mh, // available ratio
    br = CANVAS_WIDTH / CANVAS_HEIGHT, // base ratio
    w,
    h,
    s = document.querySelector("#cc").style;

  if (ar <= br) {
    w = mw;
    h = w / br;
  } else {
    h = mh;
    w = h * br;
  }

  s.width = w + "px";
  s.height = h + "px";
};
