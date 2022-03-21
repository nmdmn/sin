import * as DAT from "dat.gui";
import * as THREE from "three";

export default class App {
  constructor(callback) {
    this.settings = {
      someSettingFrom0To1 : 0,
      clearColor : 0x121212,
    };
    callback(this.settings);
    this.gui = new DAT.GUI();
    this.gui.add(this.settings, "someSettingFrom0To1", 0, 1, 0.1);
    this.scene = new THREE.Scene();
    this.aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(42, this.aspectRatio, 0.1, 1000);
    this.canvas = document.querySelector("canvas");
    this.renderer = new THREE.WebGLRenderer({canvas : this.canvas});
    this.renderer.setClearColor(this.settings.clearColor);
    this.onWindowResize();
    this.setEventListeners();
  }

  update() {
    this.updateCallback(42);
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.update.bind(this));
  }

  start(callback) {
    this.updateCallback = callback;
    this.update();
  }

  setEventListeners() {
    window.addEventListener('resize', () => { this.onWindowResize(); });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
}
