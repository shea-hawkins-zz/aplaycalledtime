import React from 'react';
import Relay from 'react-relay';
import Goal from './Goal';
import UpdateStatMutation from '../mutations/UpdateStatMutation';
import Intent from '../../state/Intent';

var GoalToggle = (props) => {
  if (props.goalUpdate) {
    return (<button onClick={props.handleGoalUpdateSubmit}><i className="save icon"></i></button>);
  } else {
    return (<button onClick={props.handleGoalUpdateToggle}><i className="edit icon"></i></button>);
  }
}

class GoalItem extends React.Component {
  updateStats = [];

  handleGoalUpdateToggle() {
    Intent.toggleGoalUpdate();
  }
  handleGoalUpdateChange(e) {
    var {id, value} = e.target;
    var indexOfId = function(arr, id) {
      var ind = -1;
      arr.forEach(function(e, i){
        if (e.id === id) {
          ind = i;
        }
      });
      return ind;
    };
    if (indexOfId(this.updateStats, id) === -1) {
      this.updateStats.push({id: id, value: value});
    } else {
      this.updateStats[indexOfId(this.updateStats, id)] = {id: id, value: value};
    }
  };
  handleGoalUpdateSubmit() {
    this.updateStats.forEach(function(e) {
      console.log(e.id);
      Relay.Store.update(new UpdateStatMutation({
        stat: {
          id: e.id,
          value: e.value
        }
      }));
    });
    this.handleGoalUpdateToggle();
  };
  render() {
    var goal = this.props.goal;
    return (
      <div>
        {goal ?
            <div>
              <Goal goal={this.props.goal} goalUpdate={this.props.appState.goalUpdate} handleGoalUpdateChange={this.handleGoalUpdateChange.bind(this)}/>
              <GoalToggle goalUpdate={this.props.appState.goalUpdate} handleGoalUpdateSubmit={this.handleGoalUpdateSubmit.bind(this)}
              handleGoalUpdateToggle={this.handleGoalUpdateToggle.bind(this)}/>
            </div>
            :
            <h2 className="ui header">New Goal, please.</h2>
        }
      </div>
      );
  }
}

export default Relay.createContainer(GoalItem, {
  fragments: {
    goal: () => Relay.QL`
      fragment on StatBlock {
        ${Goal.getFragment('goal')},
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
