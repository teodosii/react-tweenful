import parseColor from 'color-parser';
import easings from '../easings';
import { getSvgElLength } from './svg-utils';
import {
  colorProps,
  validTransforms,
  validDOMProperties,
  validKeyframeProps,
  regexExpressions,
  transformProps
} from './constants';

export const percentage = object => duration => {
  const keys = Object.keys(object)
    .map(i => parseInt(i.slice(0, -1), 10))
    .sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

  const calculateDiff = index => {
    const curr = keys[index];
    const next = keys[index + 1];
    return next - curr;
  };

  const parsedAnimate = [];
  keys.forEach((key, index) => {
    if (index + 1 === keys.length) return;

    if (index === 0) {
      parsedAnimate.push({
        duration: 0,
        ...object[`${key}%`]
      });
    }

    const nextKey = keys[index + 1];
    const next = object[`${nextKey}%`];
    const percentRange = calculateDiff(index);
    parsedAnimate.push({
      duration: (percentRange / 100) * duration,
      ...next
    });
  });

  return parsedAnimate;
};

export const find = (arr, e) => arr.find(a => e.key === a.key);

export const toArray = object => {
  if (is.null(object)) return [];
  if (Array.isArray(object)) return object;
  return [object];
};

export const is = {
  svg: el => el instanceof SVGElement,
  null: value => value === undefined || value === null,
  array: el => Array.isArray(el)
};

export const toUnit = val => {
  const result = regexExpressions.valueUnitPair().exec(val);
  return result ? result[1] : '';
};

export const auto = () => [{ value: 'auto', unit: '', auto: true }];

export const unitToNumber = string => {
  if (is.null(string) || string === '') return null;
  if (string === 'auto') return auto();

  const groups = getRegexGroups(regexExpressions.valueUnitPair(), string);
  return groups.map(group => {
    const match = regexExpressions.valueUnitPair().exec(group);
    return {
      value: parseFloat(match[0]),
      unit: match[1] || ''
    };
  });
};

export const normalizeTweenUnit = (el, tween) => {
  const { from: tweenFrom, to: tweenTo } = tween;

  for (let i = 0; i < tweenFrom.length; i += 1) {
    const from = tweenFrom[i];
    const to = tweenTo[i];

    // color will return an array such as [255, 255, 255, 255]
    if (is.null(from.unit) || is.null(to.unit)) continue;
    // skip pixel to pixel conversion
    if (from.unit === 'px' && to.unit === 'px') continue;
    // skip unitless conversion for now, such as opacity
    if (from.unit === '' && to.unit === '') continue;

    if (to.unit === 'px' && from.auto) continue;
    if (from.unit === 'px' && to.auto) continue;

    if (from.unit !== 'px') {
      const convertedValue = convertUnitToPixels(el, from.value, from.unit);
      from.value = convertedValue;
      from.unit = 'px';
    }

    if (to.unit !== 'px') {
      const convertedValue = convertUnitToPixels(el, to.value, to.unit);
      to.value = convertedValue;
      to.unit = 'px';
    }
  }
};

export const parseStartingTransform = ({ transform }) => {
  if (!transform) return { order: [], domProperties: {} };

  const keys = Object.keys(transform);
  const domProperties = getValidDOMProperties(keys, transformProps);
  const props = {};
  domProperties.forEach(prop => (props[prop] = unitToNumber(transform[prop])));

  return {
    order: domProperties,
    domProperties: props
  };
};

export const convertUnitToPixels = (el, value, conversionUnit) => {
  const unit = toUnit(value);
  if (['deg', 'rad', 'turn'].includes(unit)) return;

  const baseline = 100;
  const tempEl = el.cloneNode();
  const parentEl = el.parentNode && el.parentNode !== document ? el.parentNode : document.body;

  parentEl.appendChild(tempEl);
  tempEl.style.position = 'relative';
  tempEl.style.height = `${baseline}${conversionUnit}`;
  const offset = tempEl.offsetHeight;
  parentEl.removeChild(tempEl);

  return (parseFloat(value) * offset) / 100;
};

export const getValidDOMProperties = (properties, lookupList = validDOMProperties) => {
  const validProperties = [];
  properties.forEach(property => {
    if (lookupList.indexOf(property) > -1) {
      validProperties.push(property);
    }
  });

  return validProperties;
};

