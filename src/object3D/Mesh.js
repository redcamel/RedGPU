/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:28
 *
 */

"use strict";
import BaseObject3D from "../base/BaseObject3D.js";

export default class Mesh extends BaseObject3D {
	constructor(redGPUContext, geometry, material) {
		super(redGPUContext);
		this.geometry = geometry;
		this.material = material;
	}
}