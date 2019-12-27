/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.27 14:44:15
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
	constructor(redGPUContext, color = '#ffffff', colorAlpha = 1, intensity = 1, radius = 1) {
		super(redGPUContext);
		this.color = color;
		this.colorAlpha = colorAlpha;
		this.intensity = intensity;
		this.radius = radius;
		this.#setDebugMesh(redGPUContext)
	}
	#setDebugMesh = (redGPUContext) => {
		let positionMesh = new Mesh(redGPUContext, new Sphere(redGPUContext, 0.5, 16, 16, 16), this._debugMaterial);
		positionMesh.primitiveTopology = 'line-strip'
		this._debugMesh.addChild(positionMesh);
	}

}