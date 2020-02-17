import parseColor from 'color-parser';
import { getSvgElLength } from './svg-utils';
import { colorProps, transformProps, validKeyframeProps } from './constants';
import {
  is,
  normalizeTweenUnit,
  getValidDOMProperties,
  getAnimatableProperties,
  unitToNumber,
  getStartingValues,
  pickFirstNotNull,
  parseEasing
} from './utils';

const findSummedStartingDuration = animations => {
  if (!animations || !animations.length) return 0;

  const [{ tweens }] = animations;
  const summedStartingDuration =
    tweens.length === 1
      ? tweens[0].startDuration
      : tweens.reduce((acc, current) => (acc += current.startDuration || 0), 0);

  return summedStartingDuration;
};

class Parser {
  parse(el, options, transformFrom) {
    const animations = this.parseOptions(el, options, transformFrom);
    const duration = Math.max(...animations.map(({ tweens }) => tweens[tweens.length - 1].end));
    const events = this.parseEvents(options);
    const summedStartingDuration = findSummedStartingDuration(animations);

    return {
      progress: 0,
      lastTick: 0,
      timesCompleted: 0,
      paused: false,
      duration,
      startDuration: summedStartingDuration,
      loop: options.loop || false,
      direction: options.direction || 'normal',
      animations,
      transformFrom,
      events
    };
  }

  parseEvents(options) {
    const events = options.events || {};
    const func = () => {};

    const parsedEvents = {
      // Observer events
      onMountStart: events.onMountStart || func,
      onMountEnd: events.onMountEnd || func,
      onUnmountStart: events.onUnmountStart || func,
      onUnmountEnd: events.onUnmountEnd || func,

      // Tweenful events
      onAnimationStart: events.onAnimationStart || func,
      onAnimationEnd: events.onAnimationEnd || func
    };

    return parsedEvents;
  }

  parseOptions(el, options, transformFrom) {
    const args = {
      el,
      options,
      transformFrom,
      animatable: options.animate || options.keyframes
    };

    if (!options.animate) {
      arguments.duration = options.duration / options.keyframes.length;
    }

    return this.getAnimations(args);
  }

  parseHeightPercentage(el, tween, property) {
    const offset = property === 'width' ? el.scrollWidth : el.scrollHeight;
    const [{ value: from }] = tween.from;
    const [{ value: to }] = tween.to;

    if (from === 'auto') {
      tween.from[0].value = offset;
      tween.from[0].unit = 'px';
    }

    if (to === 'auto') {
      tween.to[0].value = offset;
      tween.to[0].unit = 'px';
    }
  }

  parseTween(el, property, animate, from, animation, missingProps, options) {
    const { loop, duration, easing, delay, endDelay, pathLength } = options;

    const isTransformProperty = transformProps.includes(property);
    const isPropertyTweenable = !missingProps.includes(property);
    const isColor = colorProps.includes(property);
    const parsedDelay = delay <= 0 ? 0 : delay;
    const end = duration + parsedDelay + endDelay;
    const tween = {
      duration,
      easing: parseEasing(easing),
      startDelay: parsedDelay,
      endDelay,
      originalDelay: delay
    };

    if (isPropertyTweenable && property === 'strokeDashoffset') {
      const [from, to] = animate['strokeDashoffset'];
      tween.from = unitToNumber(`${(from / 100) * pathLength}`);
      tween.to = unitToNumber(`${(to / 100) * pathLength}`);
      tween.path = true;
    }

    if (isPropertyTweenable && isColor) {
      tween.color = true;
      tween.to = tween.from;

      if (animate[property]) {
        const { r, g, b, a } = parseColor(animate[property]);
        tween.to = [r, g, b, a];
      }
    }

    if (is.array(animate[property])) {
      const [from, to] = animate[property];
      tween.from = unitToNumber(from);
      tween.to = unitToNumber(to);

      const isAuto = [from, to].includes('auto');
      const isAutoProp = ['height', 'width'].includes(property);

      if (isAutoProp && isAuto) {
        this.parseHeightPercentage(el, tween);
      }
    }

    if (animation) {
      const lastTween = animation.tweens[animation.tweens.length - 1];
      tween.from = tween.from || lastTween.to;
      tween.to =
        tween.to || (isPropertyTweenable ? unitToNumber(animate[property] || 0) : lastTween.to);
      tween.start = lastTween.end + tween.startDelay;
      tween.end = lastTween.end + end;

      if (delay < 0) {
        const { startPos, startDuration } = this.animationStartingPosition(
          tween,
          delay,
          duration,
          loop
        );
        tween.startDuration = startDuration;
        tween.startPos = startPos;
      }

      if (!isTransformProperty) {
        normalizeTweenUnit(el, tween.from, tween.to);
      }

      return tween;
    }

    tween.from = tween.from || from[property];
    tween.to =
      tween.to || (is.null(animate[property]) ? from[property] : unitToNumber(animate[property]));
    tween.start = 0 + tween.startDelay;
    tween.end = end;
    if (delay < 0) {
      const { startPos, startDuration } = this.animationStartingPosition(
        tween,
        delay,
        duration,
        loop
      );
      tween.startDuration = startDuration;
      tween.startPos = startPos;
    }

    if (!isTransformProperty) {
      normalizeTweenUnit(el, tween.from, tween.to);
    }

    return tween;
  }

  animationStartingPosition(tween, delay, duration, loop) {
    let percent = 0;

    if (!loop || loop === 1) {
      const absMax = Math.abs(Math.max(delay, -duration));
      percent = (absMax * 100) / duration;
    } else if (loop === true) {
      let abs = Math.abs(delay);
      while (abs >= duration) {
        abs -= duration;
      }
      percent = (abs * 100) / duration;
    } else if (loop > 1) {
      throw new Error('not handled for now');
    }

    // for (abs = Math.abs(delay); abs >= duration; abs -= duration);
    let abs = Math.abs(delay);
    while (abs >= duration) {
      abs -= duration;
    }

    return {
      startDuration: duration - abs,
      startPos: tween.from.map((from, i) => ({
        value: (percent / 100) * (tween.to[i].value - from.value) + from.value,
        unit: from.unit
      }))
    };
  }

  getAnimations({ el, options, animatable, duration, transformFrom }) {
    const list = is.array(animatable) ? animatable : [animatable];
    const animatableProps = getAnimatableProperties(list);
    const from = getStartingValues(el, transformFrom, animatableProps);
    const animations = [];

    list.forEach(animate => {
      const keys = Object.keys(animate);
      const domProps = getValidDOMProperties(keys, validKeyframeProps);
      const missingProps = animatableProps.filter(prop => domProps.indexOf(prop) === -1);
      const iterableDOMProperties = [...domProps, ...missingProps];

      const config = {
        loop: options.loop,
        duration: pickFirstNotNull(duration, animate.duration, options.duration),
        delay: pickFirstNotNull(animate.delay, options.delay, 0),
        endDelay: pickFirstNotNull(animate.endDelay, options.endDelay, 0),
        easing: animate.easing || options.easing
      };

      if (is.svg(el)) {
        // supply pathLength for path animations
        config.pathLength = getSvgElLength(el);
      }

      iterableDOMProperties.forEach(property => {
        const animation = animations.find(anim => anim.property === property);
        const tween = this.parseTween(el, property, animate, from, animation, missingProps, config);

        if (animation) {
          animation.tweens.push(tween);
        } else {
          animations.push({
            property,
            tweens: [tween]
          });
        }
      });
    });

    return animations;
  }
}

export default new Parser();
