/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.25 17:24:20
 *
 */

"use strict";
import UUID from "../base/UUID.js";

export default class baseGeometry extends UUID {
	#volume;
	get volume() {
		if (!this.#volume) this.volumeCalculate();
		return this.#volume;
	}
	constructor() {
		super();
	}
	volumeCalculate() {
		console.time('volumeCalculate');
		var minX, minY, minZ, maxX, maxY, maxZ, t0, t1, t2, t, i, len;
		var stride = this.interleaveBuffer['stride'];
		// if (!volume[this]) {
		minX = minY = minZ = maxX = maxY = maxZ = 0;
		t = this.interleaveBuffer['data'];
		i = 0;
		len = this.interleaveBuffer['vertexCount'];
		for (i; i < len; i++) {
			t0 = i * stride , t1 = t0 + 1, t2 = t0 + 2,
				minX = t[t0] < minX ? t[t0] : minX,
				maxX = t[t0] > maxX ? t[t0] : maxX,
				minY = t[t1] < minY ? t[t1] : minY,
				maxY = t[t1] > maxY ? t[t1] : maxY,
				minZ = t[t2] < minZ ? t[t2] : minZ,
				maxZ = t[t2] > maxZ ? t[t2] : maxZ;
		}
		this.#volume = {};
		this.#volume.volume = [maxX - minX, maxY - minY, maxZ - minZ];
		this.#volume.minX = minX
		this.#volume.maxX = maxX
		this.#volume.minY = minY
		this.#volume.maxY = maxY
		this.#volume.minZ = minZ
		this.#volume.maxZ = maxZ
		this.#volume.radius = Math.hypot(...this.#volume.volume) / 2
		// }
		console.timeEnd('volumeCalculate');
		return this.#volume;
	}
}