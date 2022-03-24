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
        rotation : new Euler(0.32, 0.116, 0.173),
        position : new Vector3(-1.176, -2.289, 7.145),
      },
      camera2 : {
        fov : 53.,
        nearZ : .1,
        farZ : 1000.,
        rotation : new Euler(1.116, 0.24, 0.039),
        position : new Vector3(0.221, -4.892, 2.039),
      },
      ui : {},
    };

    const app = new App(args, settings);

    const defaultShader = new Three.ShaderMaterial({
      side : Three.DoubleSide,
      clipping : true,
      fog : true,
      wireframe : true,
      extensions : {
        derivates : "#extensions GL_OES_standard_derivates : enable",
        fragDepth : true,
        drawBuffers : true,
        shaderTextureLOD : true,
      },
      uniforms : {
        time : {type : "f", value : app.clock.getElapsedTime()},
        scroll : {type : "f", value : window.scrollY},
      },
      vertexShader : VertexShader,
      fragmentShader : FragmentShader,
    });
    const geometry = new Three.PlaneGeometry(5, 5, 50, 50);
    const numVertices = geometry.attributes.position.array.length / 3;
    const randomPerVertex = new Float32Array(numVertices);
    for (let i = 0; i < randomPerVertex.length; i++) {
      randomPerVertex.set([ Math.random() ], i);
    }
    geometry.setAttribute("random",
                          new Three.BufferAttribute(randomPerVertex, 1));
    const mesh = new Three.Points(geometry, defaultShader);
    app.scene.add(mesh);

    app.setUpdateCallback(dT => {
      defaultShader.uniforms["time"].value = app.clock.getElapsedTime();
      defaultShader.uniforms["scroll"].value = window.scrollY;
    });

    app.start();
  }
}
