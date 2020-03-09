import { getAnimationProgress, calculateProgress } from '../helpers';
import { computeProgressTick, updateTimesCompleted } from './utils';

class Engine {
  constructor(options) {
    this.frame = null;
    this.options = options;
    this.didComplete = false;
    this.lastTime = 0;
    this.startTime = 0;
    this.lastTick = 0;

    this.progress = this.progress.bind(this);
  }

  play() {
    this.frame = requestAnimationFrame(this.progress);
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
      this.didComplete = false;
      this.startTime = now;
    }

    const progressTick = computeProgressTick(instance);
    const tick = now + progressTick + (this.lastTime - this.startTime);

    instance.time = tick;
    instance.progress = calculateProgress(tick, duration);
    const animatedProps = getAnimationProgress(tick, this.lastTick, animations, el);

    animate(instance, animatedProps);

    if (instance.progress === 1) {
      instance.events.onAnimationEnd();
      updateTimesCompleted(instance);
      onComplete(instance);
    }

    this.lastTick = tick;
    if (tick < duration) {
      this.play();
    } else {
      this.didComplete = true;
      this.reset();
    }
  }

  handleVisibility(state) {
    state === 'visible' ? this.resume() : this.pause();
  }

  pause() {
    if (!this.didComplete) {
      cancelAnimationFrame(this.frame);
    }
  }

  resume() {
    if (!this.didComplete) {
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
