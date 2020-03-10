import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from 'site/components/Header';
import ObserverDemo from 'site/demo/ObserverDemo';
import SvgDemo from 'site/demo/SvgDemo';
import LoadingCircles from 'site/demo/LoadingCircles';
import RouteTransitionDemo from 'site/demo/RouteTransitionDemo';
import NotificationsDemo from 'site/demo/NotificationsDemo';
import RotatingSvg from 'site/demo/RotatingSvg';
import Gradients from 'site/demo/Gradients';
import BouncingBalls from 'site/demo/BouncingBalls';
import 'site/style/demo.scss';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Header />
        </Route>
        <Route path="/notifications" component={NotificationsDemo} />
        <Route path="/transition" component={RouteTransitionDemo} />
        <Route path="/observer" component={ObserverDemo} />
        <Route path="/svg" component={SvgDemo} />
        <Route path="/loading-circles" component={LoadingCircles} />
        <Route path="/rotating-svg" component={RotatingSvg} />
        <Route path="/gradients" component={Gradients} />
        <Route path="/bouncing-balls" component={BouncingBalls} />
      </Switch>
    </Router>
  );
};

export default App;
