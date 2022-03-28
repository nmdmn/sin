attribute float noise;

varying vec2 vUv;
varying float vNoise;
varying vec3 vPos;

uniform float time;
uniform float scroll;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  const float animLength = 7.;
  float animTime = mod(time, animLength) / animLength;
  float animOffset = time + 1. / noise;
  float theta = animOffset / 3.;
  float phi = animOffset / 7.;
  float x = smoothstep(-.03, .03, sin(theta) * cos(phi));
  float y = smoothstep(-.03, .03, sin(theta) * sin(phi));
  float z = smoothstep(-.03, .03, cos(theta));
  const float scale = 0.35;
  vec3 newPosition = position + vec3(x, y, z) * scale;
  vec4 worldPosition = modelViewMatrix * vec4(newPosition, 1.);

  vUv = uv;
  vNoise = noise;
  vPos = newPosition;

  gl_PointSize = (25. * (1. / -worldPosition.z) * noise) + 3.;
  gl_Position = projectionMatrix * worldPosition;
}
