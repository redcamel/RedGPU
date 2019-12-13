/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 10:30:31
 *
 */

"use strict";
import RedBaseLight from "../base/RedBaseLight.js";

export default class RedSpotLight extends RedBaseLight {

	constructor(color = '#ffffff', alpha = 1, intensity = 1, cutoff = 0.1, exponent = 2.0) {

		super();
		this.color = color;
		this.alpha = alpha;
		this.intensity = intensity;
		this.cutoff = cutoff;
		this.exponent = exponent;
	}
}