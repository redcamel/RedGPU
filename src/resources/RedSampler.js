/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */

"use strict";
export default class RedSampler {
	constructor(redGPU, option = {}) {
		this.GPUSampler = redGPU.device.createSampler({
			magFilter: option['magFilter'] || "linear",
			minFilter: option['minFilter'] || "linear",
			mipmapFilter: option['mipmapFilter'] || "linear",
			addressModeU: option['addressModeU'] || "clamp-to-edge",
			addressModeV: option['addressModeV'] || "clamp-to-edge",
			addressModeW: option['addressModeW'] || "repeat"
		});
	}
}