import SimplexNoise from "simplex-noise";
import * as Three from "three";
import {Euler, Vector3} from "three";

import {App, BufferObject} from "./app.js";
import FragmentShader from "./shaders/fDefault.glsl";
import VertexShader from "./shaders/vDefault.glsl";

export default class Sketch {
  constructor(args) {
    const settings = {
      camera : {
        fov : 63.,
        nearZ : .1,
        farZ : 1000.,
        rotation : new Euler(0., 0., 0.),
        position : new Vector3(15., 15., 15.),
      },
      ui : {
        alpha : {
          value : .33,
          min : .0,
          max : 1.,
          step : .01,
        }
      },
    };

    const app = new App(args, settings);
    const shader = this.initShader(app, settings);
    const geometry = this.initGeometry(10, 8);

    const mesh = new Three.Points(geometry, shader);
    app.scene.add(mesh);

    app.setUpdateCallback(dT => {
      shader.uniforms["time"].value = app.clock.getElapsedTime();
      shader.uniforms["scroll"].value = window.scrollY;
      shader.uniforms["alpha"].value = settings.ui.alpha.value;
    });

    app.start();
  }

  initShader(app, settings) {
    return new Three.ShaderMaterial({
      side : Three.DoubleSide,
      clipping : true,
      fog : false,
      wireframe : false,
      blending : Three.AdditiveBlending,
      extensions : {
        derivates : "#extensions GL_OES_standard_derivates : enable",
        fragDepth : true,
        drawBuffers : true,
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
  }

  initGeometry(size, resolution) {
    const unit = size / resolution;
    const numVertices = resolution ** 3; // NOTE its a cube
    const positionVBO = new BufferObject(
        numVertices,
        3); // NOTE 3d positions, hence num of components per vertex is 3
    const noiseVBO =
        new BufferObject(numVertices, 1); // NOTE its a single float normalized
    const sampler = new SimplexNoise();
    for (let nY = 0; nY < resolution; nY++) {
      for (let nZ = 0; nZ < resolution; nZ++) {
        for (let nX = 0; nX < resolution; nX++) {
          const x = nX * unit - size / 2;
          const y = nY * unit - size / 2;
          const z = nZ * unit - size / 2;
          positionVBO.add([ x, y, z ]);
          noiseVBO.add([ sampler.noise3D(x, y, z) ]);
        }
      }
    }
    return new Three.BufferGeometry()
        .setAttribute("position",
                      new Three.BufferAttribute(positionVBO.dataArray,
                                                positionVBO.numComponents))
        .setAttribute("noise", new Three.BufferAttribute(
                                   noiseVBO.dataArray, noiseVBO.numComponents));
  }
}
