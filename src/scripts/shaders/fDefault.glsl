varying vec2 vUv;

uniform float alpha;

void main() { gl_FragColor = vec4(vUv, .0, alpha); }
