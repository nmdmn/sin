#define PI 3.1415926535897932384626433832795

attribute float noise;

varying vec2 vUv;
varying vec3 vPos;
varying float vNoise;

uniform float time;

void main() {
	vec4 worldPosition = modelViewMatrix * vec4(position, 1.);
	gl_PointSize = (300. * noise * (1. / -worldPosition.z)) + 15.;
	gl_Position = projectionMatrix * worldPosition;
}
