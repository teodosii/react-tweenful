import { getAnimationProgress, calculateProgress } from './utils';

class Engine {
  constructor(options) {
    this.frame = null;
    this.lastTick = null;
    this.options = options;
    this.elapsed = 0;
    this.completed = false;

    this.progress = this.progress.bind(this);
  }

  play() {
    this.frame = requestAnimationFrame(this.progress);
  }

  handleVisibility(state) {
    state === 'visible' ? this.resume() : this.pause();
  }

  calculateElapsed(now) {
    this.lastElapsed = this.elapsed;
    // calculate elapsed time
    this.elapsed += now - this.lastTick;
    // set last tick to know when to resume if paused
    this.lastTick = now;
  }

  getAnimatedProps(instance) {
    const { el } = this.options;
    const { duration, animations } = instance;

    // shared between all tweenful components
    instance.progress = calculateProgress(this.elapsed, duration);
    return getAnimationProgress(this.elapsed, this.lastElapsed, animations, el);
  }

  progress(now) {
    const { instance, animate } = this.options;

    if (!this.lastTick) {
      this.completed = false;
      this.lastTick = now;
    }

    this.calculateElapsed(now);

    // shared across all tweenful components
    const props = this.getAnimatedProps(instance);
    animate(instance, props);

    if (this.elapsed < instance.duration) {
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
      this.lastTick = performance.now();
      this.play();
    }
  }

  stop() {
    if (!this.completed) {
      cancelAnimationFrame(this.frame);
      this.reset();
    }
  }

  reset() {
    this.frame = null;
    this.lastTick = null;
    this.lastElapsed = null;
    this.elapsed = 0;
  }
}

export default Engine;
