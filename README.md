# react-tweenful

Looking for an amazing React library for animating stuff? Look no more, we've got you covered!

## Demo

https://teodosii.github.io/react-tweenful/

## Features

* Loop support (infinite or up to a specific number)
* Wide variety of easings (bezier, predefined and custom easing)
* Delayed animations (before and after)
* Events support
* Negative delay support to mimic CSS animations
* Percent based animations to mimic CSS animations (e.g. `0%`, `50%`, `100%`)
* `Tweenful` component for animating DOM nodes
* `SVG` component to animate SVG nodes
* `Observer` component for mount/unmount animations
* `ObserverGroup` component to handle child transition (list removal/insertion, page transition etc)

## Getting started

```
npm install react-tweenful
```

### Development

In order to build the project and run it on your local machine, you'll need to build both the `site` project and the library itself. The `site` project will have a dependency of `react-tweenful` and there you'll be able to play with the examples.

```
npm run build:library:dev
npm run start
```

Or if you want to be able to modify both projects at once and let webpack watch the changes and do the build for you, then open 2 separate terminals and run the following commands

```
npm run watch:library:dev
```
And in a separate terminal run
```
npm run start
```

Both commands will instruct webpack to watch for changes.
Navigate to `http://localhost:8080/react-tweenful` or whatever port you're running the application on.

## Usage

`react-tweenful` exports the following:

* `Tweenful` - component to animate DOM elements. It requires a DOM node to perform animation on.
* `SVG` - component to animate SVG elements. It requires a SVG node to perform animation on.
* `Observer` - component to animate mounting and unmounting of an element.
* `ObserverGroup` - component to watch over a list of `Observer` elements such as list removal/insertion or route transition

A couple of utility functions are also exported to help you out animating:

* `percentage` for percentage based animations
* `bezier` for bezier easings
* `elastic` for elastic easing

Import the needed component, for example `Tweenful`

```jsx
import Tweenful, { elastic } from 'react-tweenful';
```

`Tweenful` requires a node to render on which it will perform the animation. We've got most of the DOM nodes covered in the form of namespacing such as `Tweenful.div`, `Tweenful.span` and so on.

```jsx
const Example = () => (
  <Tweenful.div	
    className="tween-box"	
    duration={2000}	
    easing={elastic(1, 0.1)}
    style={{ position: 'relative' }}	
    animate={{ left: ['0px', '250px'] }}
  ></Tweenful.div>
);
```

Voila!

## Examples

### Observer

