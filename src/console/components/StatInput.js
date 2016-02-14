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
    return (
    <tfoot className="full-width">
      <tr>
        <th className="center aligned">
                  <select id="name" className="ui dropdown" onChange={this._handleChange}>{
                    this.props.statBlock.statTypes.map(function(e){
                      return (<option value={e.type}>{e.type}</option>);
                    })
                  }</select>
        </th>
        <th className="center aligned">
                  <input className = "ui input" id="value" onChange={this._handleChange}></input>
        </th>
          {this.props.statBlock.type !== "Calorie" && (
                  <th className="center aligned">
                    <select id="conf" onChange={this._handleChange} className="ui dropdown">
                    <option value="0">0</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </th>)}
      </tr>
      <tr>
        <th colSpan={this.props.statBlock.type === "Calorie" ? "2" : "3"}>
          <button className = "ui right floated button" onClick={this.addStat} >Submit</button>
        </th>
      </tr>
    </tfoot>);
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
