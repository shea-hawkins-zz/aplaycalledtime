import React, { Component } from 'react';
import Relay from 'react-relay';
import AddStatMutation from '../mutations/AddStatMutation';

class StatInput extends Component {
  newStat = {
                      name: this.props.statBlock.statTypes[0].type,
                      type: "lift"
                    };
  addStat = () => {
    console.log(this.newStat.value);
    Relay.Store.update(new AddStatMutation({
        statBlock: this.props.statBlock,
        stat: this.newStat
      })
    );
  }
  _handleChange = (e) => {
    if (e.target.id === "value") {
      this.newStat.value = e.target.value;
    }
    if (e.target.id === "conf") {
      this.newStat.conf = e.target.value;
    }
    if (e.target.id === "name") {
      this.newStat.name = e.target.value;
    }
  }
  render() {
    return (<div> <select id="name" className="ui dropdown" onChange={this._handleChange}>{
                    this.props.statBlock.statTypes.map(function(e){
                      return (<option value={e.type}>{e.type}</option>);
                    })
                  }</select>
                  <input className = "ui input" id="value" onChange={this._handleChange}></input>
                  {this.props.statBlock.type !== "Calorie" && (<select id="conf" onChange={this._handleChange} className="ui dropdown">
                    <option value="">Confidence</option>
                    <option value="0">Failure</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>)}
                  <button className = "ui button" onClick={this.addStat} >Submit</button></div>);
  }
}

export default Relay.createContainer(StatInput, {
  fragments: {
    statBlock: () => Relay.QL`
      fragment on StatBlock {
        type,
        ${AddStatMutation.getFragment('statBlock')},
        statTypes {
          type
        }
      }
    `
  }
});
