uniform float alpha;

void main() {
  float filter = 1. - smoothstep(-.2, .5, length(gl_PointCoord - vec2(.5)));
  gl_FragColor = vec4(1., 1., 1., alpha * filter);
}
