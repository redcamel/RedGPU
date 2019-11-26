/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
 *
 */

"use strict";
import RedBaseObject3D from "../base/RedBaseObject3D.js";
import RedUtil from "../util/RedUtil.js";
import RedGeometry from "../geometry/RedGeometry.js";
import RedBuffer from "../buffer/RedBuffer.js";
import RedInterleaveInfo from "../geometry/RedInterleaveInfo.js";
import RedGridMaterial from "../material/system/RedGridMaterial.js";

export default class RedGrid extends RedBaseObject3D {

	#size = 100;
	#divisions = 100;
	#centerColor = '#cccccc';
	#color = '#666666';
	#redGPU;

	constructor(redGPU, size = 100, divisions = 100, centerColor = '#cccccc', color = '#666666') {
		super(redGPU);
		this.#redGPU = redGPU;
		this.size = size;
		this.divisions = divisions;
		this.centerColor = centerColor;
		this.color = color;
		this.makeGridGeometry();
		this.material = new RedGridMaterial(redGPU);
		this.primitiveTopology = 'line-list'
	}

	makeGridGeometry() {
		let redGPU = this.#redGPU;
		let center, step, halfSize;
		let i, k, tColor;

		let interleaveData = [];
		center = this.divisions / 2;
		step = this.size / this.divisions;
		halfSize = this.size / 2;
		for (i = 0, k = -halfSize; i <= this.divisions; i++ , k += step) {
			tColor = i === center ? RedUtil.hexToRGB_ZeroToOne(this.centerColor) : RedUtil.hexToRGB_ZeroToOne(this.color);
			interleaveData.push(
				-halfSize, 0, k, tColor[0], tColor[1], tColor[2], 1,
				halfSize, 0, k, tColor[0], tColor[1], tColor[2], 1,
				k, 0, -halfSize, tColor[0], tColor[1], tColor[2], 1,
				k, 0, halfSize, tColor[0], tColor[1], tColor[2], 1
			);
		}
		if (this.geometry) this.geometry.interleaveBuffer.destroy();
		this.geometry = new RedGeometry(
			redGPU,
			new RedBuffer(
				redGPU,
				'gridInterleaveBuffer_' + this.size + '_' + this.divisions + '_' + this.centerColor + '_' + this.color,
				RedBuffer.TYPE_VERTEX,
				new Float32Array(interleaveData),
				[
					new RedInterleaveInfo('vertexPosition', 'float3'),
					new RedInterleaveInfo('vertexColor', 'float4'),
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