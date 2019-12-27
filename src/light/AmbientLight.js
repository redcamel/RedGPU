/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.27 14:44:15
 *
 */

"use strict";
import BaseLight from "../base/BaseLight.js";

export default class AmbientLight extends BaseLight {
	constructor(redGPUContext, color = '#ffffff', colorAlpha = 1, intensity = 1) {
		super(redGPUContext);

		this.color = color;
		this.colorAlpha = colorAlpha;
		this.intensity = intensity;
	}
}