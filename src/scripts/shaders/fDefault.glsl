varying vec2 vUv;
varying float vNoise;

void main() {
  float alpha = 1. - smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(.5)));
  gl_FragColor = vec4(vec3(vNoise), 1.);
}
