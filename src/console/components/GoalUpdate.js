import React from 'react';
import Relay from 'react-relay';

class GoalUpdate extends React.Component {
  render() {
    var goal = this.props.goal;
    return (
        <tbody>
        {goal.stats.edges.map((e) => {
          return (
            <tr key={e.id}>
              <td>
                <h2 className="center aligned">{e.node.name}</h2>
              </td>
              <td>
                <input className="center aligned" id={e.node.id} placeholder={e.node.value} onChange={this.props.onChange} />
              </td>
            </tr>);
        })}
        </tbody>);
  }
}

export default Relay.createContainer(GoalUpdate, {
  fragments: {
    goal: () => Relay.QL`
      fragment on StatBlock {
        type,
        stats(first: 5) {
          edges {
            node {
              id,
              name,
              value
            }
          }
        }
      }
    `
  }
});
