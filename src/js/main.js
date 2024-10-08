import { Game } from "./game";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { onresize } from "./util/resizer";

const w = window;

export const onload = () => {
  onresize(); // trigger initial sizing pass

  const can = document.querySelector("canvas");
  can.width = CANVAS_WIDTH;
  can.height = CANVAS_HEIGHT;

  R = can.getContext("2d");

  // Shortcut for all canvas methods to the main canvas
  const p = CanvasRenderingContext2D.prototype;
  Object.getOwnPropertyNames(p).forEach(n => {
    if (R[n] && R[n].call) {
      w[n] = p[n].bind(R);
    }
  });

  // Detect available fonts
  R.font = "99pt f"; // Setting a font that obviously doesn't exist
  const reference = measureText(w.title).width;

  for (let fontName of ["Mono", "Courier"]) {
    R.font = "99pt " + fontName;
    if (measureText(w.title).width != reference) {
      monoFont = fontName;
      break;
    }
  }

  new Game();

  // Start cycle()
  let lf = Date.now();
  let frame = () => {
    let n = Date.now(),
      e = (n - lf) / 1000;

    // if(DEBUG){
    //     G.fps = ~~(1 / e);
    // }

    lf = n;

    G.cycle(e);

    requestAnimationFrame(frame);
  };
  frame();
};
