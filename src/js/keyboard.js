const w = window;
w.down = {};
window.onkeydown = e => {
  w.down[e.keyCode] = true;
};
window.onkeyup = e => {
  w.down[e.keyCode] = false;
  const character = String.fromCharCode(e.keyCode).toLowerCase();
  if (isNaN(character)) {
    G.selectPromptOption(character);
  }
};
