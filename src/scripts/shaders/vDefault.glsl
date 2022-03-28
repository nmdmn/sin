attribute float noise;

varying vec2 vUv;
varying float vNoise;

uniform float time;
uniform float scroll;

void main() {
  vUv = uv;
  vNoise = noise;
  vec4 worldPosition = modelViewMatrix * vec4(position, 1.);
  // gl_PointSize = (20. * (1. / -worldPosition.z) * noise) + 3.;
  gl_PointSize = 5.;
  gl_Position = projectionMatrix * worldPosition;
}
