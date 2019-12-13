/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

"use strict";
import RedBaseObject3D from "../base/RedBaseObject3D.js";

export default class RedMesh extends RedBaseObject3D {
	constructor(redGPUContext, geometry, material) {
		super(redGPUContext);
		this.geometry = geometry;
		this.material = material;
	}
}