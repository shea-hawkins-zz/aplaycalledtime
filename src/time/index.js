import React from 'react';
import { render } from 'react-dom';
import TextEnt from './Scene/TextEnt';
import AFRAME from 'aframe';
import './components/phong';
import './components/text';
import './components/collada-material';
import {Scene, Entity} from 'aframe-react';
import Cassette from 'react-cassette-player';

export default React.createClass({
  render: function() {
    return (
        <div>
        <div>
          <Cassette src="/assets/intro.mp3"
            preload="auto"
            cassetteColor="#333"
            labelColor="#707070"
            tapeColor="#7DF9FF"
            controlsColor="#7DF9FF"
            containerClass="nwa-wrap" />
        </div>
          <iframe src="/episode-one"  width="1200px" height="600px" allowFullScreen="yes" scrolling="no" />

        </div>
    );
  }
});


// var scene = document.querySelector('a-scene').object3D;
// var geometry = new THREE.CubeGeometry( 10, 10, 10);
//     var material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
//     var mesh = new THREE.Mesh(geometry, material );
//     mesh.position.z = -50;
//     scene.add( mesh );
//     // loader.load('assets/brick-diffuse.jpg', (tex) => {
//     //   //  this.material.map = tex;
//     //   //  this.material.map.needsUpdate = true;
//     //   //  this.material.needsUpdate = true;
//     //   // console.log("success");v
//     //   // console.log(this.material.map);
//     //
//     //   mesh.material.needsUpdate = true;
//     //   tex.needsUpdate = true;
//     //   mesh.material.map = tex;
//     // });
