import React, {Component} from 'react';
import Relay from 'react-relay';
import Intent from '../../state/Intent';
import StatBlock from './StatBlock';
import StatInput from './StatInput';

class CalorieItem extends Component {
  render() {
    var sum = this.props.calorie.stats.edges.reduce(function(mem, e) {
      return Number(mem) + Number(e.node.value);
    }, 0);
    return (<div className="ui raised segment">
                <div className="ui large teal ribbon label">
                  <i className="line chart icon" /><a>{this.props.calorie.type + '-' + sum}</a>
                </div>
                <div>
                  <StatBlock statBlock={this.props.calorie} />
                  <StatInput statBlock={this.props.calorie} />
                </div>
              </div>);
          }
}
//Add weekly sums to the component bar in the Day.
export default Relay.createContainer(CalorieItem, {
  fragments: {
    calorie: () => Relay.QL `
      fragment on StatBlock {
        type,
        ${StatBlock.getFragment('statBlock')},
        ${StatInput.getFragment('statBlock')},
        stats(first: 20) {
          edges {
            node {
              value
            }
          }
        }
      }
    `
  }
});
