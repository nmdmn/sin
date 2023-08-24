import * as Dat from "dat.gui";

import * as Three from "three";
import {MapControls} from "three/examples/jsm/controls/MapControls";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class BufferObject {
	constructor(size, numComponents) {
		this.dataArray = new Float32Array(size * numComponents);
		this.numComponents = numComponents;
		this.currentIt = 0;
	}

	add(data) {
		this.dataArray.set(data, this.currentIt);
		this.currentIt += this.numComponents;
	}
}

export class App {
	constructor(args) {
		this.loadingManager = new Three.LoadingManager(() => {
			const loadingScreen = document.querySelector(args.queryLoadingSreen);
			loadingScreen.classList.add(args.loadedClass);
		});

		this.canvas = document.querySelector(args.queryCanvas);
		this.renderer = new Three.WebGLRenderer({
			canvas : this.canvas,
			antialias : true,
			alpha : true,
			toneMapping : Three.ReinhardToneMapping,
		});
		this.renderer.setClearColor(args.clearColor);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.scene = new Three.Scene();
		this.camera = args.camera;
		// this.cameraControl = new MapControls(this.camera, this.canvas);
		// this.cameraControl = new OrbitControls(this.camera, this.canvas);
		// this.cameraControl.rollSpeed = .25;
		this.scenePass = new RenderPass(this.scene, this.camera);
		this.bloomPass = new UnrealBloomPass(new Three.Vector2(window.innerWidth, window.innerHeight), .1, 3., .8);
		this.outputPass = new OutputPass();
		this.composer = new EffectComposer(this.renderer);
		// this.composer.renderToScreen = false;
		this.composer.addPass(this.scenePass);
		this.composer.addPass(this.bloomPass);
		this.composer.addPass(this.outputPass);
		this.onResize();
		this.clock = new Three.Clock();

		window.addEventListener('resize', () => { this.onResize(); }, false);

		this.callback = () => {};
	}

	onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		// this.cameraControl.update();
		this.composer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
	}

	tick() {
		this.callback(this.clock.getDelta());
		this.composer.render();

		window.requestAnimationFrame(this.tick.bind(this));
	}

	start() { this.tick(); }
}
