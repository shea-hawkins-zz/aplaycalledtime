import createGeometry from 'three-bmfont-text';
import {THREE, registerComponent} from 'aframe';
import loadBMFont from 'load-bmfont';
import textVert from '../shaders/sdf.vert';
import textFrag from '../shaders/sdf.frag';

var loader = new THREE.TextureLoader();
function loadTHREETexture(src, opts) {
  return new Promise((resolve, reject) => {
    try {
      var el = document.querySelector(src);
    } catch (e) {
      var url = src;
    }
    // If src was querySelector
    if (el) {
      opts = getAssetData(el, 'texture', opts);
          // ...and is an image
          if (el.tagName === 'IMG') {
            // ...make a new image texture.
            var texture = new THREE.Texture(el);
          } else if (el.tagName === 'VIDEO') {
            // Otherwise a new video texture.
            var texture = new THREE.VideoTexture(el);
          }
          el.onLoad = function() {
            texture.needsUpdate = true;
          }
          resolve(texture);
    }
    // If src is not queryselector, load
    else if (url) {
        // TODO Reimplement video tester if nec
        // TODO handle multiple texture types
        loader.load(url, resolve, undefined, reject);
    }
  }).then((tex) => {
    //opts && Object.assign(tex, opts);
    return tex;
  });
};
/** pure
  * Returns a promise with font resource.
  *
  * @param {str} src -- String containing source of font
  */
function loadFont(src) {
  // TODO Implement querySelector font load
  // TODO allow multiple font formats?
  return new Promise((resolve, reject) =>{
    loadBMFont(src, (err, font) => {
      err ? reject(err) : resolve(font);
    });
  });
}
// Design:
// Component will be applied to an existing entity.
// Entity's position will determine relative position.
// Entity's material textures will determine text texture.
// Entity's geometry will determine the following
          // Wrap widthhh.
          // Path/texture curving.

// Features:
// COMPLETE Create dynamically generated text
// COMPLETE Customizable font
// COMPLETE Diffuse on bgUv (transparency)
//
// TODO Raycast geometry to background surface
// TODO Raycast diffuse to background material
// TODO Autocalculate geometry



