import React from 'react';
import { render } from 'react-dom';
import Relay from 'react-relay';
import { RelayRouter } from 'react-router-relay';
import Route from 'react-router';
import Rx from 'rxjs';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import update from 'react-addons-update';

//Application state
import Model from './Model';

//Application
import Day from './components/Day';
import Days from './components/Days';

const history = createBrowserHistory();
const dayQuery = {
  day: () => Relay.QL`query { day(id: $dayId) }`
};
const monthQuery = {
  month: () => Relay.QL`query { month(id: "1") }`
};
var App = function(props) {
  return (<div>
            <h1>Me</h1>
            {props.children}
          </div>);
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
      <Route path="/app" component={App}>
        <Route path="days/:dayId" component={Day} queries={dayQuery} />
        <Route path="month" component={Days} queries={monthQuery} />
      </Route>
    </RelayRouter>
  ), document.getElementById('root'));
});
