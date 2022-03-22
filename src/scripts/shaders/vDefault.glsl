varying vec2 vUv;

uniform float time;
uniform int scroll;

void main() {
  vUv = uv;
  vec4 worldPosition = modelViewMatrix * vec4(position, 1.);
  gl_PointSize = 42. * (1. / -worldPosition.z);
  gl_Position = projectionMatrix * worldPosition;
}
