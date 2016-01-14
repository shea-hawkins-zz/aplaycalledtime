import React, { Component } from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
//import ComponentBar from './ComponentBar';

export default class Journey extends React.Component {
  render() {
    var componentBar = [];
    return (<div className="ui stackable grid">
                <div className="ui four wide column">
                  {/**<ComponentBar components={componentBar} />**/}
                </div>
                <div className="ui ten wide column">
                  <div className="ui main container">
                    <div className="ui raised segment">
                      <span>On Routine.</span>
                    </div>
                  </div>
                </div>
              </div>);
  };
}

// export default Relay.createContainer(Journey, {
//   fragments: {
//     journey: () => Relay.QL `
//       fragment on Journey {
//
//       }
//     `
//   }
// });
