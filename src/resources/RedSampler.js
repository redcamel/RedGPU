"use strict";
export default class RedSampler {
	constructor(redGPU) {
		this.GPUSampler = redGPU.device.createSampler({
			magFilter: "nearest",
			minFilter: "nearest",
			mipmapFilter: "linear",
			addressModeU: "repeat",
			addressModeV: "repeat",
			addressModeW: "repeat"
		});
	}
}