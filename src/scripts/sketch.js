import * as Three from "three";
import {Vector3} from "three";

import App from "./app.js";
import FragmentShader from "./shaders/fDefault.glsl";
import VertexShader from "./shaders/vDefault.glsl";
import * as Utils from "./utils.js";

export default class Sketch {
  constructor(args) {
    const settings = {
      camera : {
        fov : 75,
        nearZ : .1,
        farZ : 1000,
        position : new Vector3(0, 0, 3),
      },
      ui : {
        planePositionX : {
          data : .0,
          min : .0,
          max : 1.,
          step : .1,
        },
        planePositionY : {
          data : .0,
          min : .0,
          max : 1.,
          step : .1,
        },
        planePositionZ : {
          data : .0,
          min : .0,
          max : 1.,
          step : .1,
        },
        planeColor : {
          type : "color",
          data : 0x11ff11,
        },
      },
    };

    const app = new App(args, settings);

    const geometry = new Three.PlaneGeometry(1, 1, 1, 1);
    const material = new Three.MeshBasicMaterial(
        {color : new Three.Color(settings.ui.planeColor.data)});
    const mesh = new Three.Mesh(geometry, material);
    mesh.position.set(settings.ui.planePositionX.data,
                      settings.ui.planePositionY.data,
                      settings.ui.planePositionZ.data);
    app.scene.add(mesh);

    app.setUpdateCallback(dT => {
      mesh.material = new Three.MeshBasicMaterial(
          {color : new Three.Color(settings.ui.planeColor.data)});

      mesh.position.set(settings.ui.planePositionX.data,
                        settings.ui.planePositionY.data,
                        settings.ui.planePositionZ.data);
    });

    app.start();
  }
}
