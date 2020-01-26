import React from 'react';
import PropTypes from 'prop-types';
import Observer from './Observer';
import { toArray } from './utils';

class ObserverGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: toArray(props.children).map(child => this.mapChild(child))
    };

    this.didRender = false;
  }

  mapChild(child) {
    const { config, skipInitial } = this.props;

    const childEvents = child.props.events || {};
    const skipMountAnimation = !this.didRender && skipInitial;

    const events = {
      ...childEvents,
      onUnmountEnd: () => {
        (childEvents.onUnmountEnd || function() {})();
        this.onChildUnmount(child.key);
      }
    };

    if (!child.type.tweenful) {
      const mount = { ...config.mount, duration: 10 };
      const passedProps = {
        ...config,
        mount: skipMountAnimation ? mount : config.mount,
        key: child.key,
        events
      };

      return React.createElement(Observer, passedProps, child);
    }

    if (skipMountAnimation) {
      const propsToPass = { events, mount: { ...child.props.mount, duration: 10 } };
      return React.cloneElement(child, propsToPass);
    }

    return React.cloneElement(child, { events });
  }

  mapRemovedChild(child) {
    const stateMappedChild = this.state.children.find(c => c.key === child.key);
    return React.cloneElement(stateMappedChild, { render: false });
  }

  componentDidUpdate(prevProps) {
    this.didRender = true;

    if (this.props.children !== prevProps.children) {
      const children = toArray(this.props.children);
      const prevChildren = toArray(prevProps.children);

      const addedChildren = children
        .filter(child => !prevChildren.find(({ key }) => key === child.key))
        .map(child => this.mapChild(child));

      const removedChildren = prevChildren
        .filter(child => !children.find(({ key }) => key === child.key))
        .map(child => this.mapRemovedChild(child));

      this.setState(prevState => ({
        children: [
          ...prevState.children.map(child => {
            const removedEl = removedChildren.find(rem => rem.key === child.key);
            return removedEl || child;
          }),
          ...addedChildren
        ]
      }));
    }
  }

  onChildUnmount(key) {
    this.setState(prevState => ({
      children: prevState.children.filter(child => child.key !== key)
    }));
  }

  render() {
    const { type: Type } = this.props;
    const { children } = this.state;

    if (Type) {
      const { ...propsToPass } = this.props;
      delete propsToPass.children;
      delete propsToPass.config;
      return <Type {...propsToPass}>{children}</Type>;
    }

    return children;
  }
}

ObserverGroup.propTypes = {
  skipInitial: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.instanceOf(Observer),
    PropTypes.arrayOf(PropTypes.instanceOf(Observer)),
    PropTypes.arrayOf(PropTypes.node)
  ])
};

ObserverGroup.div = props => <ObserverGroup type="div" {...props} />;
ObserverGroup.span = props => <ObserverGroup type="span" {...props} />;
ObserverGroup.ul = props => <ObserverGroup type="a" {...props} />;

ObserverGroup.div.displayName = 'ObserverGroup.div';
ObserverGroup.span.displayName = 'ObserverGroup.span';
ObserverGroup.ul.displayName = 'ObserverGroup.ul';

export default ObserverGroup;
