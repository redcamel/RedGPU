"use strict";
import RedBaseObject3D from "../base/RedBaseObject3D.js";

export default class RedCamera extends RedBaseObject3D {
	#up = new Float32Array([0, 1, 0]);

	constructor() {
		super()
	}

	lookAt(x, y, z) {
		mat4.lookAt(this.matrix, [this.x, this.y, this.z], [x, y, z], this.#up);
	}
}