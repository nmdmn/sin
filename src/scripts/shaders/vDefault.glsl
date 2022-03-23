varying vec2 vUv;

uniform float time;
uniform float scroll;

void main() {
  vUv = uv;
  vec4 worldPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * worldPosition;
}
