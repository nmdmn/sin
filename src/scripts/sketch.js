import * as Three from "three";
import {Euler, Vector3} from "three";

import App from "./app.js";
import FragmentShader from "./shaders/fDefault.glsl";
import VertexShader from "./shaders/vDefault.glsl";
import * as Utils from "./utils.js";

export default class Sketch {
  constructor(args) {
    const settings = {
      camera : {
        fov : 75.,
        nearZ : .1,
        farZ : 1000.,
        position : new Vector3(0.744, -1.009, 3.122),
        rotation : new Euler(0.32, 0.116, 0.173),
      },
      ui : {},
    };

    const app = new App(args, settings);

    const defaultShader = new Three.ShaderMaterial({
      side : Three.DoubleSide,
      extensions : {
          // derivates : "#extensions GL_OES_standard_derivates : enable",
      },
      uniforms : {
        time : {value : app.clock.getElapsedTime()},
        scroll : {value : window.scrollY},
      },
      vertexShader : VertexShader,
      fragmentShader : FragmentShader,
    });
    const geometry = new Three.PlaneGeometry(5, 5, 50, 50);
    const mesh = new Three.Points(geometry, defaultShader);
    app.scene.add(mesh);

    app.setUpdateCallback(dT => {
      defaultShader.uniforms["time"].value = app.clock.getElapsedTime();
      defaultShader.uniforms["scroll"].value = window.scrollY;
    });

    app.start();
  }
}
