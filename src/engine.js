import { getAnimationProgress, calculateProgress } from './utils';

const modulo = (delay, duration) => {
  while (delay >= duration) {
    delay -= duration;
  }

  return delay;
};

const computeProgressTick = (instance) => {
  // ignore negative delay after the first animation occurred
  if (instance.delay >= 0 || instance.timesCompleted > 0) return 0;

  const { duration, loop } = instance;
  const delay = Math.abs(instance.delay);

  if (loop === true) {
    return modulo(delay, duration);
  } else if (loop === false) {
    return delay > duration ? duration : modulo(delay, duration);
  } else if (loop > 0) {
    const totalDuration = loop * duration;

    // delay might last longer than the animation itself
    // else we'll just calculate the modulo
    return delay > totalDuration ? duration : modulo(delay, duration);
  }

  return 0;
};

class Engine {
  constructor(options) {
    this.frame = null;
    this.options = options;
    this.completed = false;
    this.lastTime = 0;
    this.startTime = 0;
    this.lastTick = 0;

    this.progress = this.progress.bind(this);
  }

  play() {
    this.frame = requestAnimationFrame(this.progress);
  }

  handleVisibility(state) {
    state === 'visible' ? this.resume() : this.pause();
  }

  updateTimesCompleted() {
    const { instance } = this.options;
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

  progress(now) {
    const {
      el,
      instance,
      animate,
      onComplete,
      instance: { duration, animations }
    } = this.options;

    if (!this.startTime) {
      this.completed = false;
      this.startTime = now;
    }

    const progressTick = computeProgressTick(instance);
    const tick = now + progressTick + (this.lastTime - this.startTime);

    instance.time = tick;
    instance.progress = calculateProgress(tick, duration);
    const animatedProps = getAnimationProgress(instance, tick, this.lastTick, animations, el);

    animate(instance, animatedProps);

    if (instance.progress === 1) {
      instance.events.onAnimationEnd();
      this.updateTimesCompleted();
      onComplete(instance);
    }

    this.lastTick = tick;
    if (tick < duration) {
      this.play();
    } else {
      this.completed = true;
      this.reset();
    }
  }

  pause() {
    if (!this.completed) {
      cancelAnimationFrame(this.frame);
    }
  }

  resume() {
    if (!this.completed) {
      this.startTime = 0;
      this.lastTime = this.options.instance.time;
      this.play();
    }
  }

  stop() {
    cancelAnimationFrame(this.frame);
    this.reset();
  }

  reset() {
    this.frame = null;
    this.lastTime = 0;
    this.startTime = 0;
    this.lastTick = 0;
    this.tick = 0;
  }
}

export default Engine;
