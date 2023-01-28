import {createNoise3D} from "simplex-noise";
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
      camera3 : {
        fov : 68.,
        nearZ : .1,
        farZ : 1000.,
        rotation : new Euler(0., 0., 0.),
        position : new Vector3(-.5, 0., 5.6),
      },
      ui : {},
    };

    const app = new App(args, settings);

    const defaultShader = new Three.ShaderMaterial({
      side : Three.DoubleSide,
      clipping : true,
      fog : true,
      wireframe : true,
      transparent : true,
      depthTest : false,
      depthWrite : false,
      blending : Three.AdditiveBlending,
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
    const geometry = new Three.PlaneGeometry(7, 7, 140, 140);
    // XXX clearup this shit, ugly
    const posArrayLen = geometry.attributes.position.array.length;
    const numVertices = posArrayLen / 3;
    const noisePerVertex = new Float32Array(numVertices);
    const noise = new createNoise3D();
    noise.perlin_octaves = 8;
    for (let i = 0; i < posArrayLen; i += 3) {
      const offset = 0.5;
      const noiseVal =
          noise(geometry.attributes.position.array[i] * offset,
                geometry.attributes.position.array[i + 1] * offset,
                geometry.attributes.position.array[i + 2] * offset);
      noisePerVertex.set([ noiseVal ], i / 3);
    }

    geometry.setAttribute("noise",
                          new Three.BufferAttribute(noisePerVertex, 1));
    const mesh = new Three.Points(geometry, defaultShader);
    app.scene.add(mesh);

    app.setUpdateCallback(dT => {
      defaultShader.uniforms["time"].value = app.clock.getElapsedTime();
      defaultShader.uniforms["scroll"].value = window.scrollY;
    });

    app.start();
  }
}
