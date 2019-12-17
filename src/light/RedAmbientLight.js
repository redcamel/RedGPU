/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.17 17:0:49
 *
 */

"use strict";
import RedBaseLight from "../base/RedBaseLight.js";

export default class RedAmbientLight extends RedBaseLight {
	constructor(color = '#000', alpha = 0.1, intensity = 1) {
		super();
		this.color = color;
		this.alpha = alpha;
		this.intensity = intensity;
	}
}