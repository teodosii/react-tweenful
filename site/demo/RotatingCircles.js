import React from 'react';
import Tweenful from 'react-tweenful';

class RotatingCircles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transform: {},
      animate: {}
    };
  }

  startAnimation(lastIndex) {
    if (lastIndex < 5) return;
    this.setState({
      transform: { scale: 1 },
      animate: [
        { rotate: ['0deg', '360deg'], duration: 800 },
        { scale: 1.85, rotate: ['360deg', '90deg'] },
        { scale: 0.25, rotate: ['90deg', '45deg'] },
        { scale: 1, rotate: ['45deg', '0deg'] }
      ]
    });
  }

  getDivElements() {
    if (this.elements) {
      return this.elements;
    }

    this.elements = new Array(6).fill(0).map((_el, i) => (
      <Tweenful.div
        key={i}
        duration={1200}
        easing="elastic"
        transform={{ translateY: `${80 * (i - 3)}px`, translateX: '-1200px' }}
        animate={[
          {
            opacity: [-1, 1],
            rotate: `0deg`,
            translateX: ['-1000px', '-300px'],
            delay: i * 400
          },
          {
            easing: 'easeOutQuart',
            translateX: '30px',
            translateY: '0px',
            rotate: `${(i - 1) * 60}deg`,
            delay: 6 * 400,
            opacity: [1, 0.75]
          }
        ]}
        events={{
          onAnimationEnd: () => this.startAnimation(i)
        }}
        className="circle"
      ></Tweenful.div>
    ));

    return this.elements;
  }

  render() {
    const { animate, transform } = this.state;
    const circles = this.getDivElements();

    return (
      <div className="rotating-container">
        <Tweenful.div
          easing="easeInOutQuart"
          duration={2000}
          transform={transform}
          animate={animate}
          loop={true}
          className="rotating-circles"
        >
          {circles}
        </Tweenful.div>
      </div>
    );
  }
}

export default RotatingCircles;
