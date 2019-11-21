"use strict";
import RedBaseObject3D from "../base/RedBaseObject3D.js";

export default class RedMesh extends RedBaseObject3D {
	constructor(redGPU, geometry, material) {
		super(redGPU);
		this.geometry = geometry;
		this.material = material;
	}
}