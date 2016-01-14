import React from 'react';
import { render } from 'react-dom';
import Relay from 'react-relay';
import { RelayRouter } from 'react-router-relay';
import { Route, IndexRoute, Link } from 'react-router';
import Rx from 'rxjs';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import update from 'react-addons-update';

//Application state
import Model from './state/Model';

//Application
import Day from './console/components/Day';
import Days from './console/components/Days';
import Journey from './journey/Journey';

const history = createBrowserHistory();
const dayQuery = {
  day: () => Relay.QL`query { day(id: $dayId) }`
};
const monthQuery = {
  month: () => Relay.QL`query { month(id: "1") }`
};
var App = function(props) {
  return (<div className="page">
            <div className="header">
              <h1 className="ui inverted header">A Play Called Time.</h1>
              <div className="ui inverted top menu">
                <Link to={`/journey/`} className="disabled teal item">Time</Link>
                <Link to={`/journey/`} className="teal item" activeClassName="active teal item">Journey</Link>
                <Link to={`/console/`} className="teal item" activeClassName="active teal item">console.log()</Link>
              </div>
            </div>
            <div className="ui hidden divider" />
            <div className="ui container">
              {props.children}
            </div>
          </div>
        );
};

Model.subject.subscribe((appState) => {
  var createElement = function(Component, props) {
    props = update(props,{
      $merge: {
        appState: appState
      }
    });
    return <Component {...props} />
  }

  render((
    <RelayRouter history={history} createElement={createElement}>
      <Route path="/" component={App}>
        <IndexRoute component={Days} queries={monthQuery} />
        <Route path="days/:dayId" component={Day} queries={dayQuery} />
        <Route path="console" component={Days} queries={monthQuery} />
        <Route path="journey" component={Journey} />
        <Route path="*" component={Days} queries={monthQuery} />
      </Route>
    </RelayRouter>
  ), document.getElementById('root'));
});
