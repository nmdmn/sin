import * as Dat from "dat.gui";
import * as Three from "three";
import {
  MapControls,
} from "three/examples/jsm/controls/MapControls";
import {
  OrbitControls,
} from "three/examples/jsm/controls/OrbitControls";
import {
  EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
  UnrealBloomPass
} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default class App {
  constructor(args) {
    this.canvas = document.querySelector(args.querySelect);
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
    // this.cameraControl.rollSpeed = .25;
    this.scenePass = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(
        new Three.Vector2(window.innerWidth, window.innerHeight), .1, 3., .8);
    this.outputPass = new OutputPass();
    this.composer = new EffectComposer(this.renderer);
    // this.composer.renderToScreen = false;
    this.composer.addPass(this.scenePass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.outputPass);
    this.onResize();
    this.clock = new Three.Clock();

    window.addEventListener('resize', () => { this.onResize(); }, false);
  }

  setUpdateCallback(updateCallback) { this.updateCallback = updateCallback; }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    // this.cameraControl.update();
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  tick() {
    this.updateCallback(this.clock.getDelta());
    this.composer.render();

    window.requestAnimationFrame(this.tick.bind(this));
  }

  start() { this.tick(); }
}
