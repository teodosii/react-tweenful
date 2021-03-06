import React from 'react';
import Tweenful, { elastic } from 'react-tweenful';

const Gradients = () => {
  const elements = new Array(10)
    .fill(0)
    .map((_e, i) => (
      <Tweenful.div
        className={`gradiant${i + 1} box`}
        loop={true}
        easing={elastic(1, 0.1)}
        duration={3000}
        delay={i * 100}
        endDelay={(10 - i) * 100}
        animate={[{ height: '20%' }, { height: ['20%', 'auto'] }]}
        key={i}
      ></Tweenful.div>
    ));

  return (
    <div className="gradients-container">
      <div className="row">{elements}</div>
    </div>
  );
};

export default Gradients;
