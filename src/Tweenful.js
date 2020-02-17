import React from 'react';
import PropTypes from 'prop-types';
import { parseStartingTransform } from './utils';
import Parser from './parser';
import Engine from './engine';

class Tweenful extends React.Component {
  constructor(props) {
    super(props);

    const transformFrom = parseStartingTransform(props);
    const transform = transformFrom.order.map(prop => ({
      prop,
      args: transformFrom.domProperties[prop]
    }));
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
    this.onComplete = this.onComplete.bind(this);
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

    if (this.state.render) {
      this.play(true);
    }
  }

  componentDidUpdate(prevProps) {
    const { render, paused, animate } = this.props;

    if (prevProps.animate !== animate) {
      return this.play(true);
    }

    if (prevProps.render ^ render) {
      this.setState({ render }, () => render ? this.play(true) : this.stop());
    }

    if (prevProps.paused ^ paused) {
      (paused && this.pause()) || this.resume();
    }
  }

  onComplete(instance) {
    const { loop } = instance;

    if (!loop) return;
    if (isNaN(loop)) return this.play();

    instance.timesCompleted++;
    if (instance.timesCompleted < loop) {
      return this.play();
    }
  }

  play(reset = false) {
    if (this.engine) {
      this.engine.stop();
    }

    if (reset) {
      this.instance = Parser.parse(this.element.current, this.props, this.transformFrom);
    }

    this.engine = new Engine({
      instance: this.instance,
      animate: this.updateAnimationProgress,
      onComplete: this.onComplete
    });

    this.engine.play();
  }

  pause() {
    this.engine.pause();
  }

  resume() {
    this.engine.resume();
  }

  stop() {
    this.engine.stop();
  }

  updateAnimationProgress(instance, animatedProps) {
    this.setState(prevState => {
      return {
        style: {
          ...prevState.style,
          ...animatedProps
        }
      };
    });
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
