import parseColor from 'color-parser';
import {
  colorProps,
  transformProps,
  validKeyframeProps
} from './constants';
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

class Parser {
  parse(el, options, transformFrom) {
    const animations = this.parseOptions(el, options, transformFrom)
    const duration = Math.max(...animations.map(({ tweens }) => tweens[tweens.length - 1].end));
    const events = this.parseEvents(options);

    return {
      progress: 0,
      lastTick: 0,
      paused: false,
      duration,
      loop: options.loop,
      direction: options.direction,
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

  parseAnimate(el, options, transformFrom) {
    const { animate } = options;
    const animations = this.getAnimations(
      el,
      options,
      animate,
      transformFrom
    );
    return animations;
  }

  parseKeyframes(el, options, transformFrom) {
    const { keyframes } = options;
    const tweenDuration = options.duration / keyframes.length;
    const animations = this.getAnimations(
      el,
      options,
      keyframes,
      transformFrom,
      tweenDuration
    );

    return animations;
  }

  parseTween(el, property, animate, from, animation, missingProps, options) {
    const { duration, easing, delay, endDelay, pathLength } = options;

    const isTransformProperty = transformProps.includes(property);
    const isPropertyTweenable = missingProps.indexOf(property) === -1;
    const isColor = colorProps.indexOf(property) > -1;
    const end = duration + delay + endDelay;
    const tween = {
      duration,
      easing: parseEasing(easing),
      startDelay: delay,
      endDelay
    };

    if (isPropertyTweenable && property === 'strokeDashoffset') {
      const [from, to] = animate['strokeDashoffset'];
      tween.from = unitToNumber(`${from / 100 * pathLength}`);
      tween.to = unitToNumber(`${to / 100 * pathLength}`);
      tween.path = true;
    }

    if (isPropertyTweenable && isColor) {
      tween.color = true;
      tween.to = tween.from;

      if (animate[property]) {
        const { r, g, b, a } = parseColor(animate[property])
        tween.to = [r, g, b, a];
      }
    }

    if (animation) {
      const lastTween = animation.tweens[animation.tweens.length - 1];
      tween.start = lastTween.end + delay;
      tween.end = lastTween.end + end;
      tween.from = tween.from || lastTween.to;
      tween.to = tween.to || (
        isPropertyTweenable
          ? unitToNumber(animate[property] || 0)
          : lastTween.to
      );

      if (!isTransformProperty) {
        normalizeTweenUnit(el, tween.from, tween.to);
      }

      return tween;
    }

    tween.start = 0 + delay;
    tween.end = end;
    tween.from = tween.from || from[property];
    tween.to = tween.to || (
      is.null(animate[property])
        ? from[property]
        : unitToNumber(animate[property])
    );

    if (!isTransformProperty) {
      normalizeTweenUnit(el, tween.from, tween.to);
    }

    return tween;
  }

  getAnimations({ el, options, animatable, duration, transformFrom }) {
    // we accept both array and object syntax for animate/keyframes
    const list = is.array(animatable) ? animatable : [animatable];

    const animatableProps = getAnimatableProperties(list);
    const from = getStartingValues(el, transformFrom, animatableProps);
    const pathLength = is.svg(el) ? el.getTotalLength() : null;
    const animations = [];

    list.forEach(animate => {
      const keys = Object.keys(animate);
      const domProps = getValidDOMProperties(keys, validKeyframeProps);
      const missingProps = animatableProps.filter(prop => domProps.indexOf(prop) === -1);
      const iterableDOMProperties = [...domProps, ...missingProps];

      const config = {
        duration: pickFirstNotNull(duration, animate.duration, options.duration),
        delay: pickFirstNotNull(animate.delay, options.delay, 0),
        endDelay: pickFirstNotNull(animate.endDelay, options.endDelay, 0),
        easing: animate.easing || options.easing
      };

      if (!is.null(pathLength)) {
        // supply pathLength for path animations
        config.pathLength = pathLength;
      }

      iterableDOMProperties.forEach(property => {
        const animation = animations.find(anim => anim.property === property);
        const tween = this.parseTween(
          el,
          property,
          animate,
          from,
          animation,
          missingProps,
          config
        );

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