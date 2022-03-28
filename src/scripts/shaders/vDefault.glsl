attribute float noise;

varying vec2 vUv;
varying float vNoise;

uniform float time;
uniform float scroll;

void main() {
  vUv = uv;
  vNoise = noise;

  float alpha = (time / 4.) * (1. / noise);
  vec3 displaced = vec3(.0, .0, smoothstep(-.5, 1., sin(alpha)) / 4.);
  vec4 worldPosition = modelViewMatrix * vec4(displaced + position, 1.);
  gl_PointSize = (75. * (1. / -worldPosition.z) * noise) + 3.;
  gl_Position = projectionMatrix * worldPosition;
}
