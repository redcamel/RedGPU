/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.29 18:29:5
 *
 */

"use strict";
import RedBaseObject3D from "../base/RedBaseObject3D.js";

export default class RedCamera extends RedBaseObject3D {
	#up = new Float32Array([0, 1, 0]);
	fov = 60;
	nearClipping = 0.1;
	farClipping = 100000;
	constructor(redGPU) {
		super(redGPU)
	}

	lookAt(x, y, z) {
		mat4.lookAt(this.matrix, [this.x, this.y, this.z], [x, y, z], this.#up);
	}
}