attribute float random;

varying vec2 vUv;

uniform float time;
uniform float scroll;

void main() {
  vUv = uv;
  float asd = cos(time);
  float wobbleCoef = smoothstep(
      -.5, 3., smoothstep(asd, 1., sin(time + distance(vec2(.0, .0), uv))));
  vec3 displacedPos = vec3(position.xy, wobbleCoef * (1. - random));
  vec4 worldPosition = modelViewMatrix * vec4(displacedPos, 1.);
  gl_PointSize = (11. * (1. / -worldPosition.z) * random * 2.) + 3.;
  gl_Position = projectionMatrix * worldPosition;
}
