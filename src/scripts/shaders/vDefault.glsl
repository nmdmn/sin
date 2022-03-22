varying vec2 vUv;

uniform float time;
uniform int scroll;

void main() {
  vUv = uv;
  vec4 worldPosition = modelViewMatrix * vec4(position, 1.);
  float wobbleCoef = sin(time) + 2.;
  gl_PointSize = 22. * (1. / -worldPosition.z) * wobbleCoef;
  gl_Position = projectionMatrix * worldPosition;
}
