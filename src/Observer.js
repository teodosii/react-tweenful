import React from 'react';
import PropTypes from 'prop-types';
import Engine from './engine';
import { is } from './utils';
import Parser from './parser';

class Observer extends React.Component {
  constructor(props) {
    super(props);
    this.el = React.createRef();
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
    if (!this.engine) return;
    this.engine.handleVisibility(document.visibilityState);
  }

  parseOnMount() {
    return Parser.parse(this.el.current, { ...this.props, animate: this.props.onMount });
  }

  parseOnUnmount() {
    const options = {
      ...this.props,
      from: {},
      animate: this.props.onUnmount
    };

    return Parser.parse(this.el.current, options);
  }

  componentDidMount() {
    this.addListeners();

    if (this.state.render) {
      this.animateMouting();
    }
  }

  componentDidUpdate(prevProps) {
    const { props } = this;

    if (!prevProps.render && props.render) {
      // queue mount animation after state update
      this.setState({ render: true }, this.animateMouting);
    }

    if (prevProps.render && !props.render) {
      // after animation finishes we'll render null to remove Observer from DOM
      this.animateUnmounting();
    }
  }

  animateMouting() {
    // animate only if we have onMount defined
    if (!this.props.onMount) return;

    this.mount = this.parseOnMount();
    this.mount.events.onMountStart();
    this.animate(this.mount);
  }

  animateUnmounting() {
    // animate only if we have onUnmount defined
    if (!this.props.onUnmount) return;

    this.unmount = this.parseOnUnmount();
    console.log(this.unmount);
    this.unmount.events.onUnmountStart();
    console.log('animating');
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

    delete propsToPass.onMount;
    delete propsToPass.onUnmount;
    delete propsToPass.render;
    delete propsToPass.children;
    delete propsToPass.events;

    return (
      <Type {...propsToPass} style={this.state.style} ref={this.el}>
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
      return <childEl.type {...childEl.props} style={style} />;
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
  onMount: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onUnmount: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  children: PropTypes.node
};

['div', 'span', 'a', 'button', 'li', 'img'].forEach(type => {
  const func = props => <Observer type={type} {...props} />;
  Observer[type] = func;
  Observer[type].displayName = `Observer.${type}`;
  Observer[type].tweenful = true;
});

export default Observer;
