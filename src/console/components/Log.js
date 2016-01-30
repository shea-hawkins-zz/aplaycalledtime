import React, { Component } from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import ComponentBar from './ComponentBar';
import DayItem from './DayItem';
import AddDayMutation from '../mutations/AddDayMutation';

var NewDay = (props) => {
  var fuel = ["Find Your Inner Peace", "Journey Through Time", "Waveless",
              "To Tell A Story", "To Create Beauty", "Unleash Your Spiral Energy"];
  var rand = Math.random();
  var randInd = rand > .95 ? 5 : Math.floor(rand / .2);
  if (props.showNew) {
    return <button className="ui large violet button" onClick={props.handleClick}>{fuel[randInd]}</button>;
  } else {
    return <button className="ui large disabled violet button">Noblesse Oblige</button>;
  }
};

class Log extends React.Component {
  handleNewDayClick = (e) => {
    Relay.Store.update(new AddDayMutation({
        log: this.props.log
    }));
  }
  render() {
    var componentBar = [{
      component: NewDay,
      props: {
        handleClick: this.handleNewDayClick.bind(this),
        showNew: this.props.log.isUpdateable
      }
    }];
    return (<div className="ui stackable grid">
                <div className="ui four wide column">
                  <ComponentBar components={componentBar} />
                </div>
                <div className="ui ten wide column">
                  <div className="ui main container">
                    {this.props.log.days.edges.map(function(e){
                        return <DayItem day={e.node} />;
                    })}
                  </div>
                </div>
              </div>);
  };
}

export default Relay.createContainer(Log, {
  fragments: {
    log: () => Relay.QL `
      fragment on Log {
          id,
          ${AddDayMutation.getFragment('log')},
          isUpdateable,
          days(last: 10) {
            edges {
              node {
                ${DayItem.getFragment('day')}
              }
            }
          }
      }
    `
  }
});
