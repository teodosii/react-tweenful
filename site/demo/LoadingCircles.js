import React from 'react';
import Tweenful, { percentage } from 'react-tweenful';

const rotate = percentage({
  '0%': { translate: '-50% -50%', rotate: '0deg' },
  '50%': { translate: '-50% -50%', rotate: '0deg' },
  '80%': { translate: '-50% -50%', rotate: '360deg' },
  '100%': { translate: '-50% -50%', rotate: '360deg' }
});
const dot1Animate = percentage({
  '0%': { scale: 1 },
  '20%': { scale: 1 },
  '45%': { translate: '16px 12px', scale: 0.45 },
  '60%': { translate: '160px 150px', scale: 0.45 },
  '80%': { translate: '160px 150px', scale: 0.45 },
  '100%': { translate: '0px 0px', scale: 1 }
});
const dot2Animate = percentage({
  '0%': { scale: 1 },
  '20%': { scale: 1 },
  '45%': { translate: '-16px 12px', scale: 0.45 },
  '60%': { translate: '-160px 150px', scale: 0.45 },
  '80%': { translate: '-160px 150px', scale: 0.45 },
  '100%': { translate: '0px 0px', scale: 1 }
});
const dot3Animate = percentage({
  '0%': { scale: 1 },
  '20%': { scale: 1 },
  '45%': { translateY: '-18px', scale: 0.45 },
  '60%': { translateY: '-180px', scale: 0.45 },
  '80%': { translateY: '-180px', scale: 0.45 },
  '100%': { translateY: '0px', scale: 1 }
});

const LoadingCircles = () => {
  return (
    <div className="loading-wrapper">
      <Tweenful.div
        className="loading-circles-container"
        duration={2000}
        loop={true}
        easing="easeInOutCubic"
        transform={{ translate: '-50% -50%' }}
        animate={rotate}
      >
        <Tweenful.div
          className="dot dot-1"
          duration={2000}
          easing="easeOutCubic"
          loop={true}
          transform={{ translate: '0px 0px', scale: 1 }}
          animate={dot1Animate}
        ></Tweenful.div>
        <Tweenful.div
          className="dot dot-2"
          duration={2000}
          easing="easeOutCubic"
          loop={true}
          transform={{ translate: '0px 0px', scale: 1 }}
          animate={dot2Animate}
        ></Tweenful.div>
        <Tweenful.div
          className="dot dot-3"
          duration={2000}
          easing="easeOutCubic"
          loop={true}
          transform={{ translateY: '0px', scale: 1 }}
          animate={dot3Animate}
        ></Tweenful.div>
      </Tweenful.div>

      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default LoadingCircles;
