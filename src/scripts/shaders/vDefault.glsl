varying vec2 vUv;

uniform int scroll;

void main() {
  vUv = uv;
  vec4 worldPosition = modelViewMatrix * vec4(position, 1.);
  gl_PointSize = 1000. * (1. / -worldPosition.z);
  gl_Position = projectionMatrix * worldPosition;
}
