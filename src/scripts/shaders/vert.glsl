#define PI 3.1415926535897932384626433832795

attribute float noise;

varying vec2 vUv;
varying float vNoise;
varying vec3 vPos;

uniform float time;
uniform float scroll;
uniform sampler2D audioData;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float toLog(float value, float min1, float max1) {
  float exp = (value - min1) / (max1 - min1);
  return min1 * pow(max1 / min1, exp);
}

void main() {
  float sampledFrequency =
      texture2D(audioData, uv * .8).r; // on 48kHz, 1/5 on top is useless?

  float animOffset = time / 100. + 1. / noise;
  float theta = uv.x * 2. * PI * animOffset;
  float phi = uv.y * 2. * PI * animOffset;
  float x = sin(theta) * cos(phi);
  float y = sin(theta) * sin(phi);
  float z = cos(theta);

  vec3 distortedPosition = vec3(x, y, z);
  vec4 worldPosition = modelViewMatrix * vec4(distortedPosition, 1.);

  vUv = uv;
  vNoise = noise;
  vPos = distortedPosition;

  gl_PointSize = 10. / -worldPosition.z;
  gl_Position = projectionMatrix * worldPosition;
}
