import * as Three from "three";
import {Euler, Vector3} from "three"
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

import {App} from "./app.js";

export default class Sketch {
  constructor(args) {
    const settings = {
      camera : {
        fov : 63.,
        nearZ : .1,
        farZ : 1000.,
        rotation : new Euler(0., 0., 0.),
        position : new Vector3(0., 0., 250.),
      },
      ui : {
          // alpha : {
          //  value : .33,
          //  min : .0,
          //  max : 1.,
          //  step : .01,
          //}
      },
    };

    const app = new App(args, settings);
    const ambientLight = new Three.AmbientLight(0xcccccc, 0.4);
    app.scene.add(ambientLight);

    const pointLight = new Three.PointLight(0xffffff, 0.8);
    app.camera.add(pointLight);

    new MTLLoader()
        .setPath("../../obj/guitar/")
        .load(
            "guitar.mtl",
            function(materials) {
              materials.preload();

              new OBJLoader().setMaterials(materials).setPath("../../obj/guitar/").load("guitar.obj", function(object) {
                object.position.y = -95;
                app.scene.add(object);
              }, undefined);
            },
            xhr => {
              const percentComplete = xhr.loaded / xhr.total * 100;
              console.warn(Math.round(percentComplete, 2) + "% downloaded");
            });

    app.setUpdateCallback(dT => { const time = app.clock.getElapsedTime(); });

    app.start();
  }
}
