import { getAnimationProgress, calculateProgress } from './utils';

const getDuration = ({ timesCompleted, startDuration, duration }) => {
  if (!timesCompleted && startDuration) {
    return startDuration;
  }

  return duration;
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

  progress(now) {
    const {
      el,
      instance,
      animate,
      onComplete,
      instance: { animations }
    } = this.options;

    if (!this.startTime) {
      this.completed = false;
      this.startTime = now;
    }

    const duration = getDuration();
    const tick = now + this.lastTime - this.startTime;

    instance.time = tick;
    instance.progress = calculateProgress(tick, duration);
    const animatedProps = getAnimationProgress(instance, tick, this.lastTick, animations, el);

    animate(instance, animatedProps);

    if (instance.progress === 1) {
      instance.events.onAnimationEnd();
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
