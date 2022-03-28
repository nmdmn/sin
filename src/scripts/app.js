import * as Dat from "dat.gui";
import * as Three from "three";
import {
  FlyControls,
} from "three/examples/jsm/controls/FlyControls";
import {
  EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
  UnrealBloomPass
} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default class App {
  constructor(args, settings) {
    this.canvas = document.querySelector(args.querySelect);

    this.settings = settings;
    this.settings.display = {
      clearColor : 0x111111,
      aspect : window.innerHeight / window.innerHeight,
    };

    this.scene = new Three.Scene();
    this.renderer = new Three.WebGL1Renderer({canvas : this.canvas});
    this.renderer.setClearColor(this.settings.display.clearColor);
    // this.renderer.antialias = true;
    this.renderer.toneMapping = Three.ReinhardToneMapping;
    this.renderer.stencil = false;
    this.renderer.depth = false;
    this.camera = new Three.PerspectiveCamera(
        this.settings.camera3.fov / 2, this.settings.display.aspect,
        this.settings.camera3.nearZ, this.settings.camera3.farZ);
    this.camera.position.copy(this.settings.camera3.position);
    this.camera.rotation.copy(this.settings.camera3.rotation);
    this.cameraControl = new FlyControls(this.camera, this.canvas);
    this.cameraControl.rollSpeed = .25;

    this.scenePass = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
        new Three.Vector2(window.innerWidth, window.innerHeight), .0, .0, .0);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.scenePass);
    this.composer.addPass(this.bloomPass);

    this.settings.ui["bloomRadius"] = {
      data : .33,
      min : 0,
      max : 1,
      step : 0.01,
    };
    this.settings.ui["bloomStrength"] = {
      data : .29,
      min : 0,
      max : 3,
      step : 0.01,
    };
    this.settings.ui["bloomThreshold"] = {
      data : .23,
      min : 0,
      max : 1,
      step : 0.01,
    };

    this.settings.ui["camFov"] = {
      data : this.camera.fov * 2,
      min : 1,
      max : 179,
      step : 1,
    };
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
    window.addEventListener('resize', () => { this.onResize(); }, false);
    window.addEventListener('keydown', event => { this.onKey(event); });

    this.clock = new Three.Clock();
  }

  setUpdateCallback(updateCallback) { this.updateCallback = updateCallback; }

  onResize() {
    this.camera.aspect = this.settings.display.aspect =
        window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  onKey(event) {
    const shortcutTableDom = document.querySelector("#shortcutTableDom");
    shortcutTableDom.classList.add("hide");

    switch (event.key) {
    case "Escape":
      Dat.GUI.toggleHide();
      break;
    }
  }

  tick() {
    this.camera.fov = this.settings.ui.camFov.data / 2;
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
    this.camera.updateProjectionMatrix();

    this.bloomPass.threshold = this.settings.ui.bloomThreshold.data;
    this.bloomPass.strength = this.settings.ui.bloomStrength.data;
    this.bloomPass.radius = this.settings.ui.bloomRadius.data;

    this.updateCallback(this.clock.getDelta());
    this.composer.render();

    window.requestAnimationFrame(this.tick.bind(this));
  }

  start() { this.tick(); }
}
