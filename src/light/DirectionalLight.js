/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.18 16:39:19
 *
 */

"use strict";
import BaseLight from "../base/BaseLight.js";
import Mesh from "../object3D/Mesh.js";
import Sphere from "../primitives/Sphere.js";
import Cylinder from "../primitives/Cylinder.js";

export default class DirectionalLight extends BaseLight {


  constructor(redGPUContext, color = '#ffffff', intensity = 1) {
    super(redGPUContext);
    this.#setDebugMesh(redGPUContext);
    this.color = color;
    this.intensity = intensity;

  }

  #setDebugMesh = (redGPUContext) => {
    let positionMesh = new Mesh(redGPUContext, new Sphere(redGPUContext, 1, 16, 16, 16), this._debugMaterial);
    // positionMesh.primitiveTopology = 'line-strip';
    positionMesh.primitiveTopology = 'line-list';
    this._debugMesh.addChild(positionMesh);
    [-0.7, 0, 0.7].forEach((v, index) => {
      let directionMesh, directionMesh2;
      directionMesh = new Mesh(redGPUContext, new Cylinder(redGPUContext, 0.01, 0.01, index == 1 ? 100000 : 2), this._debugMaterial);
      directionMesh.rotationX = 90;
      directionMesh.x = v;
      directionMesh.z = -1;
      directionMesh2 = new Mesh(redGPUContext, new Cylinder(redGPUContext, 0, 0.25, 0.5), this._debugMaterial);
      directionMesh2.y = 1;
      directionMesh.addChild(directionMesh2);
      this._debugMesh.addChild(directionMesh);
    });
  };
}
