import React from 'react';
import Relay from 'react-relay';
import Intent from '../../state/Intent';
import StatBlock from './StatBlock';
import GoalItem from './GoalItem';

class WorkoutItem extends React.Component {
  handleGoalShowToggle() {
    Intent.toggleGoalShow();
  }
  render() {
    var goalShow = this.props.appState.goalShow;
    return (<div className="ui raised segment">
                <div className="ui large teal ribbon label">
                  <i className="line chart icon" /><a>{this.props.statBlock.type}</a>
                </div>
                <div className="ui right floated buttons">
                  <button onClick={goalShow ? this.handleGoalShowToggle : null} className={goalShow ? "ui grey button" : "ui violet active button"}>Results</button>
                  <div className="or" data-text="vs"></div>
                  <button onClick={goalShow ? null : this.handleGoalShowToggle} className={goalShow ? "ui violet active button" : "ui grey button"}>Goals</button>
                </div>
                <div className="ui divider" />
                {this.props.appState.goalShow ?
                    <GoalItem goal={this.props.statBlock.goal} appState={this.props.appState}/>
                    :
                    (<div>
                      <StatBlock statBlock={this.props.statBlock} />
                    </div>)
                }
              </div>);
  }
}

export default Relay.createContainer(WorkoutItem, {
  fragments: {
    statBlock: () => Relay.QL`
      fragment on StatBlock {
        type,
        ${StatBlock.getFragment('statBlock')}
        goal {
          ${GoalItem.getFragment('goal')},
        }
      }
    `
  }
});
