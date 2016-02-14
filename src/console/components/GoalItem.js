import React from 'react';
import Relay from 'react-relay';
import Goal from './Goal';
import UpdateStatMutation from '../mutations/UpdateStatMutation';
import Intent from '../../state/Intent';

var GoalToggle = (props) => {
  if (props.goalUpdate) {
    return (<button onClick={props.handleGoalUpdateSubmit}><i className="ui right floated save icon"></i></button>);
  } else {
    return (<button onClick={props.handleGoalUpdateToggle}><i className="ui right floated edit icon"></i></button>);
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
            <table className="ui celled padded table">
              <thead>
                <tr>
                  <th colSpan="2" className="single line"><div style={{float: "left"}}>{`Goals: ${goal.type}`}</div>
                  <div style={{float: "right"}}><GoalToggle goalUpdate={this.props.appState.goalUpdate} handleGoalUpdateSubmit={this.handleGoalUpdateSubmit.bind(this)}
                  handleGoalUpdateToggle={this.handleGoalUpdateToggle.bind(this)}/></div></th>
                </tr>
                <tr>
                  <th className="single line">Exercise</th>
                  <th className="single line">Goal</th>
                </tr>
              </thead>
              <Goal goal={this.props.goal} goalUpdate={this.props.appState.goalUpdate} handleGoalUpdateChange={this.handleGoalUpdateChange.bind(this)}/>

            </table>
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
