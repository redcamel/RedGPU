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
import Cylinder from "../primitives/Cylinder.js";

export default class SpotLight extends BaseLight {
	constructor(redGPUContext, color = '#ffffff', intensity = 1, cutoff = 0.1, exponent = 80.0) {
		super(redGPUContext);
		this.color = color;
		this.intensity = intensity;
		this.cutoff = cutoff;
		this.exponent = exponent;
		this.#setDebugMesh(redGPUContext)
	}
	#setDebugMesh = (redGPUContext) => {
		let positionMesh = new Mesh(redGPUContext, new Cylinder(redGPUContext, 0.0, 1, 2), this._debugMaterial);
		positionMesh.rotationX = -90;
		positionMesh.primitiveTopology = 'line-strip';
		this._debugMesh.addChild(positionMesh);
	}
}