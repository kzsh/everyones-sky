window.R; // canvas context
window.G; // Game instance
window.V; // Camera instance
window.U; // Universe instance
w = window;
window.isTouch;
window.mobile = navigator.userAgent.match(/andro|ipho|ipa|ipo|windows ph/i);
window.CANVAS_HEIGHT = mobile ? 1400 : 1000;
window.monoFont;

// TODO: This probably belongs in constants or some string file
export const dismiss = "Dismiss";
