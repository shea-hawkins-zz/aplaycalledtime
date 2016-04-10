import { registerShader, utils, systems, THREE} from 'aframe';
var srcLoader = utils.srcLoader;
var texture = utils.texture;
var loader = new THREE.TextureLoader();


/** pure
  * Parses Strings as THREE constants
  *
  * @param {string} str - string of constant key
  * @returns {const} THREE constant
  */
function parseTHREEConstant(str) {
  if (THREE[str]) {
    return THREE[str];
  } else {
    return str;
  }
};
/** pure
  * Determines options set on an asset.
  *
  * @param {obj || str} src - source of the texture
  * @param {str} attr - attribute to search for asset-specific style
  * @param {obj || undef} def - global defaults
  * @returns {obj} Options to apply to texture
  */
function getAssetData(el, attr, def) {
    def = def || {};
    var val = el.getAttribute(attr);
    if (val) {
      var style = utils.styleParser.parse(val);
      Object.keys(style).forEach((key) => {
        def[key] = parseTHREEConstant(style[key]);
      });
    }
    return def;
}
/** impure - emits textureloaded and operates on element load
  * Takes a src and options and returns a promised texture.
  *
  * @param {obj} loader - loader for the materials
  * @param {obj || undef} opts - options to apply to texture
  * @returns {obj} Texture promise with options applied
  */
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


registerShader('phong', {
  schema: {
    color: {
      default: '#FFF',
      parse: (val) => new THREE.Color(val)
    },
    // This and all other maps can be
    // a string to a src or a queryselector
    map: {
      default: null
    },
    lightMap: {
      default: null
    },
    emissiveMap: {
      default: null
    },
    normalMap: {
      default: null
    },
    specularMap: {
      default: null
    },
    alphaMap: {
      default: null
    },
    displacementMap: {
      default: null
    },
    displacementScale: {
      default: 1
    },
    displacementBias: {
      default: 0
    },
    envMap: {
      default: null
    },
    fog: {
      default: true
    },
    shading: {
      default: "SmoothShading",
      parse: (value) => parseTHREEConstant(value)
    },
    wireframe: {
      default: false
    },
    wireframeLinewidth: {
      default: 1
    },
    wireframeLinecap: {
      default: 'round'
    },
    wireframeLinejoin: {
      default: 'round'
    },
    vertexColors: {
      default: "NoColors",
      parse: (value) => parseTHREEConstant(value)
    },
    skinning: {
      default: false
    },
    morphTargets: {
      default: false
    },
    morphNormals: {
      default: false
    },
    // Sets defaults for all texture vars
    mapping: {
      default: "UVMapping",
      oneOf: ["CubeReflectionMapping", "CubeRefractionMapping", "SphericalReflectionMapping"],
      parse: (value) => parseTHREEConstant(value)
    },
    wrapS: {
      default: "ClampToEdgeWrapping",
      oneOf: ["ClampToEdgeWrapping", "RepeatWrapping", "MirroredRepeatWrapping"],
      parse: (value) => parseTHREEConstant(value)
    },
    wrapT: {
      default: "ClampToEdgeWrapping",
      oneOf: ["ClampToEdgeWrapping", "RepeatWrapping", "MirroredRepeatWrapping"],
      parse: (value) => parseTHREEConstant(value)
    },
    magFilter: {
      default: "LinearFilter",
      oneOf: ["LinearFilter", "NearestFilter"],
      parse: (value) => parseTHREEConstant(value)
    },
    minFilter: {
      default: "LinearMipMapLinearFilter",
      oneOf: ["LinearMipMapLinearFilter", "NearestFilter", "NearestMipMapNearestFilter",
              "NearestMipMapLinearFilter", "LinearFilter", "LinearMipMapNearestFilter"],
      parse: (value) => parseTHREEConstant(value)
    },
    format: {
      default: "RGBAFormat",
      oneOf: ["RGBAFormat", "AlphaFormat", "RGBFormat", "LuminanceFormat", "LuminanceAlphaFormat",
              "RGB_S3TC_DXT1_Format", "RGBA_S3TC_DXT1_Format", "RGBA_S3TC_DXT3_Format", "RGBA_S3TC_DXT5_Format"],
      parse: (value) => parseTHREEConstant(value)
    },
    texType: {
      default: "UnsignedByteType",
      oneOf: ["UnsignedByteType", "ByteType", "ShortType", "UnsignedShortType", "UnsignedIntType", "UnsignedShort4444Type",
              "Unsignedshort5551Type", "UnsignedShort565Type"],
      parse: (value) => parseTHREEConstant(value)
    },
    anisotropy: {
      //Max is renderer.getMaxanisotropy()
      default: 1
    },
    generateMipmaps: {
      default: true
    },
    flipY: {
      default: true
    },
    premultiplyAlpha: {
      default: false
    }
  },
  texturePromises: {},
  textureDefaults: {},
  textureSrc: {},
  maps: [
    "map",
    "lightMap",
    "aoMap",
    "emissiveMap",
    "bumpMap",
    "normalMap",
    "specularMap",
    "alphaMap",
    "displacementMap",
    "envMap"
  ],
  texOpts: [
    "image",
    "mapping",
    "wrapS",
    "wrapT",
    "magFilter",
    "minFilter",
    "format",
    "texType",
    "anisotropy",
    "generateMipmaps",
    "flipY",
    "premultiplyAlpha"
  ],
  init: function (data) {
    this.material = new THREE.MeshPhongMaterial(this.parseMaterialVars(data));
    this.updateTextures(data);
    return this.material;
  },
  update: function (data) {
    this.updateMaterial(this.parseMaterialVars(data));
    this.updateTextures(data);
    return this.material;
  },
  // Removes the map and texture options from the material vars
  parseMaterialVars: function (data) {
    var matData = {};
    Object.keys(data).forEach((key) => {
    if (this.texOpts.indexOf(key) === -1
            && this.maps.indexOf(key) === -1
              && key !== "shader") {
       matData[key] = data[key];
     }
    });
    return matData;
  },
  updateTextureGlobals: function (data) {
    Object.keys(data).forEach((key) => {
      key = key === "texType" ? "type" : key;
      if (this.texOpts.indexOf(key) !== -1) {
        this.texOpts[key] = data[key];
      }
    });
    return this.texOpts;
  },
  updateMaterial: function (data) {
    Object.keys(data).forEach((key) => {
      this.material[key] = data[key];
    });
    return this.material;
  },
  updateTextures: function (data) {
    var texDef = this.updateTextureGlobals(data);
    Object.keys(data).map((key) => {
      // Excludes data source keys that haven't changed,
      // assumed already in transit as well
      if (this.maps.indexOf(key) !== -1 && data[key] !== this.textureSrc[key]) {
        var p = loadTHREETexture(data[key], texDef);
        this.texturePromises[key] = p;
        p.then((tex) => {
          this.material[key] = tex;
          this.textureSrc[key] = data[key];
          this.material[key].needsUpdate = true;
          this.material.needsUpdate = true;
        }).catch((e) => {
          console.log(e);
        });
      }
    });
  }
});
