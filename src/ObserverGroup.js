import React from 'react';
import PropTypes from 'prop-types';
import Observer from './Observer';
import { toArray, find } from './utils';

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

  filterChildren(prevData, currentData) {
    const prev = toArray(prevData);
    const current = toArray(currentData);

    const added = current.filter(child => !prev.find(({ key }) => key === child.key));
    const removed = prev.filter(child => !current.find(({ key }) => key === child.key));

    const left = prev.filter(e => !find(removed, e));
    const right = current.filter(e => !find(removed, e) && !find(added, e));
    if (left.find((_e, i) => right[i].key !== left[i].key)) {
      throw new Error('Order has changed');
    }

    const data = [];
    let prevIndex = 0;
    let currentIndex = 0;

    while (true) {
      if (prevIndex === prev.length) {
        data.push(
          ...(current.filter((_el, i) => i >= currentIndex) || [].map(r => this.mapChild(r)))
        );
        return data;
      }

      if (currentIndex === current.length) {
        data.push(
          ...(prev.filter((_el, i) => i >= prevIndex) || [] || []).map(r => this.mapRemovedChild(r))
        );
        return data;
      }

      const prevEl = prev[prevIndex];
      const currEl = current[currentIndex];
      if (prevEl.key === currEl.key) {
        data.push(prevEl);
        prevIndex++;
        currentIndex++;
      } else if (find(added, currEl)) {
        data.push(this.mapChild(currEl));
        currentIndex++;
      } else {
        data.push(this.mapRemovedChild(prevEl));
        prevIndex++;
      }
    }

    return data;
  }

  mapRemovedChild(child) {
    const stateMappedChild = this.state.children.find(c => c.key === child.key);
    return React.cloneElement(stateMappedChild, { render: false });
  }

  componentDidUpdate(prevProps) {
    this.didRender = true;

    if (this.props.children !== prevProps.children) {
      this.setState(prevState => ({
        children: this.filterChildren(prevState.children, this.props.children)
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
