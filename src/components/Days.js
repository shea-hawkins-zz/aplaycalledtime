import React, { Component } from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import AddDayMutation from '../mutations/AddDayMutation';

class Days extends React.Component {
  _handleClick = (e) => {
    Relay.Store.update(new AddDayMutation({
        month: this.props.month
    }));
  }
  render() {
    return (<div>
              <button className="ui button" onClick={this._handleClick}>New Day</button>
              <ul className="ui list">
                {this.props.month.days.edges.map(function(e){
                  return <li className="ui list item"><Link to={`/days/${e.node.id}`}>{`Day ${e.node.date}`}</Link></li>
                })}
              </ul>
            </div>);
  };
}

export default Relay.createContainer(Days, {
  fragments: {
    month: () => Relay.QL `
      fragment on Month {
          id,
          ${AddDayMutation.getFragment('month')},
          days(first: 10) {
            edges {
              node {
                id,
                date
              }
            }
          }
      }
    `
  }
});
