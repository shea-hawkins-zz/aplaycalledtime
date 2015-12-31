import React, { Component } from 'react';
import Relay from 'react-relay';
import StatBlock from './StatBlock';
import StatInput from './StatInput';
import StatBlockInput from './StatBlockInput';
import { Link } from 'react-router';
import AddStatBlockToDayMutation from '../mutations/AddStatBlockToDayMutation';
import UpdateWeightMutation from '../mutations/UpdateWeightMutation';
import Intent from '../state/Intent';

var Weight = (props) => {
    if (props.showNew) {
      return <span>Noblesse Oblige</span>;
    } else {
      return <div><input onChange={props.handleChange} className="ui input"></input><button className="ui button" onClick={props.handleSubmit}>Commit</button></div>;
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
    return (
      <div className="ui main container">
        <div className="ui raised segment">
          <Weight showNew={this.props.day.weight} handleChange={this.handleWeightChange.bind(this)} handleSubmit={this.handleWeightSubmit.bind(this)} />
          <StatBlockInput showNew={this.props.appState.showNew} fields={{dropdown: this.props.day.statBlockTypes}} handleChange={this.handleStatBlockChange.bind(this)} handleSubmit={this.handleStatBlockSubmit.bind(this)} handleToggle={this.handleToggle.bind(this)} />
        </div>
                  {
                    this.props.day.statBlocks.edges.map(
                      (e) => {
                      return (<div className="ui raised segment">
                                  <StatBlock statBlock={e.node} />
                                  <StatInput statBlock={e.node} />
                                </div>);
                      }
                  )
                }
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
              id,
              ${StatInput.getFragment('statBlock')},
              ${StatBlock.getFragment('statBlock')}
            }
          }
        }
      }
    `
  }
});
