varying vec2 vUv;

uniform int scroll;
uniform float time;

void main() {
  vUv = uv;
  vec4 worldPosition = modelViewMatrix * vec4(position, 1.);
  gl_PointSize = 33. * (1. / -worldPosition.z);
  gl_Position = projectionMatrix * worldPosition;
}
