import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

class DayItem extends React.Component {
  render() {
    var day = this.props.day;
    return <div className="ui raised black segment">
              <div className="ui huge teal ribbon label">
                <i className="calendar outline icon"></i>
                <Link to={`/days/${day.id}`}>{`${day.date}`}</Link>
                {day.weight ? <div className="ui violet floating label">{day.weight}</div> : null}
              </div>
              <ul>
                {day.statBlocks.edges.map(function(e) {
                  return <li>{e.node.type}</li>;
                })}
              </ul></div>;
  }
}

export default Relay.createContainer(DayItem, {
  fragments: {
    day: () => Relay.QL`
      fragment on Day {
        id,
        date,
        weight,
        statBlocks(first: 3) {
          edges {
            node {
              type
            }
          }
        }
      }
    `
  }
});
