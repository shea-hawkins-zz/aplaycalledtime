
import Text from './Scene/TextEnt';
import { render } from 'react-dom';
import React from 'react';
import { Scene, Entity } from 'aframe-react';
import 'aframe';

render(
  (
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
              <Text />
              <Entity collada-model="#curtain" position="8 -6 10" rotation="0 -180 0" scale="6 5 5" />
              <a-entity light="type: directional; color: #515151; insensity: .1;" position="-20 16 -50"/>
              <a-entity light="type: directional; color: #515151; intensity: .6;" position="-35 16 20"/>
    </Scene>
  ), document.getElementById('root')
);
