import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';
import Home from '../pages/home/Home';
import Loading from './Loading';
import WSocket from '../tools/webSocket'
import Store from '../tools/store/store'

const AsyncDynamicPage = importedComponent(
  () => import('../pages/dynamic/Dynamic'),
  {
    LoadingComponent: Loading
  }
);

const AsyncNoMatch = importedComponent(
  () => import('./NoMatch'),
  {
    LoadingComponent: Loading
  }
);

const App = () => {
  WSocket.connect();
  Store.init();
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/page/dynamic" component={AsyncDynamicPage} />
          <Route component={AsyncNoMatch} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
