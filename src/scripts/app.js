import * as DAT from "dat.gui";
import * as THREE from "three";

export default class App {
  constructor(callback) {
    this.settings = {
      clearColor : 0x000000,
      fov : 75,
      someSetting : 0,
    };
    callback(this.settings);
    this.gui = new DAT.GUI();
    this.gui.add(this.settings, "someSetting", 0, 1, 0.1);
    this.scene = new THREE.Scene();
    this.aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(this.settings.fov / 2,
                                              this.aspectRatio, 0.1, 1000);
    this.canvas = document.querySelector("canvas");
    this.renderer = new THREE.WebGLRenderer({canvas : this.canvas});
    this.renderer.setClearColor(this.settings.clearColor);
    this.onWindowResize();
    this.setEventListeners();
  }

  update() {
    this.updateCallback(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.update.bind(this));
  }

  start(callback) {
    this.clock = new THREE.Clock();
    this.updateCallback = callback;
    this.update();
  }

  setEventListeners() {
    window.addEventListener('resize', () => { this.onWindowResize(); });
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.style.width / this.canvas.style.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.style.width, this.canvas.style.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
}
