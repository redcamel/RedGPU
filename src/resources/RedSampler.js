"use strict";
export default class RedSampler {
	constructor(redGPU) {
		this.GPUSampler = redGPU.device.createSampler({
			magFilter: "nearest",
			minFilter: "nearest",
			mipmapFilter: "nearest",
			addressModeU: "repeat",
			addressModeV: "repeat",
			addressModeW: "repeat"
		});
	}
}