View animation [here](https://teodosii.github.io/react-tweenful/observer)

Usage of `Observer` component together with `Tweenful`. Animate movement with `Tweenful` and subscribe to mount and unmount with `Observer`.

![Observer](https://github.com/teodosii/react-tweenful/raw/master/gif/observer.gif "Observer")

```jsx
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
```

### ObserverGroup

View animation [here](https://teodosii.github.io/react-tweenful/notifications)

Usage of `ObserverGroup` component to watch for mounting and unmounting over a list of notifications

![Notifications](https://github.com/teodosii/react-tweenful/raw/master/gif/notifications.gif "Notifications")

```jsx
<ObserverGroup
  config={{
    duration: 800,
    style: { overflow: 'hidden' },
    mount: { opacity: [0, 1], height: ['0px', 'auto'] },
    unmount: { opacity: [1, 0], height: ['auto', '0px'] },
    easing: 'easeInOutCubic'
  }}
  skipInitial={true}
>
  {this.state.notifications.map(notification => (
    <Notification
      key={notification.id}
      notification={notification}
      onClick={this.removeNotification}
    />
  ))}
</ObserverGroup>
```

### Animate route transition

View animation [here](https://teodosii.github.io/react-tweenful/transition)

Usage of `ObserverGroup` to animate route change

![Routing](https://github.com/teodosii/react-tweenful/raw/master/gif/transition.gif "Routing")

```jsx
import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import ObserverGroup from 'react-tweenful/ObserverGroup';
import Observer from 'react-tweenful/Observer';

const colors = {
  red: '#EE4266',
  yellow: '#FDB833',
  blue: '#296EB4',
  green: '#0EAD69'
};

const Red = () => <div className="color-block" style={{ backgroundColor: colors.red }}></div>;
const Yellow = () => <div className="color-block" style={{ backgroundColor: colors.yellow }}></div>;
const Blue = () => <div className="color-block" style={{ backgroundColor: colors.blue }}></div>;
const Green = () => <div className="color-block" style={{ backgroundColor: colors.green }}></div>;

class RouteTransitionDemo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location } = this.props;

    return (
      <div className="route-transition-demo">
        <ul className="nav-links">
          <li><NavLink to="/transition/red">Red</NavLink></li>
          <li><NavLink to="/transition/yellow">Yellow</NavLink></li>
          <li><NavLink to="/transition/blue">Blue</NavLink></li>
          <li><NavLink to="/transition/green">Green</NavLink></li>
        </ul>
        <div className="observer">
          <ObserverGroup>
            <Observer.div
              key={location.pathname}
              className="key-wrapper"
              duration={1000}
              style={{ opacity: 0 }}
              mount={{ opacity: 1 }}
              unmount={{ opacity: 0 }}
              easing={'easeOutQuad'}
            >
              <Switch location={location}>
                <Route exact path={`/transition/red`} component={Red} />
                <Route exact path={`/transition/green`} component={Green} />
                <Route exact path={`/transition/blue`} component={Blue} />
                <Route exact path={`/transition/yellow`} component={Yellow} />
                <Route render={() => <div>Not Found</div>} />
              </Switch>
            </Observer.div>
          </ObserverGroup>
        </div>
      </div>
    );
  }
}

export default RouteTransitionDemo;

```

### Prism

View animation [here](https://teodosii.github.io/react-tweenful/rotating-svg)

`react-tweenful` in action powering a super awesome looking animation.

![Prism](https://github.com/teodosii/react-tweenful/raw/master/gif/rotating-svg.gif "Prism")

```jsx
import React from 'react';
import { SVG } from 'react-tweenful';

const WAVE_COUNT = 16;
const offset = 40;
const waveLength = 375;
const duration = 1500;

const waves = new Array(WAVE_COUNT).fill(0).map((wave, i) => ({
  key: i + 1,
  style: {
    transformOrigin: '500px 500px',
    opacity: 4 / WAVE_COUNT,
    mixBlendMode: 'screen',
    fill: `hsl(${(360 / WAVE_COUNT) * (i + 1)}, 100%, 50%)`,
    transform: `rotate(${(360 / WAVE_COUNT) * i}deg) translate(${waveLength}px, ${offset}px)`
  },
  rotate: `${(360 / WAVE_COUNT) * (i + 1)}deg`,
  translate: `${waveLength}px ${offset}px`,
  angle: `${(360 / WAVE_COUNT) * (i + 1)}deg`,
  delay: (duration / WAVE_COUNT) * (i + 1) * -3,
  path:
    'M-1000,1000V388c86-2,111-38,187-38s108,38,187,38,111-38,187-38,108,38,187,38,111-38,187-38,108,38,187,38,111-38,187-38,109,38,188,38,110-38,187-38,108,38,187,38,111-38,187-38,108,38,187,38,111-38,187-38,108,38,187,38,111-38,187-38,109,38,188,38c0,96,0,612,0,612Z'
}));

const RotatingSvg = () => {
  return (
    <svg height="300" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000">
      <defs>
        <clipPath id="world">
          <circle cx="500" cy="500" r="450" stroke="none" fill="none"></circle>
        </clipPath>
      </defs>
      <circle cx="500" cy="500" r="450" stroke="none" fill="#000"></circle>
      <SVG
        type="g"
        className="circle"
        loop={true}
        duration={(WAVE_COUNT / 2) * duration}
        style={{ transformOrigin: '500px 500px' }}
        easing="linear"
        animate={{ rotate: '360deg' }}
      >
        {waves.map(wave => (
          <SVG.path
            loop={true}
            id={wave.key}
            key={wave.key}
            easing="linear"
            duration={1500}
            d={wave.path}
            style={wave.style}
            delay={wave.delay}
            transform={{ rotate: wave.rotate, translate: wave.translate }}
            animate={{ rotate: `${wave.angle}`, translate: `0px ${offset}px` }}
          />
        ))}
      </SVG>
    </svg>
  );
};
```

### SVG

View animation [here](https://teodosii.github.io/react-tweenful/svg)

An example animating SVG `path` and `fill` properties one after the other.

![SVG](https://github.com/teodosii/react-tweenful/raw/master/gif/svg-path.gif "SVG")

### Gradients

View animation [here](https://teodosii.github.io/react-tweenful/gradients)

An example using `elastic` easing to animate gradient boxes.

![Gradients](https://github.com/teodosii/react-tweenful/raw/master/gif/gradients.gif "Gradients")

```jsx
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
```

### Loader

View animation [here](https://teodosii.github.io/react-tweenful/loading-circles)

![Loader](https://github.com/teodosii/react-tweenful/raw/master/gif/rotating-circles.gif "Loader")

```jsx
import React from 'react';
import Tweenful, { percentage } from 'react-tweenful';

const rotate = percentage({
  '0%': { translate: '-50% -50%', rotate: '0deg' },
  '50%': { translate: '-50% -50%', rotate: '0deg' },
  '80%': { translate: '-50% -50%', rotate: '360deg' },
  '100%': { translate: '-50% -50%', rotate: '360deg' }
});
const dot1Animate = percentage({
  '0%': { scale: 1 },
  '20%': { scale: 1 },
  '45%': { translate: '16px 12px', scale: 0.45 },
  '60%': { translate: '160px 150px', scale: 0.45 },
  '80%': { translate: '160px 150px', scale: 0.45 },
  '100%': { translate: '0px 0px', scale: 1 }
});
const dot2Animate = percentage({
  '0%': { scale: 1 },
  '20%': { scale: 1 },
  '45%': { translate: '-16px 12px', scale: 0.45 },
  '60%': { translate: '-160px 150px', scale: 0.45 },
  '80%': { translate: '-160px 150px', scale: 0.45 },
  '100%': { translate: '0px 0px', scale: 1 }
});
const dot3Animate = percentage({
  '0%': { scale: 1 },
  '20%': { scale: 1 },
  '45%': { translateY: '-18px', scale: 0.45 },
  '60%': { translateY: '-180px', scale: 0.45 },
  '80%': { translateY: '-180px', scale: 0.45 },
  '100%': { translateY: '0px', scale: 1 }
});

const LoadingCircles = () => {
  return (
    <div className="loading-wrapper">
      <Tweenful.div
        className="loading-circles-container"
        duration={2000}
        loop={true}
        easing="easeInOutCubic"
        transform={{ translate: '-50% -50%' }}
        animate={rotate}
      >
        <Tweenful.div
          className="dot dot-1"
          duration={2000}
          easing="easeOutCubic"
          loop={true}
          transform={{ translate: '0px 0px', scale: 1 }}
          animate={dot1Animate}
        ></Tweenful.div>
        <Tweenful.div
          className="dot dot-2"
          duration={2000}
          easing="easeOutCubic"
          loop={true}
          transform={{ translate: '0px 0px', scale: 1 }}
          animate={dot2Animate}
        ></Tweenful.div>
        <Tweenful.div
          className="dot dot-3"
          duration={2000}
          easing="easeOutCubic"
          loop={true}
          transform={{ translateY: '0px', scale: 1 }}
          animate={dot3Animate}
        ></Tweenful.div>
      </Tweenful.div>

      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

```

### Bouncing Balls

View animation [here](https://teodosii.github.io/react-tweenful/bouncing-balls)

Bouncing balls illustrate negative delay support in `react-tweenful`

![Bouncing Balls](https://github.com/teodosii/react-tweenful/raw/master/gif/bouncing-ball.gif "Bouncing Balls")

```jsx
import React from 'react';
import { SVG, percentage, elastic } from 'react-tweenful';

const circles = new Array(10).fill(0).map((_e, i) => ({
  loop: true,
  fill: `hsl(${(i + 1) * 20 - 20}, 70%, 70%)`,
  delay: ((i + 1) * 1500) / -10,
  duration: 1500,
  easing: elastic(2, 0.9),
  transform: {
    translate: '0 100px'
  },
  style: {
    transformOrigin: `${-200 + 120 * (i + 1)}px 250px`
  },
  animate: percentage({
    '0%': { translate: '0px 100px', scale: 1 },
    '50%': { translate: '0px -100px', scale: 0.3 },
    '100%': { translate: '0px 100px', scale: 1 }
  }),
  r: 35,
  cx: 100 * i + 50,
  cy: 250
}));

const BouncingBalls = () => {
  return (
    <div className="bouncing-balls">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 500">
        {circles.map((circle, i) => (
          <SVG.circle key={i} {...circle}></SVG.circle>
        ))}
      </svg>
    </div>
  );
};
```

## API

**Update in progress. Stay in touch!**

## Note

A couple of the animations shown here have been initially created for CodePen by other folks. My only contribution to them was to convert them to `react-tweenful` to show real world examples on animating stuff.

## License

MIT
