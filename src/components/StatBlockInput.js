import React from 'react';
import Relay from 'react-relay';

var StatBlockInput = (props) => {
  if (props.showNew) {
    return (<div><select id="type" className="ui dropdown" onChange={props.handleChange}>
                    {props.fields.dropdown.map(function(e) {
                      return (<option value={e.type}>{e.type}</option>);
                    })}
                  </select>
                  <button className = "ui button" onClick={props.handleSubmit}>Submit</button></div>);
  } else {
    return (<div><button className="ui button" onClick={props.handleToggle}>New Statblock</button></div>)
  }
}

export default StatBlockInput;
