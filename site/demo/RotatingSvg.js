import React from 'react';
import { SVG } from 'react-tweenful';

const WAVE_COUNT = 16;
const offset = 40;
const waveLength = 375;
const duration = 1500;

const waves = new Array(WAVE_COUNT).fill(0).map((wave, i) => ({
  key: i + 1,
  style: {
    transformOrigin: '500px 500px',
    opacity: 4 / WAVE_COUNT,
    mixBlendMode: 'screen',
    fill: `hsl(${(360 / WAVE_COUNT) * (i + 1)}, 100%, 50%)`,
    transform: `rotate(${(360 / WAVE_COUNT) * i}deg) translate(${waveLength}px, ${offset}px)`
  },
  rotate: `${(360 / WAVE_COUNT) * (i + 1)}deg`,
  translate: `${waveLength}px ${offset}px`,
  angle: `${(360 / WAVE_COUNT) * (i + 1)}deg`,
  delay: (duration / WAVE_COUNT) * (i + 1) * -3,
  path:
    'M-1000,1000V388c86-2,111-38,187-38s108,38,187,38,111-38,187-38,108,38,187,38,111-38,187-38,108,38,187,38,111-38,187-38,109,38,188,38,110-38,187-38,108,38,187,38,111-38,187-38,108,38,187,38,111-38,187-38,108,38,187,38,111-38,187-38,109,38,188,38c0,96,0,612,0,612Z'
}));

const RotatingSvg = () => {
  return (
    <svg height="300" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000">
      <defs>
        <clipPath id="world">
          <circle cx="500" cy="500" r="450" stroke="none" fill="none"></circle>
        </clipPath>
      </defs>
      <circle cx="500" cy="500" r="450" stroke="none" fill="#000"></circle>
      <g
        className="circle"
        loop={true}
        duration={WAVE_COUNT * duration}
        style={{ transformOrigin: "500px 500px" }}
        easing="linear"
        animate={{ }}
      >
        {waves.map(wave => (
          <SVG.path
            loop={true}
            id={wave.key}
            key={wave.key}
            easing="linear"
            duration={1500}
            d={wave.path}
            style={wave.style}
            delay={wave.delay}
            transform={{ rotate: wave.rotate, translate: wave.translate }}
            animate={{ rotate: `${wave.angle}`, translate: `0px ${offset}px` }}
          />
        ))}
      </g>
    </svg>
  );
};

export default RotatingSvg;
