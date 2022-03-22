import * as Dat from "dat.gui";
import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default class App {
  constructor(args, settings) {
    this.canvas = document.querySelector(args.querySelect);

    this.settings = settings;
    this.settings.display = {
      clearColor : 0x111111,
      aspectRatio : this.canvas.offsetWidth / this.canvas.offsetHeight,
    };

    this.scene = new Three.Scene();
    this.renderer = new Three.WebGL1Renderer({canvas : this.canvas});
    this.renderer.setClearColor(this.settings.display.clearColor);
    this.renderer.antialias = true;
    this.camera = new Three.PerspectiveCamera(
        this.settings.camera.fov / 2, this.settings.display.aspectRatio,
        this.settings.camera.nearZ, this.settings.camera.farZ);
    this.camera.position.copy(this.settings.camera.position);
    this.cameraControl = new OrbitControls(this.camera, this.canvas);

    this.gui = new Dat.GUI();

    const uiSettingsPropNames = Object.getOwnPropertyNames(this.settings.ui);
    for (let uiItemId in uiSettingsPropNames) {
      const uiItemName = uiSettingsPropNames[uiItemId];
      const uiItem = this.settings.ui[uiItemName];
      if (uiItem.hasOwnProperty("type") && uiItem.type == "color") {
        this.gui.addColor(uiItem, "data").name(uiItemName);
      } else {
        this.gui.add(uiItem, "data", uiItem.min, uiItem.max, uiItem.step)
            .name(uiItemName);
      }
    }

    this.onResize();
    window.addEventListener('resize', () => { this.onResize(); });

    this.clock = new Three.Clock();
  }

  setUpdateCallback(updateCallback) { this.updateCallback = updateCallback; }

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.settings.display.aspectRatio = this.canvas.width / this.canvas.height;
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera.aspect = this.settings.display.aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  tick() {
    this.updateCallback(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.tick.bind(this));
  }

  start() { this.tick(); }
}
