import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import Engine from './engine';
import { is } from './utils';
import Parser from './parser';

class Observer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: props.style,
      render: props.render
    };

    this.updateAnimationProgress = this.updateAnimationProgress.bind(this);
  }

  addListeners() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleVisibilityChange() {
    if (this.engine) {
      this.engine.handleVisibility(document.visibilityState);
    }
  }

  parseMount() {
    const el = ReactDOM.findDOMNode(this);
    return Parser.parse(el, { ...this.props, animate: this.props.mount });
  }

  parseUnmount() {
    const options = {
      ...this.props,
      from: {},
      animate: this.props.unmount
    };

    const el = ReactDOM.findDOMNode(this);
    return Parser.parse(el, options);
  }

  componentDidMount() {
    this.addListeners();

    if (this.state.render) {
      this.animateMounting();
    }
  }

  componentDidUpdate(prevProps) {
    const { props } = this;

    if (!prevProps.render && props.render) {
      // queue mount animation after state update
      this.setState({ render: true }, this.animateMounting);
    }

    if (prevProps.render && !props.render) {
      // after animation finishes we'll render null to remove Observer from DOM
      this.animateUnmounting();
    }
  }

  animateMounting() {
    if (!this.props.mount) return;
    this.mount = this.parseMount();
    this.mount.events.onMountStart();
    this.animate(this.mount);
  }

  animateUnmounting() {
    if (!this.props.unmount) return;
    this.unmount = this.parseUnmount();
    this.unmount.events.onUnmountStart();
    this.animate(this.unmount);
  }

  animate(instance) {
    instance.progress = 0;

    this.engine = new Engine({
      instance,
      animate: this.updateAnimationProgress
    });

    this.engine.play();
  }

  onProgressUpdateCallback(instance) {
    if (instance.progress < 1) return;

    if (instance === this.unmount) {
      // unmounting animation has completed
      instance.events.onUnmountEnd();
      return this.setState({ render: false });
    }

    // mounting animation has completed
    instance.events.onMountEnd();
  }

  updateAnimationProgress(instance, animatedProps) {
    this.setState(
      prevState => ({
        style: {
          ...prevState.style,
          ...animatedProps
        }
      }),
      () => this.onProgressUpdateCallback(instance)
    );
  }

  renderTag() {
    const { type: Type, children, ...propsToPass } = this.props;

    delete propsToPass.mount;
    delete propsToPass.unmount;
    delete propsToPass.render;
    delete propsToPass.children;
    delete propsToPass.events;

    return (
      <Type {...propsToPass} style={this.state.style}>
        {children}
      </Type>
    );
  }

  render() {
    const { type } = this.props;
    const { style, render } = this.state;

    if (!render) return null;

    let clonedElement;
    if (is.null(type)) {
      const childEl = React.Children.only(this.props.children);
      return React.cloneElement(childEl, { style });
    }

    return type ? this.renderTag() : clonedElement;
  }
}

Observer.defaultProps = {
  render: true
};

Observer.propTypes = {
  type: PropTypes.string,
  render: PropTypes.bool,
  mount: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  unmount: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  children: PropTypes.node
};

['div', 'span', 'a', 'button', 'li', 'img'].forEach(type => {
  const func = props => <Observer type={type} {...props} />;
  Observer[type] = func;
  Observer[type].displayName = `Observer.${type}`;
  Observer[type].tweenful = true;
});

export default Observer;
