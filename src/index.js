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
  return (<div className="ui divider">
              <h1 className="ui header">A play called Time.</h1>
              <div className="ui three item menu">
                <Link to={`/month/`} className="item" activeClassName="active item">Stats</Link>
                <Link to={`/month/`} className="item">Posts</Link>
                <Link to={`/month/`} className="item">Drawings</Link>
              </div>
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
      <Route path="/" component={App}>
        <IndexRoute component={Days} queries={monthQuery} />
        <Route path="days/:dayId" component={Day} queries={dayQuery} />
        <Route path="month" component={Days} queries={monthQuery} />
        <Route path="*" component={Days} queries={monthQuery} />
      </Route>
    </RelayRouter>
  ), document.getElementById('root'));
});
