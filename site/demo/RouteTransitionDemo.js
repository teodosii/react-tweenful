import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import ObserverGroup from 'react-tweenful/ObserverGroup';
import Observer from 'react-tweenful/Observer';

const colors = {
  red: '#EE4266',
  yellow: '#FDB833',
  blue: '#296EB4',
  green: '#0EAD69'
};

const Red = () => <div className="color-block" style={{ backgroundColor: colors.red }}></div>;
const Yellow = () => <div className="color-block" style={{ backgroundColor: colors.yellow }}></div>;
const Blue = () => <div className="color-block" style={{ backgroundColor: colors.blue }}></div>;
const Green = () => <div className="color-block" style={{ backgroundColor: colors.green }}></div>;

class RouteTransitionDemo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location } = this.props;

    return (
      <div className="route-transition-demo">
        <ul className="nav-links">
          <li>
            <NavLink to="/transition/red">Red</NavLink>
          </li>
          <li>
            <NavLink to="/transition/yellow">Yellow</NavLink>
          </li>
          <li>
            <NavLink to="/transition/blue">Blue</NavLink>
          </li>
          <li>
            <NavLink to="/transition/green">Green</NavLink>
          </li>
        </ul>
        <div className="observer">
          <ObserverGroup>
            <Observer.div
              key={location.pathname}
              className="key-wrapper"
              duration={1000}
              style={{ opacity: 0 }}
              onMount={{ opacity: 1 }}
              onUnmount={{ opacity: 0 }}
              events={{
                onMountStart: () => console.log('onMountStart'),
                onUnmountEnd: () => console.log('onUnmountEnd')
              }}
              easing={'easeOutQuad'}
            >
              <Switch location={location}>
                <Route exact path={`/transition/red`} component={Red} />
                <Route exact path={`/transition/green`} component={Green} />
                <Route exact path={`/transition/blue`} component={Blue} />
                <Route exact path={`/transition/yellow`} component={Yellow} />
                <Route render={() => <div>Not Found</div>} />
              </Switch>
            </Observer.div>
          </ObserverGroup>
        </div>
      </div>
    );
  }
}

export default RouteTransitionDemo;
