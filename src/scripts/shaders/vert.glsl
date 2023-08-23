#define PI 3.1415926535897932384626433832795

attribute float noise;

varying vec2 vUv;
varying float vNoise;
varying vec3 vPos;
varying float vNoiseSampledFrequency;
varying float vUVSampledFrequency;

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
  vUv = uv;
  vNoise = noise;
  vPos = position;
  vNoiseSampledFrequency = texture2D(audioData, vec2(noise * 0.2, 0.)).r;

  const float animationSeconds = 180.;
  const float animationSeconds2 = 15.;
  const float mapSizeHalf = 1.25;
  float offsetValue = sin(2. * PI * (time - .75) / animationSeconds);
  float offsetValue2 =
      sin(2. * PI * (1. - noise - .75) / animationSeconds2) / 2. + .5;
  vUVSampledFrequency = texture2D(audioData, vec2(offsetValue2, .0)).r;
  float x = position.x + offsetValue * mapSizeHalf;
  float y = position.y + smoothstep(-1., .5, vUVSampledFrequency);
  float z = smoothstep(-.07, .5, noise / 16. * (vNoiseSampledFrequency + 1.));

  vec3 distortedPosition = vec3(x, y, z);
  vec4 worldPosition = modelViewMatrix * vec4(distortedPosition, 1.);

  gl_PointSize = 10. / -worldPosition.z;
  gl_Position = projectionMatrix * worldPosition;
}
