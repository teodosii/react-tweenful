import React from 'react';
import PropTypes from 'prop-types';
import { parseStartingTransform } from './utils';
import { getSvgElLength } from './svg-utils';
import Parser from './parser';
import Engine from './engine';

class SVG extends React.Component {
  constructor(props) {
    super(props);

    const transformFrom = parseStartingTransform(props);
    this.transformFrom = transformFrom;
    this.state = {
      style: {
        ...props.style
      },
      render: props.render
    };

    this.el = React.createRef();
    this.updateAnimationProgress = this.updateAnimationProgress.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
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
    if (!this.state.render) return;

    this.setState(
      prevState => ({
        style: {
          ...prevState.style,
          strokeDasharray: getSvgElLength(this.el.current),
          strokeDashoffset: 1500
        }
      }),
      () => this.play(true)
    );
  }

  play(reset = false) {
    if (this.engine) {
      this.engine.stop();
    }

    if (reset) {
      this.instance = Parser.parse(this.el.current, this.props, this.transformFrom);
      // console.log(this.instance);
    }

    this.engine = new Engine({
      id: this.props.id,
      instance: this.instance,
      animate: this.updateAnimationProgress,
      el: this.el.current,
      onComplete: this.onComplete
    });
    this.engine.play();
  }

  stop() {
    this.engine.stop();
  }

  componentDidUpdate(prevProps) {
    const { render } = this.props;

    if (prevProps.render ^ render) {
      this.setState({ render }, () => render ? this.play(true) : this.stop());
    }
  }

  resetSvgPath() {
    this.setState(prevState => ({
      style: {
        ...prevState.style,
        strokeDasharray: 0,
        strokeDashoffset: null
      }
    }));
  }

  onComplete(instance) {
    // console.log("END");
    instance.timesCompleted++;

    const { loop } = instance;
    if (loop === false || loop === 0) {
      return this.resetSvgPath();
    } else if (loop === true) {
      return this.play();
    } else if (instance.timesCompleted < loop) {
      return this.play();
    }
  }

  updateAnimationProgress(instance, animatedProps) {
    // if (instance.timesCompleted <= 1 && this.props.id === 1) console.log({ animatedProps });
    this.setState(prevState => ({
      style: {
        ...prevState.style,
        ...animatedProps
      }
    }));
  }

  render() {
    const { style, render } = this.state;
    const { type: Type, children, ...propsToPass } = this.props;

    if (!render) return null;

    delete propsToPass.delay;
    delete propsToPass.endDelay;
    delete propsToPass.animate;
    delete propsToPass.keyframes;
    delete propsToPass.duration;
    delete propsToPass.easing;
    delete propsToPass.from;
    delete propsToPass.type;
    delete propsToPass.animate;
    delete propsToPass.render;
    delete propsToPass.children;
    delete propsToPass.transform;

    return (
      <Type {...propsToPass} style={style} ref={this.el}>
        {children}
      </Type>
    );
  }
}

SVG.defaultProps = {
  render: true
};

SVG.propTypes = {
  render: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node,
  animate: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

['circle', 'ellipse', 'path', 'line', 'polygon', 'polyline', 'rect', 'text', 'g'].forEach(type => {
  const func = props => <SVG type={type} {...props} />;
  SVG[type] = func;
  SVG[type].displayName = `SVG.${type}`;
  SVG[type].tweenful = true;
});

export default SVG;