export const getPropertyProgress = (tween, easing) => {
  const eased = (from, to) => from + easing * (to - from);
  const { from, to } = tween;

  if (tween.color) {
    const rgb = {
      r: eased(from[0], to[0]),
      g: eased(from[1], to[1]),
      b: eased(from[2], to[2]),
      a: eased(from[3], to[3])
    };
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
  } else if (tween.path) {
    return `${eased(from[0].value, to[0].value)}`;
  }

  const [{ unit }] = from;
  return `${eased(from[0].value, to[0].value)}${unit}`;
};

export const getAnimationProgress = (tick, lastTick, animations, el) => {
  const getTween = (tweens, tick) => tweens.find(({ start, end }) => tick >= start && tick <= end);

  const animatedProps = {};
  const transforms = [];

  animations.forEach(animate => {
    const { property, tweens } = animate;
    const tween = getTween(tweens, tick) || getTween(tweens, lastTick);
    // check if lastTick matches any tween in order to complete animation at 100%
    if (!tween) return;

    const tweenProgress = calculateProgress(tick - tween.start, tween.duration);
    const easing = tween.easing(tweenProgress);

    if (transformProps.indexOf(property) > -1) {
      const easedTransformValues = tween.to.map(({ value: to, unit }, index) => {
        const { value: from } = tween.from[index];
        const eased = from + easing * (to - from);
        return `${eased}${unit}`;
      });

      transforms.push(`${property}(${easedTransformValues.map(i => i)})`);
    } else if (property === 'strokeDashoffset') {
      const pathLength = getSvgElLength(el);
      animatedProps['strokeDasharray'] = pathLength;
      animatedProps['strokeDashoffset'] = (getPropertyProgress(tween, easing) / 100) * pathLength;
    } else {
      animatedProps[property] = getPropertyProgress(tween, easing);
    }
  });

  if (transforms.length > 0) {
    animatedProps.transform = transforms.reduce((funcs, t) => `${funcs} ${t}`);
  }

  return animatedProps;
};

export const getAnimatableProperties = array => {
  const animatableProps = [];
  array.forEach(elem => {
    const keys = Object.keys(elem);
    const domProperties = getValidDOMProperties(keys, validKeyframeProps);
    domProperties.forEach(prop => {
      if (animatableProps.indexOf(prop) === -1) {
        animatableProps.push(prop);
      }
    });
  });

  return animatableProps;
};

const getTransformMapping = (transformFrom, mappedTransform, property) => {
  if (is.null(transformFrom.domProperties[property])) {
    // will help knowing where to start animating from (e.g. 0, 1)
    return new Array(mappedTransform.argsMax).fill(0).map(() => ({
      value: mappedTransform.start,
      unit: ''
    }));
  }

  return transformFrom.domProperties[property];
};

export const getStartingValues = (element, transformFrom, animatableProps) => {
  const defaultProperties = {};
  const computed = getComputedStyle(element);

  animatableProps.forEach(property => {
    const mappedTransform = validTransforms[property];
    if (mappedTransform) {
      defaultProperties[property] = getTransformMapping(transformFrom, mappedTransform, property);
      return;
    }

    let val = computed[property];
    if (property === 'height') {
      val = element.scrollHeight;
    } else if (property === 'width') {
      val = element.scrollWidth;
    }

    if (colorProps.indexOf(property) > -1) {
      const { r, g, b, a } = parseColor(val);
      defaultProperties[property] = [r, g, b, a];
      return;
    }

    const unit = property === 'opacity' ? '' : 'px';
    defaultProperties[property] = unitToNumber(`${val}${unit}`);
  });

  return defaultProperties;
};

export const getRegexGroups = (regex, string) => {
  let groups = [];
  let match = regex.exec(string);
  while (match) {
    groups.push(match[0]);
    match = regex.exec(string);
  }

  return groups;
};

export const parseFunctionArguments = string => {
  const regex = regexExpressions.functionArguments();
  return getRegexGroups(regex, string).map(value => value.trim());
};

export const parseEasing = easing => {
  if (typeof easing === 'function') {
    return easing;
  }

  return easings[easing];
};

export const pickFirstNotNull = (...values) => {
  if (!values || !values.length) return null;
  return values.find(val => !is.null(val));
};

export const calculateProgress = (tick, duration) => {
  const progress = getProgress(tick, duration);
  return Math.min(progress, 1);
};

export const getProgress = (tick, duration) => (tick === 0 ? 0 : tick / duration);
