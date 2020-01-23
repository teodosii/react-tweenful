import React from 'react';
import Tweenful from 'react-tweenful';

const AnimistaDemo = () => {
  return (
    <div className="animista">
      <Tweenful.div
        className="box-demo"
        duration={1000}
        easing="easeInOutCubic"
        //* Will be overriden by translateX being first mentioned in `animate`
        //* style={{ transform: 'rotate(45deg)' }}
        //* Order of transforms should be given by 'from'
        //* Defaults for transforms will be in the 'from' field
        transform={{ scale: 3 }}
        animate={[
          { scale: 1.5 },
          { translate: '50px 50px' }
        ]}
        loop={false}
      ></Tweenful.div>
    </div>
  );
};

export default AnimistaDemo;
