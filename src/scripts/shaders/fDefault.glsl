varying vec2 vUv;

void main() { gl_FragColor = vec4(vUv, (vUv.x + vUv.y) / 2., 1.); }
