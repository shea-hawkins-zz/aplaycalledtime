import React, { Component } from 'react';
import Relay from 'react-relay';
import Intent from '../../state/Intent';

class Journal extends React.Component {
  handleGoldShowToggle() {
    console.log("1");
    Intent.toggleGoldShow();
  }
  componentWillUnmount() {
    var goldShow = this.props.appState.goldShow;
    if (goldShow) {
      this.handleGoldShowToggle();
    }
  }
  render() {
    console.log(this.props.appState.goldShow);
    var goldShow = this.props.appState.goldShow;
    var componentBar = [];
    return (
                <div className="ui centered grid">
                  <div className="ui twelve wide centered column">
                    <div className="ui main container">
                      <h3 className="ui top attached inverted blue header">
                      {this.props.journal.title}
                      {this.props.journal.goldhtml ? (
                      <div className="ui right floated buttons">
                        <button onClick={goldShow ? this.handleGoldShowToggle : null} className={goldShow ? "ui grey button" : "ui grey active button"}>Silver</button>
                        <div className="or" data-text="or"></div>
                        <button onClick={goldShow ? null : this.handleGoldShowToggle} className={goldShow ? "ui gold active button" : "ui grey button"}>Gold</button>
                      </div>)
                          :
                      null}
                      </h3>

                      <div dangerouslySetInnerHTML={{__html: goldShow ? this.props.journal.goldhtml.content : this.props.journal.html.content}} className="ui raised attached segment">
                        {/**<h3 className="ui small bottom right aligned header">Test</h3>**/}
                      </div>
                    </div>
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
        },
        goldhtml {
          content
        }
      }
    `
  }
});
