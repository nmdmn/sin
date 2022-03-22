import * as Dat from "dat.gui";
import * as Three from "three";
import {
  FlyControls,
  OrbitControls
} from "three/examples/jsm/controls/FlyControls";

export default class App {
  constructor(args, settings) {
    this.canvas = document.querySelector(args.querySelect);

    this.settings = settings;
    this.settings.display = {
      clearColor : 0x111111,
      aspectRatio : this.canvas.width / this.canvas.height,
    };

    this.scene = new Three.Scene();
    this.renderer = new Three.WebGL1Renderer({canvas : this.canvas});
    this.renderer.setClearColor(this.settings.display.clearColor);
    this.renderer.antialias = true;
    this.camera = new Three.PerspectiveCamera(
        this.settings.camera.fov / 2, this.settings.display.aspectRatio,
        this.settings.camera.nearZ, this.settings.camera.farZ);
    this.camera.position.copy(this.settings.camera.position);
    this.camera.rotation.copy(this.settings.camera.rotation);
    this.cameraControl = new FlyControls(this.camera, this.canvas);
    this.cameraControl.dragToLook = true;

    this.settings.ui["camRotX"] = {
      data : this.camera.rotation.x,
      min : -Math.PI / 2,
      max : Math.PI / 2,
      step : .001,
    };
    this.settings.ui["camRotY"] = {
      data : this.camera.rotation.y,
      min : -Math.PI / 2,
      max : Math.PI / 2,
      step : .001,
    };
    this.settings.ui["camRotZ"] = {
      data : this.camera.rotation.z,
      min : -Math.PI / 2,
      max : Math.PI / 2,
      step : .001,
    };
    this.settings.ui["camPosX"] = {
      data : this.camera.position.x,
      min : -10,
      max : 10,
      step : .001,
    };
    this.settings.ui["camPosY"] = {
      data : this.camera.position.y,
      min : -10,
      max : 10,
      step : .001,
    };
    this.settings.ui["camPosZ"] = {
      data : this.camera.position.z,
      min : -10,
      max : 10,
      step : .001,
    };

    this.gui = new Dat.GUI();
    Dat.GUI.toggleHide();

    const uiSettingsPropNames = Object.getOwnPropertyNames(this.settings.ui);
    for (let uiItemId in uiSettingsPropNames) {
      const uiItemName = uiSettingsPropNames[uiItemId];
      const uiItem = this.settings.ui[uiItemName];
      if (uiItem.hasOwnProperty("type") && uiItem.type == "color") {
        this.gui.addColor(uiItem, "data").name(uiItemName);
      } else {
        this.gui.add(uiItem, "data", uiItem.min, uiItem.max, uiItem.step)
            .name(uiItemName)
            .listen();
      }
    }

    this.onResize();
    window.addEventListener('resize', () => { this.onResize(); });
    window.addEventListener('keydown', event => { this.onKey(event); });

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

  onKey(event) {
    const shortcutTableDom = document.querySelector("#shortcutTableDom");
    shortcutTableDom.classList.add("started");

    switch (event.key) {
    case "Escape":
      Dat.GUI.toggleHide();
      break;
    }
  }

  tick() {
    this.camera.rotation.set(this.settings.ui.camRotX.data,
                             this.settings.ui.camRotY.data,
                             this.settings.ui.camRotZ.data);
    this.camera.position.set(this.settings.ui.camPosX.data,
                             this.settings.ui.camPosY.data,
                             this.settings.ui.camPosZ.data);
    this.cameraControl.update(this.clock.getDelta());
    this.settings.ui.camRotX.data = this.camera.rotation.x;
    this.settings.ui.camRotY.data = this.camera.rotation.y;
    this.settings.ui.camRotZ.data = this.camera.rotation.z;
    this.settings.ui.camPosX.data = this.camera.position.x;
    this.settings.ui.camPosY.data = this.camera.position.y;
    this.settings.ui.camPosZ.data = this.camera.position.z;

    this.updateCallback(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.tick.bind(this));
  }

  start() { this.tick(); }
}
