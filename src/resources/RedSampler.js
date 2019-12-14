/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 13:10:39
 *
 */

"use strict";
export default class RedSampler {
	constructor(redGPUContext, option = {}) {
		option = {
			magFilter: option['magFilter'] || "linear",
			minFilter: option['minFilter'] || "linear",
			mipmapFilter: option['mipmapFilter'] || "linear",
			addressModeU: option['addressModeU'] || "repeat",
			addressModeV: option['addressModeV'] || "repeat",
			addressModeW: option['addressModeW'] || "repeat"
		};
		this.GPUSampler = redGPUContext.device.createSampler(option);
		this.string = JSON.stringify(option)
	}
}