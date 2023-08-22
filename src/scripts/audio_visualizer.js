import {createNoise3D} from "simplex-noise";
import * as Three from "three";
import {Euler, Vector3} from "three";
import MusicUrl from "url:../audio/nmd-pulsar.wav"

import App from "./app.js";
import FragmentShader from "./shaders/frag.glsl";
import VertexShader from "./shaders/vert.glsl";

class MusicPlayer {
  constructor(app) {
    this.audioListener = new Three.AudioListener();
    app.camera.add(this.audioListener);
    this.sound = new Three.Audio(this.audioListener);
    const loader = new Three.AudioLoader();

    window.addEventListener('click', () => {
      loader.load(MusicUrl, buffer => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(.5);
        this.sound.play();
      });
    });

    this.fftSize = 1024;
    this.analyser = new Three.AudioAnalyser(this.sound, this.fftSize);
  }
}

class Model {
  constructor(app, music) {
    this.shader = new Three.ShaderMaterial({
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
        audioData : {
          value : new Three.DataTexture(
              music.analyser.data, music.fftSize / 2, 1,
              (app.renderer.capabilities.isWebGL2) ? Three.RedFormat
                                                   : Three.LuminanceFormat)
        }
      },
      vertexShader : VertexShader,
      fragmentShader : FragmentShader,
    });

    this.geometry = new Three.PlaneGeometry(10, 10, 100, 100);
    const posArrayLen = this.geometry.attributes.position.array.length;
    const numVertices = posArrayLen / 3;
    const noisePerVertex = new Float32Array(numVertices);
    const noise = new createNoise3D();
    for (let i = 0; i < posArrayLen; i += 3) {
      const offset = 0.5;
      const noiseVal =
          noise(this.geometry.attributes.position.array[i] * offset,
                this.geometry.attributes.position.array[i + 1] * offset,
                this.geometry.attributes.position.array[i + 2] * offset);
      noisePerVertex.set([ noiseVal ], i / 3);
    }
    this.geometry.setAttribute("noise",
                               new Three.BufferAttribute(noisePerVertex, 1));

    app.scene.add(new Three.Points(this.geometry, this.shader));
  }
}

export default class AuidoVisualizer {
  constructor(args) {
    args.clearColor = 0x111111;
    args.camera = new Three.PerspectiveCamera(
        63 / 2, window.innerWidth / window.innerHeight, .1, 1000.);
    args.camera.position.copy(new Vector3(0., 0., 20.));
    args.camera.rotation.copy(new Euler(0., 0., 0.));

    const app = new App(args);

    const music = new MusicPlayer(app);
    const model = new Model(app, music);

    app.setUpdateCallback(dT => {
      model.shader.uniforms.time.value = app.clock.getElapsedTime();
      model.shader.uniforms.scroll.value = window.scrollY;
      music.analyser.getFrequencyData();
      model.shader.uniforms.audioData.value.needsUpdate = true;
    });

    app.start();
  }
}
