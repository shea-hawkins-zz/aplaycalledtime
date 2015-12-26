import React, { Component } from 'react';
import Relay from 'react-relay';
import StatBlock from './StatBlock';
import StatInput from './StatInput';
import StatBlockInput from './StatBlockInput';
import { Link } from 'react-router';
import AddStatBlockToDayMutation from '../mutations/AddStatBlockToDayMutation';
import Intent from '../Intent';

class Day extends React.Component {
  newStatBlock = {};
  test = "test";
  handleStatBlockChange(e) { //use arrow functions instead
    console.log(this.test);
    this.newStatBlock.type = e.target.value;
  };
  handleStatBlockSubmit() {
    console.log(this.newStatBlock);
    Relay.Store.update(new AddStatBlockToDayMutation({
      newStatBlock: this.newStatBlock,
      day: this.props.day
    }));
    this.newStatBlock = {};
  };
  handleToggle() {
    console.log(this.test);
    Intent.toggleNew();
  };
  render() {
    return (<div><Link to={`/app/month/`} className="ui button">All Days</Link>
                  <StatBlockInput showNew={this.props.appState.showNew} handleChange={this.handleStatBlockChange.bind(this)} handleSubmit={this.handleStatBlockSubmit.bind(this)} handleToggle={this.handleToggle.bind(this)} />
                  {
                    this.props.day.statBlocks.edges.map(
                      (e) => {
                        return (<div>
                                  <StatInput statBlock={e.node} />
                                  <StatBlock statBlock={e.node} />
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
