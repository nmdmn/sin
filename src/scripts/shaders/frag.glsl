varying vec2 vUv;
varying float vNoise;
varying vec3 vPos;
varying float vSampledFrequency;

uniform float time;
uniform float scroll;
uniform sampler2D audioData;

vec3 coldColor = vec3(22. / 255., 160. / 255., 133. / 255.);
vec3 hotColor = vec3(241. / 255., 196. / 255., 15. / 255.);

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  float alpha = 1. - smoothstep(0., .5, length(gl_PointCoord - vec2(.5)));
  gl_FragColor = vec4(mix(coldColor, hotColor, vNoise), alpha);
}
