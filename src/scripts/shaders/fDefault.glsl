varying vec2 vUv;

void main() {
  float alpha = 1. - smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(.5)));
  gl_FragColor = vec4(vUv, (vUv.x + vUv.y) / 2., alpha);
}
