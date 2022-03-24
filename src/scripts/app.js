import * as Dat from "dat.gui";
import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default class App {
  constructor(args, settings) {
    this.canvas = document.querySelector(args.querySelect);

    this.settings = settings;
    this.settings.display = {
      clearColor : 0x000000,
    };

    this.scene = new Three.Scene();
    this.renderer = new Three.WebGL1Renderer({
      canvas : this.canvas,
      antialias : true,
      alpha : false,
    });
    this.renderer.setClearColor(this.settings.display.clearColor);
    this.camera = new Three.PerspectiveCamera(
        this.settings.camera.fov / 2, window.innerWidth / window.innerHeight,
        this.settings.camera.nearZ, this.settings.camera.farZ);
    this.camera.position.copy(this.settings.camera.position);
    this.camera.rotation.copy(this.settings.camera.rotation);
    this.cameraControl = new OrbitControls(this.camera, this.canvas);

    this.gui = new Dat.GUI();

    const uiSettingsPropNames = Object.getOwnPropertyNames(this.settings.ui);
    for (let uiItemId in uiSettingsPropNames) {
      const uiItemName = uiSettingsPropNames[uiItemId];
      const uiItem = this.settings.ui[uiItemName];
      if (uiItem.hasOwnProperty("type") && uiItem.type == "color") {
        this.gui.addColor(uiItem, "value").name(uiItemName);
      }
      if (uiItem.hasOwnProperty("listen") && uiItem.listen) {
        this.gui.add(uiItem, "value", uiItem.min, uiItem.max, uiItem.step)
            .name(uiItemName)
            .listen();
      } else {
        this.gui.add(uiItem, "value", uiItem.min, uiItem.max, uiItem.step)
            .name(uiItemName)
      }
    }

    this.onResize();
    window.addEventListener('resize', () => { this.onResize(); }, false);
    window.addEventListener('keydown', event => { this.onKey(event); });

    this.clock = new Three.Clock();
  }

  setUpdateCallback(updateCallback) { this.updateCallback = updateCallback; }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onKey(event) {
    switch (event.key) {
    case "Escape":
      Dat.GUI.toggleHide();
      break;
    }
  }

  tick() {
    this.updateCallback(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.tick.bind(this));
  }

  start() { this.tick(); }
}
