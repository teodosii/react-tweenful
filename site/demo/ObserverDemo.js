import React, { useEffect, useState } from 'react';
import Observer from 'react-tweenful/Observer';
import Tweenful from 'react-tweenful/Tweenful';

const ObserverDemo = () => {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // unmount after 4500ms
    setTimeout(() => setShouldRender(false), 8000);
  }, []);

  return (
    <Observer
      render={shouldRender}
      duration={1200}
      style={{ opacity: 0 }}
      onMount={{ opacity: 1 }}
      onUnmount={[{ opacity: 0 }]}
      easing="linear"
    >
      <div className="observer-demo">
        <Tweenful.div
          render={true}
          className="box-demo"
          duration={2200}
          easing="linear"
          animate={[{ translateX: '400px' }]}
          loop={false}
          events={{
            onAnimationStart: () => console.log('AnimationStart'),
            onAnimationEnd: () => console.log('AnimationEnd')
          }}
        ></Tweenful.div>
      </div>
    </Observer>
  );
};

export default ObserverDemo;
