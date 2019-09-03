import "./js/touch";
import "./js/keyboard";
import "./js/globals";
import "./js/canvas-additions";

import { onload } from "./js/main";

window.onload = onload;

// Make Math global
const w = window;
const m = Math;
Object.getOwnPropertyNames(m).forEach(n => (w[n] = w[n] || m[n]));

window.TWO_PI = PI * 2;
