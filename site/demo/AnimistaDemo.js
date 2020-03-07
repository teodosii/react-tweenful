import React from 'react';
import Tweenful, { percentage } from 'react-tweenful';

const AnimistaDemo = () => {
  return (
    <div className="animista">
      <Tweenful.div
        className="box-demo"
        duration={2000}
        easing="easeInOutCubic"
        style={{ position: 'relative' }}
        animate={[
          percentage({
            '0%': {},
            '10%': {},
            '30%': {},
            '50%': {},
            '80%': {},
            '100%': {}
          })
        ]}
        loop={3}
      ></Tweenful.div>
    </div>
  );
};

export default AnimistaDemo;
