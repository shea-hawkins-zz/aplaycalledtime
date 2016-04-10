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
import EpisodeOne from './time/index';
import Day from './console/components/Day';
import Log from './console/components/Log';
import Journey from './journey/Journey';
import Journal from './journey/components/Journal';

const history = createBrowserHistory();
const dayQuery = {
  day: () => Relay.QL`query { day(id: $dayId) }`
};
const logQuery = {
  log: () => Relay.QL`query { log }`
};
const journeyQuery = {
  journey: () => Relay.QL`query { journey}`
};
const journalQuery = {
  journal: () => Relay.QL`query { journal(id: $journalId) }`
};
var App = function(props) {
  return (<div className="page">
            <div className="header">
              <h1 className="ui inverted header"><i>A Play Called Time</i></h1>
              <div className="ui inverted top menu">
                <Link to={`/time/`} className="teal item" activeClassName="active teal item">Time</Link>
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
        <IndexRoute component={EpisodeOne} />
        <Route path="days/:dayId" component={Day} queries={dayQuery} />
        <Route path="time" component={EpisodeOne} />
        <Route path="console" component={Log} queries={logQuery} />
        <Route path="journey" component={Journey} queries={journeyQuery} />
        <Route path="journal/:journalId" component={Journal} queries={journalQuery} />
        <Route path="*" component={Journey}  queries={journeyQuery} />
      </Route>
    </RelayRouter>
  ), document.getElementById('root'));
});
