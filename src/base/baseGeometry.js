/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */

"use strict";
import UUID from "../base/UUID.js";

export default class baseGeometry extends UUID {
	_volume;
	get volume() {
		if (!this._volume) this.volumeCalculate();
		return this._volume;
	}
	constructor() {
		super();
	}
	volumeCalculate() {
		// console.time('volumeCalculate');
		let minX, minY, minZ, maxX, maxY, maxZ, t0, t1, t2, t, i, len;
		let stride = this.interleaveBuffer['stride'];
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
		this._volume = {};
		this._volume.volume = [maxX - minX, maxY - minY, maxZ - minZ];
		this._volume.minX = minX;
		this._volume.maxX = maxX;
		this._volume.minY = minY;
		this._volume.maxY = maxY;
		this._volume.minZ = minZ;
		this._volume.maxZ = maxZ;
		this._volume.xSize = Math.max(Math.abs(minX), Math.abs(maxX));
		this._volume.ySize = Math.max(Math.abs(minY), Math.abs(maxY));
		this._volume.zSize = Math.max(Math.abs(minZ), Math.abs(maxZ));
		this._volume.geometryRadius =  Math.max(
			this._volume.xSize,
			this._volume.ySize,
			this._volume.zSize
		);
		// }
		// console.timeEnd('volumeCalculate');
		return this._volume;
	}
}