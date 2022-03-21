import * as Dat from "dat.gui";
import * as Three from "three";

export default class App {
  constructor(args, settings) {
    this.canvas = document.querySelector(args.querySelect);

    this.settings = settings;
    this.settings["display"] = {
      clearColor : 0xff1111,
      aspectRatio : this.canvas.offsetWidth / this.canvas.offsetHeight,
    };

    this.scene = new Three.Scene();
    this.renderer = new Three.WebGL1Renderer({canvas : this.canvas});
    this.renderer.setClearColor(this.settings.display.clearColor);
    this.camera = new Three.PerspectiveCamera(
        this.settings.camera.fov / 2, this.settings.display.aspectRatio,
        this.settings.camera.nearZ, this.settings.camera.farZ);
    this.camera.position.copy(this.settings.camera.position);

    this.gui = new Dat.GUI();

    const uiSettingsPropNames = Object.getOwnPropertyNames(this.settings.ui);
    for (let uiItemId in uiSettingsPropNames) {
      const uiItemName = uiSettingsPropNames[uiItemId];
      const uiItem = this.settings.ui[uiItemName];
      this.gui.add(uiItem, uiItemName, uiItem.min, uiItem.max, uiItem.step);
    }

    this.onResize();
    window.addEventListener('resize', () => { this.onResize(); });
  }

  setUpdateCallback(updateCallback) { this.updateCallback = updateCallback; }

  onResize() {
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera.aspect = this.settings.display.aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  tick() {
    this.updateCallback(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.tick.bind(this));
  }

  start() {
    this.clock = new Three.Clock();
    this.tick();
  }
}
