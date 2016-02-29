import React, { Component } from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
//import ComponentBar from './ComponentBar';

export default class JournalItem extends React.Component {
  render() {
    var componentBar = [];
    return (
                  <div style={{position: "relative", left: 300 + (-this.props.style.x) + "px", opacity: this.props.style.y}} className="ui main container">
                    <h3 className="ui top attached inverted blue header">
                      <Link to={`/journal/${this.props.journal.id}`}>
                        {this.props.journal.title}
                      </Link>
                    </h3>
                    <div className="ui raised attached segment">
                      <span>{this.props.journal.preview}</span>
                      {/**<h3 className="ui small bottom right aligned header">Test</h3>**/}
                    </div>
                    <div className="ui divider" />
                  </div>
                );
  };
}

export default Relay.createContainer(JournalItem, {
  fragments: {
    journal: () => Relay.QL`
      fragment on Journal {
        id,
        date,
        title,
        preview
      }
    `
  }
});
