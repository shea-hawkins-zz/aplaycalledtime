import React, {Component} from 'react';
import Relay from 'react-relay';
import Intent from '../../state/Intent';

class NoteItem extends Component {

}

export default Relay.createContainer(NoteItem, {
  note: () => Relay.QL `
    fragment on StatBlock {
      type,
      stats(first: 5) {
        edges {
          node {
            id,
            value
          }
        }
      }
    }
  `}
);
