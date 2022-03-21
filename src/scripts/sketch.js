import * as Three from "three";
import {Vector3} from "three";

import App from "./app.js";
import FragmentShader from "./shaders/fDefault.glsl";
import VertexShader from "./shaders/vDefault.glsl";

export default class Sketch {
  constructor(args) {
    const settings = {
      camera : {
        fov : 75,
        nearZ : 0.1,
        farZ : 1000,
        position : new Vector3(0, 0, 3),
      },
      ui : {
        planeColorRed : {
          planeColorRed : 0,
          min : 0,
          max : 255,
          step : 1,
        },
        planeColorGreen : {
          planeColorGreen : 255,
          min : 0,
          max : 255,
          step : 1,
        },
        planeColorBlue : {
          planeColorBlue : 0,
          min : 0,
          max : 255,
          step : 1,
        },
      },
    };

    const app = new App(args, settings);

    const geometry = new Three.PlaneGeometry(1, 1, 1, 1);
    const material = new Three.MeshBasicMaterial({
      color : new Three.Color(`rgb(${settings.ui.planeColorRed.planeColorRed},${
          settings.ui.planeColorGreen.planeColorGreen},${
          settings.ui.planeColorBlue.planeColorBlue})`)
    });
    const mesh = new Three.Mesh(geometry, material);
    app.scene.add(mesh);

    app.setUpdateCallback(dT => {
      mesh.material = new Three.MeshBasicMaterial({
        color :
            new Three.Color(`rgb(${settings.ui.planeColorRed.planeColorRed},${
                settings.ui.planeColorGreen.planeColorGreen},${
                settings.ui.planeColorBlue.planeColorBlue})`)
      });
      // asdasdasd
      // qweqweqwe
      // console.log(dT);
    });

    app.start();
  }
}