registerComponent('text', {
  schema: {
    color: {
      default: '#FFF',
      parse: (val) => new THREE.Color(val)
    },
    // Will probably need to parse text
    // from string in some way. Do not yet know how it
    // will handle semicolons. Perhaps as an asset that has
    // text as a child.
    text: {
      default: 'This is sometimes a test'
    }
  },
  init: function () {
    var data = this.data;
    Promise.all(
      [
        this.createTextGeometry(data),
        this.createTextMaterial(),
        this.loadTextTexture()
      ]
  ).then((results) => {
      var geometry, material, texture, bgMesh;
      [geometry, material, texture] = results;
      material.uniforms.map.value = texture;

      this.mesh = this.el.getOrCreateObject3D('text', THREE.Mesh);

      this.mesh.geometry = geometry;
      this.mesh.material = material;
      this.mesh.material.needsUpdate = true;

      // hardcodes for moment
      this.mesh.position.x = 5.4;
      this.mesh.position.y = -.25;
      this.mesh.position.z = 0;
      var scale = 11 * -0.005;
      this.mesh.scale.set(scale, scale, scale);

      this.bgMesh = this.el.object3DMap.mesh;
      this.mesh = this.updateBgUv(this.mesh, this.bgMesh);
      this.mesh.material = this.updateMaterial(this.mesh.material, this.bgMesh.material);
    });
  },
  update: function (oldData) {
    if (oldData && oldData.text !== this.data.text) {
      var mesh = this.el.object3DMap.text;
      var bgMesh = this.el.object3DMap.mesh;
      mesh.geometry.update({text: this.data.text});
      mesh = this.updateBgUv(mesh, bgMesh);
      mesh.material = this.updateMaterial(mesh.material, bgMesh.material);
    }
  },

  // update: function () {
  //
  // },
  createTextGeometry: function (opts) {
    var dOpts = {
      text: opts.text,
      align: 'left',
      width: 250,
      color: new THREE.Color('#FFF'),
      font: 'assets/urban.fnt',
      fontTex: 'assets/urban.png'
    };
    return loadFont(dOpts.font).then((font) => {
      dOpts.font = font;
      // Creates geometry using three-bmfont-text
      // and loaded font.
      return createGeometry(dOpts);
    });

  },
  createTextMaterial: function (opts) {
    var mat = this.el.object3DMap.mesh.material;
    opts = this.getShaderOptions({
        smooth: 1 / 32, //the smooth value for SDF
        // should pass as new color directly
        // to the schema.
        color: '#FF00FF'
      });
    return new THREE.ShaderMaterial(opts);
  },
  getShaderOptions: function (opt) {
      var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
      var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.06;
      var smooth = typeof opt.smooth === 'number' ? opt.smooth : 1/16;
      var specular = typeof opt.specular === 'undefined' ? 0x111111 : opt.specular;
      return {
        uniforms: Object.assign({}, THREE.UniformsLib.lights, THREE.UniformsLib.ambient, {
          normalScale: { type: 'f', value: 1 },
          bgRepeat: { type: 'v2', value: new THREE.Vector2(1,1) },
          bgDiffuse: { type: 't', value: new THREE.Texture() },
          bgNormals: { type: 't', value: new THREE.Texture() },
          bgSpecular: { type: 't', value: new THREE.Texture() },
          opacity: { type: 'f', value: opacity },
          smooth: { type: 'f', value: smooth },
          shininess: { type: 'f', value: 140 },
          randomness: { type: 'f', value: 0 },
          graffiti: { type: 'i', value: 0 },
          specularColor: { type: 'c', value: new THREE.Color(specular) },
          map: { type: 't', value: opt.map || new THREE.Texture() },
          color: { type: 'c', value: new THREE.Color(opt.color) }
        }),
        extensions: {
          derivatives: true
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        lights: true,
        vertexShader: textVert,
        fragmentShader: textFrag,
        defines: {
          "USE_MAP": "",
          "ALPHATEST": Number(alphaTest || 0).toFixed(1)
        }
      };
  },
  updateMaterial: function (mat, bgMat) {
    mat.uniforms.bgRepeat.value = bgMat.map === null ? new THREE.Vector2(1,1) : bgMat.map.repeat;
    mat.uniforms.bgDiffuse.value = bgMat.map || new THREE.Texture();
    mat.uniforms.bgNormals.value = bgMat.normalMap || new THREE.Texture();
    mat.uniforms.bgSpecular.value = bgMat.specularMap || new THREE.Texture();
    mat.needsUpdate = true;
    return mat;
  },
  updateBgUv: function (mesh, bgMesh) {
      var bgUv, geom, bgGeom;
      mesh.updateMatrixWorld(true);
      bgMesh.updateMatrixWorld(true);
      geom = mesh.geometry;
      bgGeom = bgMesh.geometry;
      bgGeom.computeBoundingBox();
      const bounds = bgGeom.boundingBox;
      const pos = geom.getAttribute('position');
      const count = pos.itemSize;
      const uvArray = new Float32Array(pos.array.length);

      // Place attribute on BufferGeom
      if (geom.getAttribute('bgUv')) {
        bgUv = geom.getAttribute('bgUv');
        bgUv.array = uvArray;
      } else {
        bgUv = new THREE.BufferAttribute(uvArray, 2);
        geom.addAttribute('bgUv', bgUv);
      }
      geom.needsUpdate = true;

      // This forces buffer refresh on new call
      Object.keys(geom.attributes).forEach(key => {
         var attrib = geom.attributes[key];
         if (attrib.buffer) {
           gl.deleteBuffer(attrib.buffer);
         }
         attrib.needsUpdate = true;
      });

      var tmp = new THREE.Vector4()
      const min = bgMesh.localToWorld(bounds.min.clone());
      const max = bgMesh.localToWorld(bounds.max.clone());
      min.z = 0;
      max.z = 0;
      for (var i=0; i<pos.array.length/count; i++) {
        // The x and y are pulled from the position attribute array.
        // Z is ignored, as we only care from the perspective we are looking at
        // the object.
        const x = pos.array[i * count + 0];
        const y = pos.array[i * count + 1];
        // Temp vector gets the x, y and z=0 set.
        tmp.set(x, y, 0, 1);
        // Since the position values are coming from
        // the text BufferGeometry, it is used to convert
        // the values to world values.
        tmp = mesh.localToWorld(tmp);
        // Converted to a [0, 1] scale
        tmp.x = (tmp.x - min.x) / (max.x - min.x);
        tmp.y = (tmp.y - min.y) / (max.y - min.y);
        // added onto the bgUv attribute.
        bgUv.setXY(i, tmp.x, tmp.y);
      }
      // Update
      bgUv.needsUpdate = true;
      return mesh;
  },
  loadTextTexture: function (opts) {
    return loadTHREETexture('assets/urban.png');
  },
  updateTextGeometry: function (opts) {},
  updateTextMaterial: function (opts) {}
});
