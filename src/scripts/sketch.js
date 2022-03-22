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
          min : -10.,
          max : 2.,
          step : .1,
        },
      },
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
    mesh.position.set(settings.ui.planePositionX.data,
                      settings.ui.planePositionY.data,
                      settings.ui.planePositionZ.data);
    app.scene.add(mesh);

    app.setUpdateCallback(dT => {
      defaultShader.uniforms["time"].value = app.clock.getElapsedTime();
      defaultShader.uniforms["scroll"].value = window.scrollY;

      mesh.position.set(settings.ui.planePositionX.data,
                        settings.ui.planePositionY.data,
                        settings.ui.planePositionZ.data);
    });

    app.start();
  }
}
