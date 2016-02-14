import React, { Component } from 'react';
import Relay from 'react-relay';
import NoteInput from './NoteInput';

class NoteBlock extends Component {
  render() {
    return (<div>
      <table className="ui celled padded table">
        <tbody>
        {this.props.noteBlock.stats.edges.map((e) => {
          return (
            <tr key={e.id}>
              <td>
                <h2 className="center aligned">{e.node.value}</h2>
              </td>
            </tr>);
        })}</tbody>
        <NoteInput noteBlock={this.props.noteBlock} />
    </table></div>);
  }
 }

 export default Relay.createContainer(NoteBlock, {
   fragments: {
     noteBlock: () => Relay.QL`
       fragment on StatBlock {
         id,
         type,
         ${NoteInput.getFragment('noteBlock')},
         stats(first: 20) {
           edges {
             node {
               id,
               name,
               type,
               value,
               conf
             }
           }
         }
       }
       `
   }
 });
