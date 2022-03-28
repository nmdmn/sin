varying vec2 vUv;
varying float vNoise;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  float alpha = 1. - smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(.5)));
  float phi = vNoise * 2. * 3.1614;
  float theta = 1. / vNoise * 3.1614;
  float r = map(sin(theta) * cos(phi), -1., 1., .0, 1.);
  float g = map(sin(theta) * sin(phi), -1., 1., .0, 1.);
  float b = map(cos(phi), -1., 1., .0, 1.);
  gl_FragColor = vec4(vec3(r, g, b), alpha);
}
