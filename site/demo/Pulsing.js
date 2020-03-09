import React from 'react';
import Tweenful, { SVG } from 'react-tweenful';

const Pulsing = () => {
  const animations = [];
  const innerCircles = 12;
  const duration = 1600;
  const delay = duration / innerCircles;

  for (let index = 0; index < innerCircles; index++) {
    animations.push(
      <Tweenful.div
        key={index}
        duration={duration}
        easing="linear"
        transform={{ scale: 0 }}
        animate={{ scale: [0, 1.5], opacity: 0 }}
        className="pulse-element"
        loop={true}
        delay={delay * index}
      ></Tweenful.div>
    );
  }

  return (
    <div className="pulsing-demo">
      <svg height="300" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 400 400">
        <SVG.circle
          cx="125"
          cy="125"
          r="95"
          fill="none"
          duration={4000}
          easing="easeInQuad"
          transform="rotate(270 125 125)"
          style={{ fill: '#fff' }}
          animate={{ strokeDashoffset: [100, 0] }}
          stroke="#b91e1e"
          strokeWidth="15"
        ></SVG.circle>
      </svg>
      <>{animations}</>
    </div>
  );
};

export default Pulsing;
