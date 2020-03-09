export const modulo = (delay, duration) => {
  while (delay >= duration) {
    delay -= duration;
  }

  return delay;
};

export const computeProgressTick = (instance) => {
  // ignore negative delay after the first animation occurred
  if (instance.delay >= 0 || instance.timesCompleted > 0) return 0;

  const { duration, loop } = instance;
  const delay = Math.abs(instance.delay);

  if (loop === true) {
    return modulo(delay, duration);
  } else if (loop === false) {
    return delay > duration ? duration : modulo(delay, duration);
  } else if (loop > 0) {
    // delay might last longer than the animation itself
    // else we'll just calculate the modulo
    const totalDuration = loop * duration;
    return delay > totalDuration ? duration : modulo(delay, duration);
  }

  return 0;
};

export const updateTimesCompleted = (instance) => {
  const { duration, delay, loop } = instance;

  if (!instance.timesCompleted && delay < 0 && loop > 0) {
    let absDelay = Math.abs(delay);
    if (absDelay < duration) {
      instance.timesCompleted++;
    }

    while (absDelay >= duration) {
      absDelay -= duration;
      instance.timesCompleted++;
    }
  } else {
    instance.timesCompleted++;
  }
}