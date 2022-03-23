varying vec2 vUv;

uniform float time;
uniform float scroll;

void main() {
  vUv = uv;
  vec4 worldPosition = modelViewMatrix * vec4(position, 1.);
  float wobbleCoef = sin(time * distance(vec2(0, 0), uv)) + 2.;
  gl_PointSize = 22. * (1. / -worldPosition.z) * wobbleCoef;
  gl_Position = projectionMatrix * worldPosition;
}
