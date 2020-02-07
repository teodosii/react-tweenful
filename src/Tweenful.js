import React from 'react';
import PropTypes from 'prop-types';
import { parseStartingTransform } from './utils';
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
    const { render, paused, animate } = this.props;

    if (prevProps.animate !== animate) {
      return this.playAnimation();
    }

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

  onProgressUpdateCallback(instance) {
    if (instance.progress < 1) return;

      // animation has completed
      instance.events.onAnimationEnd();

      if (instance.loop) {
        // start new animation loop
        this.playAnimation();
      }
  }

  updateAnimationProgress(instance, animatedProps) {
    this.setState(prevState => {
      return {
        style: {
          ...prevState.style,
          ...animatedProps
        }
      };
    }, () => this.onProgressUpdateCallback(instance));
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

['div', 'span', 'a', 'button', 'li', 'img'].forEach(type => {
  const func = props => <Tweenful type={type} {...props} />;
  Tweenful[type] = func;
  Tweenful[type].displayName = `Tweenful.${type}`;
  Tweenful[type].tweenful = true;
});

export default Tweenful;
