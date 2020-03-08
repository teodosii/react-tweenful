import React from 'react';
import Tweenful from 'react-tweenful';

const Gradients = () => {
  const elements = new Array(10)
    .fill(0)
    .map((_e, i) => (
      <Tweenful.div
        className={`gradiant${i + 1} box`}
        loop={true}
        easing="elastic"
        duration={3000}
        delay={i * 100}
        endDelay={(10 - i) * 100}
        animate={[{ height: '100px' }, { height: ['100px', 'auto'] }]}
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
