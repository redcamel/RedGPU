/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.8 17:1:40
 *
 */

"use strict";
export default class RedSampler {
	constructor(redGPU, option = {}) {
		this.GPUSampler = redGPU.device.createSampler({
			magFilter: "linear",
			minFilter: "linear",
			mipmapFilter: "linear",
			addressModeU: "repeat",
			addressModeV: "repeat",
			addressModeW: "repeat"

		});
	}
}