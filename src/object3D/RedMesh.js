/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 10:30:31
 *
 */

"use strict";
import RedBaseObject3D from "../base/RedBaseObject3D.js";

export default class RedMesh extends RedBaseObject3D {
	constructor(redGPU, geometry, material) {
		super(redGPU);
		this.geometry = geometry;
		this.material = material;
	}
}