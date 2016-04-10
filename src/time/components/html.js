import '../../lib/CSS3DRenderer.js';
import {registerComponent} from 'aframe';

/**
*validate() helper will take src and determine if it parses
*to html or if it is a valide queryselector.
**/

export default registerComponent('html', {
  schema: {
    src: { default: '' }
  },
  init: function () {
    //Create plane here

  },
  update: function(oldData) {
    var data = this.data;
    var div = document.createElement('div');
    //div.innerHTML = data.src;
    //var elements = div.childNodes;
    var number = document.createElement( 'div' );
    number.textContent = "THREE.JS";
    this.el.object3D.add(new THREE.CSS3DObject(number));
    //Update plane coordinates here
  }
});
