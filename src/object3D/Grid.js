/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:28
 *
 */

"use strict";
import BaseObject3D from "../base/BaseObject3D.js";
import UTIL from "../util/UTIL.js";
import Geometry from "../geometry/Geometry.js";
import Buffer from "../buffer/Buffer.js";
import InterleaveInfo from "../geometry/InterleaveInfo.js";
import GridMaterial from "../material/system/GridMaterial.js";

export default class Grid extends BaseObject3D {

	#size = 100;
	#divisions = 100;
	#centerColor = '#cccccc';
	#color = '#666666';
	#redGPUContext;

	constructor(redGPUContext, size = 100, divisions = 100, centerColor = '#cccccc', color = '#666666') {
		super(redGPUContext);
		this.#redGPUContext = redGPUContext;
		this.size = size;
		this.divisions = divisions;
		this.centerColor = centerColor;
		this.color = color;
		this.makeGridGeometry();
		this.material = new GridMaterial(redGPUContext);
		this.primitiveTopology = 'line-list'
	}

	makeGridGeometry() {
		let redGPUContext = this.#redGPUContext;
		let center, step, halfSize;
		let i, k, tColor;

		let interleaveData = [];
		center = this.divisions / 2;
		step = this.size / this.divisions;
		halfSize = this.size / 2;
		for (i = 0, k = -halfSize; i <= this.divisions; i++ , k += step) {
			tColor = i === center ? UTIL.hexToRGB_ZeroToOne(this.centerColor) : UTIL.hexToRGB_ZeroToOne(this.color);
			interleaveData.push(
				-halfSize, 0, k, tColor[0], tColor[1], tColor[2], 1,
				halfSize, 0, k, tColor[0], tColor[1], tColor[2], 1,
				k, 0, -halfSize, tColor[0], tColor[1], tColor[2], 1,
				k, 0, halfSize, tColor[0], tColor[1], tColor[2], 1
			);
		}
		this.geometry = new Geometry(
			redGPUContext,
			new Buffer(
				redGPUContext,
				'gridInterleaveBuffer_' + this.size + '_' + this.divisions + '_' + this.centerColor + '_' + this.color,
				Buffer.TYPE_VERTEX,
				new Float32Array(interleaveData),
				[
					new InterleaveInfo('vertexPosition', 'float3'),
					new InterleaveInfo('vertexColor', 'float4'),
				]
			)
		)
	}

	get color() {
		return this.#color;
	}

	set color(value) {
		this.#color = value;
		this.makeGridGeometry()
	}

	get centerColor() {
		return this.#centerColor;
	}

	set centerColor(value) {
		this.#centerColor = value;
		this.makeGridGeometry()
	}

	get divisions() {
		return this.#divisions;
	}

	set divisions(value) {
		this.#divisions = value;
		this.makeGridGeometry()
	}

	get size() {
		return this.#size;
	}

	set size(value) {
		this.#size = value;
		this.makeGridGeometry()
	}

}