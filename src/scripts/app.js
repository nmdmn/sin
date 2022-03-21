import * as DAT from "dat.gui";
import * as THREE from "three";

export default class App {
  constructor(callback) {
    this.settings = {
      camera : {
        fov : 75,
        nearZ : 0.1,
        farZ : 1000,
      },
      display : {
        clearColor : 0x000000,
        aspectRatio : window.innerWidth / window.innerHeight,
      },
      someSetting : 0,
    };
    callback(this.settings);
    this.gui = new DAT.GUI();
    this.gui.add(this.settings, "someSetting", 0, 1, 0.1);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
        this.settings.camera.fov / 2, this.settings.display.aspectRatio,
        this.settings.camera.nearZ, this.settings.camera.farZ);
    this.canvas = document.querySelector("canvas");
    this.renderer = new THREE.WebGLRenderer({canvas : this.canvas});
    this.renderer.setClearColor(this.settings.display.clearColor);
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
