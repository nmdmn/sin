attribute float noise;

uniform float time;
uniform float scroll;

void main() {
  vec4 worldPosition = modelViewMatrix * vec4(position, 1.);
  gl_PointSize = (375. * noise * (1. / -worldPosition.z)) + 3.;
  gl_Position = projectionMatrix * worldPosition;
}
