"use strict";
import RedBaseObjectContainer from "../base/RedBaseObjectContainer.js";

export default class RedMesh extends RedBaseObjectContainer {
	constructor(redGPU, geometry, material) {
		super(redGPU);

		this.geometry = geometry;
		this.material = material;
	}
}