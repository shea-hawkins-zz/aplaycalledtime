import 'aframe';
import React from 'react';
import {Entity} from 'aframe-react';
import '../components/text';
import '../components/phong';

export default React.createClass({
  makeMinDigits: function(num, dig) {
    var len = num.toString().length;
    var str = "";
    if (len < dig) {
      for (var i = 0; i < len; i++) {
        str = str + "0";
      }
    }
    return str + num.toString();
  },
  getDateString: function() {
    var seventh = Date.parse('2017-07-07');
    var today = Date.now();
    var time = seventh - today;
    var days = this.makeMinDigits(Math.floor(time / (24*3600*1000)), 3);
    time = time - days * 24 * 3600 * 1000;
    var hours = this.makeMinDigits(Math.floor(time / (3600*1000)), 2);
    time = time - hours * 3600 * 1000;
    var minutes = this.makeMinDigits(Math.floor(time / (60*1000)), 2);
    time = time - minutes * 60 * 1000;
    var seconds = this.makeMinDigits(Math.floor(time / 1000), 2);
    return [days, hours, minutes, seconds].join(':');
  },
  getInitialState: function() {
    var str = this.getDateString();
    return ({time: str});
  },
  componentDidMount: function() {
    setInterval(this.updateCount, 250);
  },
  updateCount: function() {
    var str = this.getDateString();
    this.setState({
      time: str
    });
  },
  render: function() {
    return (
      <Entity
         visible="true" geometry="primitive: box; width: 14; height: 2.5; depth: .2"
         material="shader: phong; map: #diffuse; normalMap: #normals; specularMap: #specular;"
         position=".2 6.5 10"
         text={{text: this.state.time}}/>
        );
  }
});
