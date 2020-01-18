/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.18 17:23:53
 *
 */

"use strict";
import BaseLight from "../base/BaseLight.js";
import Mesh from "../object3D/Mesh.js";
import Sphere from "../primitives/Sphere.js";

export default class PointLight extends BaseLight {
	_radius = 1;
	get radius() {return this._radius;}
	set radius(value) {
		this._radius = value;
		this._debugMesh.setScale(value, value, value)
	}
	constructor(redGPUContext, color = '#ffffff', intensity = 1, radius = 1) {
		super(redGPUContext);
		this.color = color;
		this.intensity = intensity;
		this.radius = radius;
		this.#setDebugMesh(redGPUContext)
	}
	#setDebugMesh = (redGPUContext) => {
		let positionMesh = new Mesh(redGPUContext, new Sphere(redGPUContext, 1, 32, 32, 32), this._debugMaterial);
		positionMesh.primitiveTopology = 'line-strip';
		this._debugMesh.addChild(positionMesh);
	}

}