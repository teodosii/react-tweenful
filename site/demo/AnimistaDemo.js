import React from 'react';
import Tweenful from 'react-tweenful';

const AnimistaDemo = () => {
  return (
    <div className="animista">
      <Tweenful.div
        className="box-demo"
        duration={2000}
        easing="easeInOutCubic"
        //* Will be overriden by translateX being first mentioned in `animate`
        //* style={{ transform: 'rotate(45deg)' }}
        //* Order of transforms should be given by 'from'
        //* Defaults for transforms will be in the 'from' field
        // transform={{ scale: 3 }}
        style={{ position: 'relative' }}
        animate={[
          { left: '600px', delay: 1000 },
          { top: '600px', delay: 500 }
        ]}
        loop={3}
      ></Tweenful.div>
    </div>
  );
};

export default AnimistaDemo;
