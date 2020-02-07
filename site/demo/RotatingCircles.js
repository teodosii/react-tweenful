import React from 'react';
import Tweenful from 'react-tweenful';

class RotatingCircles extends React.Component {
  render() {
    const circles = new Array(6)
      .fill(0)
      .map((_el, i) => (
        <div
          key={i}
          style={{ transform: `rotate(${(i - 1) * 60}deg) translateX(45px)` }}
          className="circle"
        ></div>
      ));

    return (
      <div className="rotating-container">
        <Tweenful.div
          easing="easeInOutQuart"
          duration={2000}
          loop={true}
          transform={{ scale: 0.25 }}
          animate={[
            { scale: 1.5, rotate: '90deg' },
            { scale: 0.25, rotate: '0deg' }
          ]}
          className="rotating-circles"
        >
          {circles}
        </Tweenful.div>
      </div>
    );
  }
}

export default RotatingCircles;
