import SimplexNoise from "simplex-noise";
import * as Three from "three";
import {Euler, Vector3} from "three";

import App from "./app.js";
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
    const geometry = this.initGeometry(40, 10);

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
  }

  initGeometry(size, unit) {
    const length = size / unit;
    const numVertices = length ** 3;
    const position = new Float32Array(numVertices * 3);
    const noise = new Float32Array(numVertices);
    const sampler = new SimplexNoise();
    for (let nX = 0; nX < length; nX++) {
      for (let nY = 0; nY < length; nY++) {
        for (let nZ = 0; nZ < length; nZ++) {
          // XXX fukkin chirst its ugly
          const x = (nX - length / 2) * unit;
          const y = (nY - length / 2) * unit;
          const z = (nZ - length / 2) * unit;
          position.set([ x, y, z ],
                       nX * length ** 2 * 3 + nY * length * 3 + nZ * 3);
          noise[nX * length ** 2 + nY * length + nZ] = sampler.noise3D(x, y, z);
        }
      }
    }
    return new Three.BufferGeometry()
        .setAttribute("position", new Three.BufferAttribute(position, 3))
        .setAttribute("noise", new Three.BufferAttribute(noise, 1));
  }
}
