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
    };

    const app = new App(args, settings);

    const geometry = new Three.PlaneGeometry(1, 1, 1, 1);
    const material = new Three.MeshBasicMaterial({color : 0x11ff11});
    const mesh = new Three.Mesh(geometry, material);
    app.scene.add(mesh);

    app.setUpdateCallback(dT => {
      // asdasdasd
      // qweqweqwe
      console.log(dT);
    });

    app.start();
  }
}
