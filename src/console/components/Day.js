import React, { Component } from 'react';
import Relay from 'react-relay';
import StatBlockInput from './StatBlockInput';
import WorkoutItem from './WorkoutItem';
import ComponentBar from './ComponentBar';
import { Link } from 'react-router';
import AddStatBlockToDayMutation from '../mutations/AddStatBlockToDayMutation';
import UpdateWeightMutation from '../mutations/UpdateWeightMutation';
import Intent from '../../state/Intent';

var Weight = (props) => {
    if (props.weight) {
      return <h2 className="ui large violet label">{props.weight}</h2>;
    } else {
      return <div><input onChange={props.handleChange} className="ui input" placeholder="Weight"></input><button className="ui violet button" onClick={props.handleSubmit}>Commit</button></div>;
    }
}



class Day extends React.Component {
  //Sets a default value
  newStatBlock = {type: this.props.day.statBlockTypes[0].type};
  handleStatBlockChange(e) { //use arrow functions instead
    this.newStatBlock.type = e.target.value;
  };
  handleStatBlockSubmit() {
    Relay.Store.update(new AddStatBlockToDayMutation({
      newStatBlock: this.newStatBlock,
      day: this.props.day
    }));
    this.newStatBlock = {};
  };
  handleToggle() {
    Intent.toggleNew();
  };
  handleWeightSubmit() {
    Relay.Store.update(new UpdateWeightMutation({
      weight: this.weight,
      day: this.props.day
    }));
  };
  handleWeightChange(e) {
    this.weight = e.target.value;
  };
  render() {
    var componentBar = [
      {
        component: Weight,
        props: {
            weight: this.props.day.weight,
            handleChange: this.handleWeightChange.bind(this),
            handleSubmit: this.handleWeightSubmit.bind(this)
          }
      },
      {
        component: StatBlockInput,
        props: {
          showNew: this.props.appState.showNew,
          fields: {types: this.props.day.statBlockTypes},
          handleChange: this.handleStatBlockChange.bind(this),
          handleSubmit: this.handleStatBlockSubmit.bind(this),
          handleToggle: this.handleToggle.bind(this)
        }
      }
    ];
    return (
      <div className="ui stackable grid">
        <div className="ui four wide column">
          <ComponentBar components={componentBar} />
        </div>
        <div className="ui ten wide column">
                    {
                      this.props.day.statBlocks.edges.map(
                        (e) => {
                          return (<WorkoutItem appState={this.props.appState} statBlock={e.node} />);
                        }
                    )
                  }
          </div>
      </div>
    );
  };
}

export default Relay.createContainer(Day, {
  fragments: {
    day: () => Relay.QL `
      fragment on Day {
        ${AddStatBlockToDayMutation.getFragment('day')},
        ${UpdateWeightMutation.getFragment('day')},
        statBlockTypes {
          type
        },
        weight,
        statBlocks(first: 10) {
          edges {
            node {
              ${WorkoutItem.getFragment('statBlock')}
            }
          }
        }
      }
    `
  }
});
