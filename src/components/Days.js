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

class Days extends React.Component {
  handleNewDayClick = (e) => {
    Relay.Store.update(new AddDayMutation({
        month: this.props.month
    }));
  }
  render() {
    var splitDate = this.props.month.maxDate.split('-');
    var lastDate = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
    var today = new Date();
    var todayFloored = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var showNew = lastDate.getTime() < todayFloored.getTime() ? true : false;
    var componentBar = [{
      component: NewDay,
      props: {
        handleClick: this.handleNewDayClick.bind(this),
        showNew: showNew
      }
    }];
    return (<div className="ui stackable grid">
                <div className="ui four wide column">
                  <ComponentBar components={componentBar} />
                </div>
                <div className="ui ten wide column">
                  <div className="ui main container">
                    {this.props.month.days.edges.map(function(e){
                        return <DayItem day={e.node} />;
                    })}
                  </div>
                </div>
              </div>);
  };
}

export default Relay.createContainer(Days, {
  fragments: {
    month: () => Relay.QL `
      fragment on Month {
          id,
          ${AddDayMutation.getFragment('month')},
          maxDate,
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
