import React, { Component } from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
//import ComponentBar from './ComponentBar';

export default class JournalItem extends React.Component {
  render() {
    var componentBar = [];
    return (
                  <div className="ui main container">
                    <div style={{position: "relative", left: 300 + (-this.props.style.x) + "px", opacity: this.props.style.y}} className="ui raised segment">
                      <span>{this.props.journal.preview}</span>
                    </div>
                  </div>
                );
  };
}

export default Relay.createContainer(JournalItem, {
  fragments: {
    journal: () => Relay.QL `
      fragment on Journal {
        id,
        date,
        title,
        preview
      }
    `
  }
});
