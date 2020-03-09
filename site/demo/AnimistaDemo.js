import React from 'react';
import Tweenful, { percentage } from 'react-tweenful';

const AnimistaDemo = () => {
  return (
    <div className="animista">
      <Tweenful.div
        className="box-demo"
        duration={4000}
        easing="easeOutCubic"
        style={{ position: 'relative' }}
        animate={[
          percentage({
            '0%': { left: '25px'},
            '10%': { left: '200px' },
            '30%': { left: '350px' },
            '50%': { left: '450px' },
            '80%': { left: '650px' },
            '100%': { left: '750px' }
          })
        ]}
        loop={false}
      ></Tweenful.div>
    </div>
  );
};

export default AnimistaDemo;
