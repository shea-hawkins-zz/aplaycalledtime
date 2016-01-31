import React, { Component } from 'react';
import Relay from 'react-relay';

class Journal extends React.Component {
  render() {
    var componentBar = [];
    return (
                  <div className="ui main container">
                    <h3 className="ui top attached inverted blue header">
                      {this.props.journal.title}
                    </h3>
                    <div dangerouslySetInnerHTML={{__html: this.props.journal.html.content}} className="ui raised attached segment">
                      {/**<h3 className="ui small bottom right aligned header">Test</h3>**/}
                    </div>
                  </div>
                );
  };
}

export default Relay.createContainer(Journal, {
  fragments: {
    journal: () => Relay.QL`
      fragment on Journal {
        id,
        date,
        title,
        preview,
        html {
          content
        }
      }
    `
  }
});
