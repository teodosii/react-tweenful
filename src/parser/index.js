import parseColor from 'color-parser';
import { colorProps, transformProps, validKeyframeProps } from '../helpers/constants';
import {
  is,
  getSvgElLength,
  normalizeTweenUnit,
  getValidDOMProperties,
  getAnimatableProperties,
  unitToNumber,
  getStartingValues,
  pickFirstNotNull,
  parseEasing
} from '../helpers';

class Parser {
  parse(el, options, transformFrom) {
    const animations = this.parseOptions(el, options, transformFrom);
    const duration = Math.max(...animations.map(({ tweens: t }) => t[t.length - 1].end));
    const events = this.parseEvents(options);

    return {
      duration,
      progress: 0,
      lastTick: 0,
      timesCompleted: 0,
      paused: false,
      delay: options.delay || 0,
      loop: options.loop,
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

  parseAnimate({ animate, duration }) {
    const result = [];
    const arr = is.array(animate) ? animate : [animate];

    arr.forEach(anim => {
      if (typeof anim === 'function') {
        result.push(...anim(duration));
      } else {
        result.push(anim);
      }
    });

    return result;
  }

  parseOptions(el, options, transformFrom) {
    const args = {
      el,
      options,
      transformFrom,
      animatable: this.parseAnimate(options)
    };

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
    const { duration, easing, endDelay, pathLength } = options;

    const isTransformProperty = transformProps.includes(property);
    const isPropertyTweenable = !missingProps.includes(property);
    const isColor = colorProps.includes(property);
    const delay = Math.max(0, options.delay);
    const end = duration + delay + endDelay;
    const tween = {
      duration,
      easing: parseEasing(easing),
      startDelay: delay,
      endDelay
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
      // tween is already part of an animation
      const lastTween = animation.tweens[animation.tweens.length - 1];
      tween.from = tween.from || lastTween.to;
      tween.to =
        tween.to || (isPropertyTweenable ? unitToNumber(animate[property] || 0) : lastTween.to);
      tween.start = lastTween.end + tween.startDelay;
      tween.end = lastTween.end + end;

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

    if (!isTransformProperty) {
      normalizeTweenUnit(el, tween.from, tween.to);
    }

    return tween;
  }

  getAnimations({ el, options, animatable, transformFrom }) {
    const animatableProps = getAnimatableProperties(animatable);
    const from = getStartingValues(el, transformFrom, animatableProps);
    const animations = [];

    animatable.forEach(animate => {
      const domProps = getValidDOMProperties(Object.keys(animate), validKeyframeProps);
      const missingProps = animatableProps.filter(p => !domProps.includes(p));
      const iterableDOMProperties = [...domProps, ...missingProps];

      const config = {
        loop: options.loop,
        duration: pickFirstNotNull(animate.duration, options.duration / animatable.length),
        delay: pickFirstNotNull(animate.delay, options.delay, 0),
        endDelay: pickFirstNotNull(animate.endDelay, options.endDelay, 0),
        easing: animate.easing || options.easing,
        // supply pathLength for path animations
        pathLength: is.svg(el) ? getSvgElLength(el) : 0
      };

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
