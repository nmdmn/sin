#define PI 3.1415926535897932384626433832795

varying vec2 vUv;
varying vec3 vPos;
varying float vNoise;

void main() {
	float filter = 1. - smoothstep(-.2, .5, length(gl_PointCoord - vec2(.5)));
	gl_FragColor = vec4(1., 1., 1., filter);
}
