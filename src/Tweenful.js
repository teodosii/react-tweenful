import React from 'react';
import PropTypes from 'prop-types';
import { calculateProgress, parseStartingTransform, getAnimationProgress } from './utils';
import Parser from './parser';
import Engine from './engine';

class Tweenful extends React.Component {
  constructor(props) {
    super(props);

    const transformFrom = parseStartingTransform(props);
    const transform = transformFrom.order.map(prop => ({ prop, args: transformFrom.domProperties[prop] }));
    const mappedArgs = args => `${args.map(arg => `${arg.value}${arg.unit}`).join(', ')}`;
    const transformFunctions = transform.map(t => `${t.prop}(${mappedArgs(t.args)})`);

    this.transformFrom = transformFrom;
    this.element = React.createRef();
    this.state = {
      style: {
        ...props.style,
        transform: transformFunctions.join(' ')
      },
      render: props.render
    };

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.updateAnimationProgress = this.updateAnimationProgress.bind(this);
  }

  addListeners() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleVisibilityChange() {
    if (!this.engine) return;
    this.engine.handleVisibility(document.visibilityState);
  }

  componentDidMount() {
    this.addListeners();
    this.instance = Parser.parse(
      this.element.current,
      this.props,
      this.transformFrom
    );

    if (this.state.render) {
      this.playAnimation(!this.props.paused);
    }
  }

  componentDidUpdate(prevProps) {
    const { render, paused } = this.props;

    // 'render' change on didUpdate
    if (!prevProps.render && render) {
      this.playAnimation();
    } else if (!render && prevProps.render) {
      this.stopAnimation();
    }

    // 'paused' change on didUpdate
    if (!prevProps.paused && paused) {
      this.pauseAnimation();
    } else if (prevProps.paused && !paused) {
      this.resumeAnimation();
    }
  }

  playAnimation(play = true) {
    this.instance.progress = 0;
    this.engine = new Engine({
      instance: this.instance,
      animate: this.updateAnimationProgress
    });

    if (play) {
      this.instance.events.onAnimationStart();
      this.engine.play();
    }
  }

  pauseAnimation() {
    this.engine.pause();
  }

  resumeAnimation() {
    this.engine.resume();
  }

  stopAnimation() {
    this.engine.stop();
  }

  updateAnimationProgress(tick) {
    const { duration, animations } = this.instance;
    const { current: el } = this.element;
    const { lastElapsed } = this.engine;

    this.instance.progress = calculateProgress(tick, duration);
    const animatedProps = getAnimationProgress(tick, lastElapsed, animations, el);

    const callback = () => {
      if (this.instance.progress < 1) return;

      // animation has completed
      this.instance.events.onAnimationEnd();

      if (this.instance.loop) {
        // start new animation loop
        this.playAnimation();
      }
    };

    this.setState(prevState => {
      return {
        style: {
          ...prevState.style,
          ...animatedProps
        }
      };
    }, callback);
  }

  render() {
    const {
      props: { type: Type, ...passedProps },
      state: { render, style }
    } = this;

    if (!render) return null;

    delete passedProps.delay;
    delete passedProps.endDelay;
    delete passedProps.animate;
    delete passedProps.keyframes;
    delete passedProps.duration;
    delete passedProps.easing;
    delete passedProps.from;
    delete passedProps.loop;
    delete passedProps.direction;
    delete passedProps.render;
    delete passedProps.running;
    delete passedProps.paused;
    delete passedProps.context;
    delete passedProps.events;
    delete passedProps.transform;

    return <Type {...passedProps} ref={this.element} style={style}></Type>;
  }
}

Tweenful.defaultProps = {
  render: true,
  running: true,
  paused: false
};

Tweenful.propTypes = {
  type: PropTypes.string,
  render: PropTypes.bool,
  running: PropTypes.bool,
  paused: PropTypes.bool,
  children: PropTypes.node
};

Tweenful.div = props => <Tweenful type="div" {...props} />;
Tweenful.span = props => <Tweenful type="span" {...props} />;
Tweenful.a = props => <Tweenful type="a" {...props} />;
Tweenful.button = props => <Tweenful type="button" {...props} />;
Tweenful.li = props => <Tweenful type="li" {...props} />;
Tweenful.img = props => <Tweenful type="img" {...props} />;

Tweenful.div.displayName = 'Tweenful.div';
Tweenful.span.displayName = 'Tweenful.span';
Tweenful.a.displayName = 'Tweenful.a';
Tweenful.button.displayName = 'Tweenful.button';
Tweenful.li.displayName = 'Tweenful.li';
Tweenful.img.displayName = 'Tweenful.img';

export default Tweenful;
