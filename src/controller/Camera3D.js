/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */

"use strict";
import BaseObject3D from "../base/BaseObject3D.js";
import glMatrix from "../base/gl-matrix-min.js"

export default class Camera3D extends BaseObject3D {
	#up = new Float32Array([0, 1, 0]);
	fov = 60;
	nearClipping = 0.1;
	farClipping = 100000;
	constructor(redGPUContext) {
		super(redGPUContext)
	}
	get x() {return this._x}
	set x(v) {
		this._x = v;
		this.matrix[12] = v
	}
	get y() {return this._y}
	set y(v) {
		this._y = v;
		this.matrix[13] = v
	}
	get z() {return this._z;}
	set z(v) {
		this._z = v;
		this.matrix[14] = v
	}
	lookAt(x, y, z) {
		glMatrix.mat4.lookAt(this.matrix, [this.x, this.y, this.z], [x, y, z], this.#up);
	}
}
