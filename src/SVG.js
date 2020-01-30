import React from 'react';
import PropTypes from 'prop-types';
import { getSvgElLength } from './svg-utils';
import Parser from './parser';
import Engine from './engine';

class SVG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: props.style,
      render: props.render
    };
    
    this.el = React.createRef();
    this.updateAnimationProgress = this.updateAnimationProgress.bind(this);
  }

  componentDidMount() {
    if (!this.state.render) return;

    this.instance = Parser.parse(this.el.current, this.props);
    this.setState((prevState) => ({
      style: {
        ...prevState.style,
        strokeDasharray: getSvgElLength(this.el.current),
        strokeDashoffset: 1500
      }
    }), this.playAnimation);
  }

  playAnimation() {
    this.instance.progress = 0;

    this.engine = new Engine({
      instance: this.instance,
      animate: this.updateAnimationProgress,
      el: this.el.current
    });

    this.engine.play();
  }

  componentDidUpdate(prevProps) {
    const { props } = this;

    if (!prevProps.render && props.render) {
      this.instance = Parser.parse(this.el.current, this.animate);
      this.setState({ render: true }, this.playAnimation);
    }
  }

  checkProgress(progress, length) {
    if (progress < 1) return;

    this.setState((prevState) => ({
      style: {
        ...prevState.style,
        strokeDasharray: `${length}`,
        strokeDashoffset: null
      }
    }));
  }

  updateAnimationProgress(instance, animatedProps) {
    const { current: el } = this.el;
    const length = getSvgElLength(el);

    this.setState(
      prevState => ({
        style: {
          ...prevState.style,
          ...animatedProps
        }
      }),
      () => this.checkProgress(instance.progress, length)
    );
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

['circle', 'ellipse', 'path', 'line', 'polygon', 'polyline', 'rect', 'text'].forEach(type => {
  const func = props => <SVG type={type} {...props} />;
  SVG[type] = func;
  SVG[type].displayName = `SVG.${type}`;
  SVG[type].tweenful = true;
});

export default SVG;
