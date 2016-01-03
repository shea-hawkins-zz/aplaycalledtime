import React, { Component } from 'react';
import Relay from 'react-relay';

class StatBlock extends Component {
  render() {
    return (<div>
      <div className="ui large teal ribbon label">
        <i className="line chart icon" /><a>{this.props.statBlock.type}</a>
      </div>
      <table className="ui celled padded table">
        <thead>
          <tr><th className="single line">Stat</th>
          <th>Value</th>
          <th>Confidence</th>
        </tr></thead>
        <tbody>
        {this.props.statBlock.stats.edges.map((e) => {
          return (
            <tr key={e.id}>
              <td>
                <h2 className="center aligned">{e.node.name}</h2>
              </td>
              <td>
                <h2 className="center aligned">{e.node.value}</h2>
              </td>
              <td>
                <h2 className="ui center aligned header">{e.node.conf}</h2>
              </td>
            </tr>);
        })}</tbody>
    </table></div>);
  }
 }

 export default Relay.createContainer(StatBlock, {
   fragments: {
     statBlock: () => Relay.QL`
     fragment on StatBlock {
       id,
       type,
       stats(first: 5) {
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
