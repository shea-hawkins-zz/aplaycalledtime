import React from 'react';
import Relay from 'react-relay';

var StatBlockInput = (props) => {
  if (props.showNew) {
    return (<div><select id="type" className="ui dropdown" onChange={props.handleChange}>
                    {props.fields.types.map(function(e) {
                      return (<option value={e.type}>{e.type}</option>);
                    })}
                  </select>
                  <button className = "ui violet button" onClick={props.handleSubmit}>Submit</button></div>);
  } else {
    return (<button className="ui violet button" onClick={props.handleToggle}>New Statblock</button>)
  }
}

export default StatBlockInput;
