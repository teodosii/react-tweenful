const pow = Math.pow;
const c1 = 1.70158;
const c2 = c1 * 1.525;

const minMax = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
};

const bounceOut = x => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
};

export default {
  // no easing, no acceleration
  linear: t => {
    return t;
  },
  // accelerating from zero velocity
  easeInQuad: t => {
    return t * t;
  },
  // decelerating to zero velocity
  easeOutQuad: t => {
    return t * (2 - t);
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: t => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // accelerating from zero velocity
  easeInCubic: t => {
    return t * t * t;
  },
  // decelerating to zero velocity
  easeOutCubic: t => {
    return --t * t * t + 1;
  },
  // acceleration until halfway, then deceleration
  easeInOutCubic: t => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // accelerating from zero velocity
  easeInQuart: t => {
    return t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuart: t => {
    return 1 - --t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: t => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  // accelerating from zero velocity
  easeInQuint: t => {
    return t * t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuint: t => {
    return 1 + --t * t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuint: t => {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  },
  easeInOutBack: x => {
    return x < 0.5
      ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  },
  easeInBounce: x => {
    return 1 - bounceOut(1 - x);
  },
  sine: t => 1 - Math.cos((t * Math.PI) / 2),
  circ: t => 1 - Math.sqrt(1 - t * t),
  back: t => t * t * (3 * t - 2),
  bounce: t => {
    let pow2;
    let b = 4;
    while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11);
    return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
  },
  elastic: t => {
    const amplitude = 1;
    const period = 0.1;
    const a = minMax(amplitude, 1, 10);
    const p = minMax(period, 0.1, 2);

    var s = Math.asin((1 / a) * p);
    return (
      ((t = t * 2 - 1) < 0
        ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p)
        : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2
    );
  },
  easeOutBounce: bounceOut
};
