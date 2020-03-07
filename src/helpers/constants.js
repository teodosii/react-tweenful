export const validDOMProperties = [
  'left',
  'right',
  'top',
  'fill',
  'bottom',
  'opacity',
  'strokeDashoffset',
  'backgroundColor',
  'borderRadius',
  'height',
  'width',
  'marginBottom',
  'marginTop'
];

export const colorProps = ['fill', 'color', 'backgroundColor'];

export const transformProps = [
  'translate',
  'translate3d',
  'translateX',
  'translateY',
  'translateZ',
  'skew',
  'skewX',
  'skewY',
  'scale',
  'scale3d',
  'scaleX',
  'scaleY',
  'scaleZ',
  'rotate',
  'rotate3d',
  'rotateX',
  'rotateY',
  'rotateZ',
  'transformOrigin'
];

export const validKeyframeProps = [
  ...validDOMProperties.slice(0, validDOMProperties.length - 1),
  ...transformProps
];

export const svgProps = [
  'stroke',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeDashOpacity',
  'fill',
  'fillOpacity'
];

export const validTransforms = {
  translate: { argsMin: 1, argsMax: 2, start: 0 },
  translate3d: { argsMin: 3, argsMax: 3, start: 0 },
  translateX: { argsMin: 1, argsMax: 1, start: 0 },
  translateY: { argsMin: 1, argsMax: 1, start: 0 },
  translateZ: { argsMin: 1, argsMax: 1, start: 0 },
  skew: { argsMin: 1, argsMax: 2, start: 0 },
  skewX: { argsMin: 1, argsMax: 1, start: 0 },
  skewY: { argsMin: 1, argsMax: 1, start: 0 },
  scale: { argsMin: 1, argsMax: 2, start: 1 },
  scale3d: { argsMin: 3, argsMax: 3, start: 1 },
  scaleX: { argsMin: 1, argsMax: 1, start: 1 },
  scaleY: { argsMin: 1, argsMax: 1, start: 1 },
  scaleZ: { argsMin: 1, argsMax: 1, start: 1 },
  rotate: { argsMin: 1, argsMax: 1, start: 0 },
  rotate3d: { argsMin: 4, argsMax: 4, start: 0 },
  rotateX: { argsMin: 1, argsMax: 1, start: 0 },
  rotateY: { argsMin: 1, argsMax: 1, start: 0 },
  rotateZ: { argsMin: 1, argsMax: 1, start: 0 }
};

export const regexExpressions = {
  // 100px, 25%, 30deg
  functionArguments: () => /[ \t]*([-]{0,1}\d+(\.*\d*))(px|%|deg|){1}[ \t]*/g,
  // 100px
  unit: () => /(([-]?[0-9]+.[0-9]+)|([-]?[0-9]+))(%|[a-zA-Z]+|)/g,
  // 100% 25rem 30px
  valueUnitPair: () =>
    /[+-]?\d*\.?\d+(?:\.\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vargsMin|vargsMax|deg|rad)?/g
};
