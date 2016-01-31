import React, { Component } from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import JournalItem from './components/JournalItem';
import {Motion, StaggeredMotion, spring} from 'react-motion';
//import ComponentBar from './ComponentBar';v

class Journey extends React.Component {
  getDefaultStyles() {
    return this.props.journey.journals.edges.map(function() {
      return {x: 0, y: 0};
    });
  };
  render() {
    var componentBar = [];
    var journals = this.props.journey.journals;
    return (<div className="ui stackable grid">
                <div className="ui four wide column">
                  {/**<ComponentBar components={componentBar} />**/}
                </div>
                <div className="ui ten wide column">
                  <StaggeredMotion defaultStyles={this.getDefaultStyles()} styles={prevStyles => prevStyles.map((prevStyle, i)=> {
                    return i === 0 ? {x: spring(300, [96, 43]), y: spring(1, [66, 43])} : {x: spring(prevStyles[i - 1].x, [96, 43]), y: spring(prevStyles[i - 1].y, [96, 43])};
                  })}>
                    {interpolatedStyles =>
                      <div>
                        {interpolatedStyles.map((style, i) =>
                          <JournalItem key={i} style={style} journal={journals.edges[i].node} />
                        )}
                      </div>
                    }
                  </StaggeredMotion>
                </div>
              </div>);
  };
}

// export default () => {
//   var journey = {
//     id: "8",
//     journals: {
//       edges:
//         [
//           {node: {
//             id: "9",
//             date: "1-20-2016",
//             title: "One Third",
//             preview: "One Third Booted"
//           }},
//           {node: {
//             id: "11",
//             date: "1-21-2016",
//             title: "Two Thirds",
//             preview: "Two Thirds Booted"
//           }},
//           {node: {
//             id: "10",
//             date: "1-22-2016",
//             title: "Complete",
//             preview: "Three Thirds Booted"
//           }},
//         ]
//       }
//     }
//     return <Journey journey={journey} />;
//   }

export default Relay.createContainer(Journey, {
  fragments: {
    journey: () => Relay.QL `
      fragment on Journey {
        id,
        journals(last: 5) {
          edges {
            node {
              id,
              ${JournalItem.getFragment('journal')}
            }
          }
        }
      }
    `
  }
});
