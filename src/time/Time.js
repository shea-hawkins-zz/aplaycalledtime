import React from 'react';
import TextEnt from './Scene/TextEnt';
import 'aframe';
import {Scene, Entity} from 'aframe-react';

export default React.createClass({
  render: function() {
    return (
      <Scene>
                <a-assets>
                  <img id="diffuse" src="assets/mtlplate-diffuse.jpg" />
                  <img id="specular" src="assets/mtlplate-specular.png" />
                  <img id="normals" texture="wrapT: RepeatWrapping;" src="assets/mtlplate-normals.jpg" />
                  <a-asset-item id="curtain" src="assets/models/stage.dae" />
                </a-assets>
                <a-sky src="assets/stars.jpg"></a-sky>
                <Entity rotation="0 180 0">
                  <a-camera wasd-controls-enabled="true"  />
                </Entity>

                <Entity collada-model="#curtain" position="8 -6 10" rotation="0 -180 0" scale="6 5 5" />
                <a-entity light="type: directional; color: #515151; insensity: .1;" position="-20 16 -50"/>
                <a-entity light="type: directional; color: #515151; intensity: .6;" position="-35 16 20"/>
      </Scene>
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
//     //   // console.log("success");
//     //   // console.log(this.material.map);
//     //
//     //   mesh.material.needsUpdate = true;
//     //   tex.needsUpdate = true;
//     //   mesh.material.map = tex;
//     // });
