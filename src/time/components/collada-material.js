import {registerComponent} from 'aframe';

/**
*validate() helper will take src and determine if it parses
*to html or if it is a valide queryselector.
**/

registerComponent('collada-material', {
  schema: {
    type: 'boolean'
  },
  init: function () {
    this.logged = true;
  },
  tick: function() {
    var mesh = this.el.object3DMap.mesh;
    if (mesh && mesh.children[0]) {
      mesh.children[0].material = mesh.material;
      if (this.logged) {
        console.log(mesh);
        this.logged = false;
      }
    }
  }
});
