import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Tweenful from 'react-tweenful';
import Sidebar from 'site/components/Sidebar';
import Header from 'site/components/Header';
import Main from 'site/components/Main';
import ObserverDemo from 'site/demo/ObserverDemo';
import SvgDemo from 'site/demo/SvgDemo';
import AnimistaDemo from 'site/demo/AnimistaDemo';
import GroupDemo from 'site/demo/GroupDemo';
import RouteTransitionDemo from 'site/demo/RouteTransitionDemo';
import NotificationsDemo from 'site/demo/NotificationsDemo';
import 'site/style/demo.scss';

(function() {
  return (
    <Tweenful.div
      className="box"
      style={{ backgroundColor: '#EBBA16' }}
      onMount={{ opacity: 1 }}
      onUnmount={{ opacity: 0 }}
      render={true}
      animateFrom={{ opacity: 0 }}
      animate={[{ translateX: '100px' }, { translateY: '-75px' }, { translateX: '0px' }]}
      running={false}
      paused={false}
    />
  );
})();

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Header />
          <section className="container">
            <Sidebar />
            <Main />
          </section>
        </Route>
        <Route path="/notifications" component={NotificationsDemo} />
        <Route path="/transition" component={RouteTransitionDemo} />
        <Route path="/observer" component={ObserverDemo} />
        <Route path="/svg" component={SvgDemo} />
        <Route path="/animista" component={AnimistaDemo} />
        <Route path="/group" component={GroupDemo} />
      </Switch>
    </Router>
  );
};

export default App;
