export const limit = (a, b, c) => {
  if (b < a) return a;
  if (b > c) return c;
  return b;
};

export const between = (a, b, c) => {
  return b >= a && b <= c;
};

export const rnd = (min, max) => {
  return random() * (max - min) + min;
};

export const pick = a => {
  return a[~~(random() * a.length)];
};

export const distP = (x1, y1, x2, y2) => {
  return sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
};

export const dist = (a, b) => {
  return distP(a.x, a.y, b.x, b.y);
};

export const sign = x => {
  return x < 0 ? -1 : x > 0 ? 1 : 0;
};

// Modulo centered around zero: the result will be between -y and +y
export const moduloWithNegative = (x, y) => {
  x = x % (y * 2);
  if (x > y) {
    x -= y * 2;
  }
  if (x < -y) {
    x += y * 2;
  }
  return x;
};

export const normalize = x => {
  // Possibly faster version but definitely smaller
  return moduloWithNegative(x, PI);
  // while (x < -PI) x += TWO_PI;
  // while (x > PI) x -= TWO_PI;
  // return x;
};

export const angleBetween = (a, b) => {
  return atan2(b.y - a.y, b.x - a.x);
};
