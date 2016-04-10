// varying vec2 bgUv;
// Varies based off of interpolation
varying vec2 vUv;
varying vec2 vBgUv;
varying vec3 surfacePosition;
const float PI = 3.141592653589793238462643383;
// Bufferattribute that varies and is set by updateBgUv
attribute vec2 bgUv;
// constant per set
uniform vec2 bgRepeat;

void main() {
  vUv = uv;

  surfacePosition = (modelMatrix * vec4(position, 1.0)).xyz;

  // Rotate texture. Will need to break
  // a param as it depends on face underneath.
  vBgUv = bgUv * bgRepeat;
  // Transform to origin, rotate, and return to coord space
  vBgUv = vBgUv + vec2(-0.5, -0.5);
  //vBgUv = mat2(cos(PI / 4.0), sin(PI / 4.0), -sin(PI / 4.0), cos(PI / 4.0)) * vBgUv;
  vBgUv = vBgUv + vec2(0.5, 0.5);
  vBgUv = vec2(vBgUv.x, 1.0 - vBgUv.y);

  gl_Position = projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);

  // mat4 modelxz = modelViewMatrix;
  // vec4 projected = modelxz * vec4(position.xy, 0.0, 1.0);
  // bgUv = projected.xy;
}
