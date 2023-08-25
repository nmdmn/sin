import MusicUrl from "url:../audio/nmd-pulsar.mp3"
import * as Tween from "@tweenjs/tween.js";
import {createNoise3D} from "simplex-noise";

import * as Three from "three";
import {Euler, Vector3} from "three";

import {App, BufferObject} from "./app.js";

class MusicPlayer {
	constructor(args, app) {
		this.initSound(app);

		const playButton = document.querySelector("." + args.playButton);
		document.addEventListener("transitionend", function(event) {
			if (event.target.matches("." + args.playerStart)) {
				playButton.classList.remove(args.playerStart);
			}
		});
		playButton.addEventListener("click", (event) => {
			event.preventDefault();

			if (this.sound.isPlaying) {
				this.sound.pause();
			} else {
				this.sound.play();
			}

			if (playButton.classList.contains(args.playerStop)) {
				playButton.classList.remove(args.playerStop);
				playButton.classList.add(args.playerStart);
			} else if (!playButton.classList.contains(args.playerStart)) {
				playButton.classList.add(args.playerStop);
			}
		});
	}

	initSound(app) {
		this.audioListener = new Three.AudioListener();
		app.camera.add(this.audioListener);
		this.sound = new Three.Audio(this.audioListener);
		// this.sound.setMediaElementSource(document.querySelector("audio"));
		const loader = new Three.AudioLoader(app.loadingManager);
		loader.load(MusicUrl, buffer => {
			this.sound.setBuffer(buffer);
			this.sound.setLoop(true);
			this.sound.setVolume(1.);
		});
		this.fftSize = 4096;
		this.analyser = new Three.AudioAnalyser(this.sound, this.fftSize);
	}
}

import GridFragmentShader from "./shaders/grid_frag.glsl";
import GridVertexShader from "./shaders/grid_vert.glsl";
class GridModel {
	constructor(app, music) {
		this.initGeometry();
		this.initShader({
			time : {type : "f", value : app.clock.getElapsedTime()},
			scroll : {type : "f", value : window.scrollY},
			audioData : {
				value : new Three.DataTexture(music.analyser.data, music.fftSize / 2, 1,
																			(app.renderer.capabilities.isWebGL2) ? Three.RedFormat : Three.LuminanceFormat)
			}
		});
		this.mesh = new Three.Points(this.geometry, this.shader);
		app.scene.add(this.mesh);

		app.callback = dT => {
			this.shader.uniforms.time.value = app.clock.getElapsedTime();
			this.shader.uniforms.scroll.value = window.scrollY;
			music.analyser.getFrequencyData();
			this.shader.uniforms.audioData.value.needsUpdate = true;
		};
	}

	initShader(uniforms) {
		this.shader = new Three.ShaderMaterial({
			side : Three.DoubleSide,
			clipping : true,
			fog : false,
			wireframe : true,
			transparent : false,
			depthTest : false,
			depthWrite : false,
			blending : Three.AdditiveBlending,
			extensions : {
				derivates : "#extensions GL_OES_standard_derivates : enable",
				fragDepth : true,
				drawBuffers : true,
				shaderTextureLOD : true,
			},
			uniforms : uniforms,
			vertexShader : GridVertexShader,
			fragmentShader : GridFragmentShader,
		});
	}

	initGeometry() {
		this.geometry = new Three.PlaneGeometry(5, 5, 256, 256);
		const posArrayLen = this.geometry.attributes.position.array.length;
		const numVertices = posArrayLen / 3;
		const noisePerVertex = new Float32Array(numVertices);
		const noise = new createNoise3D();
		for (let i = 0; i < posArrayLen; i += 3) {
			const offset = 2.;
			const noiseVal = noise(this.geometry.attributes.position.array[i] * offset,
														 this.geometry.attributes.position.array[i + 1] * offset,
														 this.geometry.attributes.position.array[i + 2] * offset);
			noisePerVertex.set([ noiseVal ], i / 3);
		}
		this.geometry.setAttribute("noise", new Three.BufferAttribute(noisePerVertex, 1));
	}
}

import BoxFragmentShader from "./shaders/box_frag.glsl";
import BoxVertexShader from "./shaders/box_vert.glsl";
class BoxModel {
	constructor(app) {
		this.initGeometry(10., 4.);
		this.initShader({
			time : {type : "f", value : app.clock.getElapsedTime()},
		});
		this.mesh = new Three.Points(this.geometry, this.shader);
		app.scene.add(this.mesh);

		const coords = {x : app.camera.position.x, y : app.camera.position.y, z : app.camera.position.z};
		new Tween.Tween(coords)
				.to({x : 15., y : 15., z : 15.}, 5000.)
				.easing(Tween.Easing.Back.InOut) // NOTE https://sole.github.io/tween.js/examples/03_graphs.html
				.onUpdate(() => app.camera.position.set(coords.x, coords.y, coords.z))
				.start();

		app.callback = dT => {
			this.shader.uniforms.time.value = app.clock.getElapsedTime();
			Tween.update();
		};
	}

	initShader(uniforms) {
		this.shader = new Three.ShaderMaterial({
			side : Three.DoubleSide,
			clipping : true,
			fog : true,
			wireframe : true,
			transparent : true,
			depthTest : false,
			depthWrite : false,
			blending : Three.AdditiveBlending,
			extensions : {
				derivates : "#extensions GL_OES_standard_derivates : enable",
				fragDepth : true,
				drawBuffers : true,
				shaderTextureLOD : true,
			},
			uniforms : uniforms,
			vertexShader : BoxVertexShader,
			fragmentShader : BoxFragmentShader,
		});
	}

	initGeometry(size, resolution) {
		const unit = size / resolution;
		const numVertices = resolution ** 3;									// NOTE its a cube
		const positionVBO = new BufferObject(numVertices, 3); // NOTE 3d positions, num of comps per vertex is 3
		const noiseVBO = new BufferObject(numVertices, 1);		// NOTE its a single float normalized
		const sampler = new createNoise3D();
		for (let nY = 0; nY < resolution; nY++) {
			for (let nZ = 0; nZ < resolution; nZ++) {
				for (let nX = 0; nX < resolution; nX++) {
					const x = (nX + .5) * unit - size / 2;
					const y = (nY + .5) * unit - size / 2;
					const z = (nZ + .5) * unit - size / 2;
					positionVBO.add([ x, y, z ]);
					noiseVBO.add([ sampler(x, y, z) ]);
				}
			}
		}
		this.geometry =
				new Three.BufferGeometry()
						.setAttribute("position", new Three.BufferAttribute(positionVBO.dataArray, positionVBO.numComponents))
						.setAttribute("noise", new Three.BufferAttribute(noiseVBO.dataArray, noiseVBO.numComponents));
	}
}

export default class AuidoVisualizer {
	constructor(args) {
		args.clearColor = 0x000000;
		args.camera = new Three.PerspectiveCamera(63 / 2, window.innerWidth / window.innerHeight, .1, 1000.);
		args.camera.position.copy(new Vector3(0., -.5, .5));
		args.camera.rotation.copy(new Euler(1.0743653137563398, -0.07281009791107526, 0.1334985012224377));
		// args.camera.position.copy(new Vector3(150., 150., 150.));
		// args.camera.lookAt(new Vector3(0., 0., 0.));

		const app = new App(args);

		const music = new MusicPlayer(args, app);
		const model = new GridModel(app, music);
		// const model = new BoxModel(app);

		app.start();
	}
}
