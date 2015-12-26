import React from 'react';
var StatBlockInput = (props) => {
  if (props.showNew) {
    return (<div> <input className = "ui input" id="value"></input>
                  <select id="conf" className="ui dropdown" onChange={props.handleChange}>
                    <option value="">Type</option>
                    <option value="Lower Split">Lower Split</option>
                    <option value="Lower Raise">Lower Raise</option>
                    <option value="Upper Shoulders">Upper Shoulders</option>
                    <option value="Upper Arms">Upper Arms</option>
                    <option value="Sprint">Split</option>
                    <option value="Stats">Stats</option>
                  </select>
                  <button className = "ui button" onClick={props.handleSubmit}>Submit</button></div>);
  } else {
    return (<div><button className="ui button" onClick={props.handleToggle}>New Stat</button></div>)
  }
}

export default StatBlockInput;
