attribute float noise;

varying vec2 vUv;
varying float vNoise;

uniform float time;
uniform float scroll;

void main() {
  vUv = uv;
  vNoise = noise;

  float alpha = 10. * smoothstep(-5., 5., (time / 2. * (1. / noise)));
  vec3 displaceZ = vec3(.0, .0, smoothstep(-.03, .03, sin(alpha)) / 4.);
  vec4 worldPosition = modelViewMatrix * vec4(displaceZ + position, 1.);
  gl_PointSize = (75. * (1. / -worldPosition.z) * noise) + 3.;
  gl_Position = projectionMatrix * worldPosition;
}
