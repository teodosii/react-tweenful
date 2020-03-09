import React from 'react';
import { SVG, percentage, elastic } from 'react-tweenful';

const circles = new Array(10).fill(0).map((_e, i) => ({
  loop: true,
  fill: `hsl(${(i + 1) * 20 - 20}, 70%, 70%)`,
  delay: ((i + 1) * 1500) / -10,
  duration: 1500,
  easing: elastic(2, 0.9),
  transform: {
    translate: '0 100px'
  },
  style: {
    transformOrigin: `${-200 + 120 * (i + 1)}px 250px`
  },
  animate: percentage({
    '0%': { translate: '0px 100px', scale: 1 },
    '50%': { translate: '0px -100px', scale: 0.3 },
    '100%': { translate: '0px 100px', scale: 1 }
  }),
  r: 35,
  cx: 100 * i + 50,
  cy: 250
}));

const BouncingBalls = () => {
  return (
    <div className="bouncing-balls">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 500">
        {circles.map((circle, i) => (
          <SVG.circle key={i} {...circle}></SVG.circle>
        ))}
      </svg>
    </div>
  );
};

export default BouncingBalls;
