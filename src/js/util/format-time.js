const addZeroes = text => {
  text = text + "";
  while (text.length < 2) {
    text = "0" + text;
  }
  return text;
};

export const formatTime = t =>
  addZeroes(~~(t / 60)) + ":" + addZeroes(~~t % 60);
