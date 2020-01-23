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
    const { config } = this.props;

    const childEvents = child.props.events || {};
    const events = {
      ...childEvents,
      onUnmountEnd: () => {
        (childEvents.onUnmountEnd || function() {})();
        this.onChildUnmount(child.key);
      }
    };

    if (!child.type.tweenful) {
      return React.createElement(
        Observer,
        { ...config, key: child.key, className: "observer-div" },
        child
      );
    }

    if (!this.didRender && this.props.skipInitial) {
      console.log('[]');
      return React.cloneElement(child, {
        events,
        onMount: { ...child.props.onMount, duration: 10 }
      });
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
