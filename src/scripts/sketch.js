import * as Three from "three";
import {Euler, Vector3} from "three";

import App from "./app.js";
import FragmentShader from "./shaders/fDefault.glsl";
import VertexShader from "./shaders/vDefault.glsl";

export default class Sketch {
  constructor(args) {
    const settings = {
      camera : {
        fov : 75.,
        nearZ : .1,
        farZ : 1000.,
        rotation : new Euler(.0, .0, .0),
        position : new Vector3(.0, .0, 3),
      },
      ui : {
        alpha : {
          value : 1.,
          min : .0,
          max : 1.,
          step : .1,
        }
      },
    };

    const app = new App(args, settings);

    const defaultShader = new Three.ShaderMaterial({
      side : Three.DoubleSide,
      clipping : true,
      fog : true,
      wireframe : true,
      blending : Three.AdditiveBlending,
      extensions : {
        derivates : "#extensions GL_OES_standard_derivates : enable",
        fragDepth : true,
        drawBuffers : false,
        shaderTextureLOD : false,
      },
      uniforms : {
        time : {type : "f", value : app.clock.getElapsedTime()},
        scroll : {type : "f", value : window.scrollY},
        alpha : {type : "f", value : settings.ui.alpha.value},
      },
      vertexShader : VertexShader,
      fragmentShader : FragmentShader,
    });
    const geometry = new Three.PlaneGeometry(1, 1, 10, 10);
    const mesh = new Three.Mesh(geometry, defaultShader);
    app.scene.add(mesh);

    app.setUpdateCallback(dT => {
      defaultShader.uniforms["time"].value = app.clock.getElapsedTime();
      defaultShader.uniforms["scroll"].value = window.scrollY;
      defaultShader.uniforms["alpha"].value = settings.ui.alpha.value;
    });

    app.start();
  }
}
