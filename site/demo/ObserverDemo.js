import React, { useEffect, useState } from 'react';
import Tweenful, { Observer, elastic } from 'react-tweenful';

const props = {
  delay: 200,
  render: true,
  duration: 1600,
  easing: elastic(1, 0.1),
  loop: false,
  animate: { translateX: '400px' },
  events: {
    onAnimationStart: () => console.log('AnimationStart'),
    onAnimationEnd: () => console.log('AnimationEnd')
  }
};

const ObserverDemo = () => {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    setTimeout(() => setShouldRender(false), 3000);
  }, []);

  return (
    <Observer
      render={shouldRender}
      duration={1200}
      style={{ opacity: 0 }}
      mount={{ opacity: 1 }}
      unmount={[{ opacity: 0 }]}
      easing="linear"
    >
      <div className="observer-demo">
        <Tweenful.div className="box-demo" {...props}></Tweenful.div>
      </div>
    </Observer>
  );
};

export default ObserverDemo;
