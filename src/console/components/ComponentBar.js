import React from 'react';

var ComponentBar = (props) => {
  return (
    <div className="ui vertical menu">
      {props.components.map(function(e) {
        var Component = e.component;
        var props = e.props;
        return (
                <div className="ui horizontally fitted centered item">
                  <div className="ui center aligned container">
                    <Component {...e.props}/>
                  </div>
                </div>
              );
      })}
    </div>
  );
}

export default ComponentBar;
