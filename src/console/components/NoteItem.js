import React, {Component} from 'react';
import Relay from 'react-relay';
import Intent from '../../state/Intent';
import NoteBlock from './NoteBlock';

class NoteItem extends Component {
  render() {
    return (<div className="ui raised segment">
                <div className="ui large teal ribbon label">
                  <i className="book icon" /><a>Notes</a>
                </div>
                <div className="ui divider" />
                <div>
                  <NoteBlock noteBlock={this.props.noteBlock} />
                </div>
              </div>);
          }
}
//Add weekly sums to the component bar in the Day.
export default Relay.createContainer(NoteItem, {
  fragments: {
    noteBlock: () => Relay.QL `
      fragment on StatBlock {
        type,
        ${NoteBlock.getFragment('noteBlock')}
      }
    `
  }
});
