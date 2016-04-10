// set in vertex shader
varying vec2 vUv;
varying vec2 vBgUv;
varying vec3 surfacePosition;

// Passed from definition
uniform float smooth;
uniform vec3 color;
uniform float opacity;
uniform vec3 specularColor;

// Maps
uniform sampler2D map;
uniform sampler2D bgDiffuse;
uniform sampler2D bgNormals;
uniform sampler2D bgSpecular;

// More passed
uniform float normalScale;
uniform float shininess;
uniform float randomness;
uniform int graffiti;

// MAX_DIR_LIGHTS is part of the glsl spec
// otherwise these three are from THREE
uniform vec3 ambientLightColor;
#if NUM_DIR_LIGHTS > 0
  struct DirectionalLight {
    vec3 direction;
    vec3 color;
    int shadow;
    float shadowBias;
    float shadowRadius;
    vec2 shadowMapSize;
  };
  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

//Including shader effects.
#pragma glslify: aastep = require('glsl-aastep')
#pragma glslify: perturb = require('glsl-perturb-normal')
#pragma glslify: faceNormal = require('glsl-face-normal')
#pragma glslify: diffuse = require('glsl-diffuse-oren-nayar')
#pragma glslify: specular = require('glsl-specular-blinn-phong')
// function declaration
// returns vec3, takes in normal, matrixCompMult(mat a, mat b)
vec3 transformDirection(in vec3 normal, in mat4 matrix) {
// normalize returns unit vector (divided by length)
  return normalize((matrix * vec4(normal, 0.0)).xyz);
}
void main() {
  float opacity = 0.8;
  vec3 viewDirection = cameraPosition - surfacePosition;
  vec4 texVec = texture2D(map, vUv);
  vec4 diffuseVec = texture2D(bgDiffuse, vBgUv);
  vec4 normalVec = texture2D(bgNormals, vBgUv);
  vec4 specVec = texture2D(bgSpecular, vBgUv);
  vec3 V = normalize(viewDirection);
  vec3 N = normalize(faceNormal(viewDirection));

  // get light properties from ThreeJS
  // Lights currently not functioning.
  vec3 lightColor = directionalLights[0].color;
  vec3 L = transformDirection(directionalLights[0].direction, viewMatrix);

  // Compute normal based off tex
  vec3 normalMap = normalVec.xyz * 2.0 - 1.0;
  vec3 surfaceNormal = perturb(normalMap, N, V, vUv);

  // Compute specular light intensity/direction.
  vec3 specularColor = specVec.rgb;
  vec3 specularLight = specularColor * specular(L, V, surfaceNormal, 2.0);

  vec3 bgColor = diffuseVec.rgb;
  vec3 texColor = texVec.rgb;

  vec3 diffuseColor = bgColor * (1.0 - opacity) + color * opacity;
  vec3 diffuseLight = diffuseColor * diffuse(L, V, surfaceNormal, 1.0, 1.2);

  vec3 finalLight = specularLight + diffuseLight;
  gl_FragColor.rgb = finalLight;

  // Alpha to be calc from the sdf map

  float alpha = texVec.a;
  gl_FragColor.a = alpha * opacity;
  if (gl_FragColor.a < 0.06)
    discard;
}
