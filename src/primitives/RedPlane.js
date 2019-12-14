/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 16:4:46
 *
 */

"use strict";
import RedBuffer from "../buffer/RedBuffer.js";
import RedGeometry from "../geometry/RedGeometry.js";
import RedInterleaveInfo from "../geometry/RedInterleaveInfo.js";
import RedGPUContext from "../RedGPUContext.js";

export default class RedPlane {
	constructor(redGPUContext, width = 1, height = 1, wSegments = 1, hSegments = 1, flipY = false) {
		let typeKey;
		// 유일키 생성
		typeKey = [this.constructor.name, width, height, wSegments, hSegments].join('_');
		if (redGPUContext.state.RedGeometry.has(typeKey)) return redGPUContext.state.RedGeometry.get(typeKey);
		let tData = this.#makeData(redGPUContext, typeKey, width, height, wSegments, hSegments);
		this.interleaveBuffer = tData['interleaveBuffer'];
		this.indexBuffer = tData['indexBuffer'];
		this.vertexState = tData['vertexState'];
		redGPUContext.state.RedGeometry.set(typeKey, this);
		if (RedGPUContext.useDebugConsole) console.log(this)
	}

	#makeData = (function () {
		let width_half, height_half;
		let gridX, gridY;
		let gridX1, gridY1;
		let segment_width, segment_height;
		let ix, iy;
		let tX, tY;
		let a, b, c, d;
		return function (redGPUContext, typeKey, width, height, wSegments, hSegments, flipY) {
			width_half = width / 2;
			height_half = height / 2;
			gridX = Math.floor(wSegments) || 1;
			gridY = Math.floor(hSegments) || 1;
			gridX1 = gridX + 1;
			gridY1 = gridY + 1;
			segment_width = width / gridX;
			segment_height = height / gridY;
			////////////////////////////////////////////////////////////////////////////
			// 데이터 생성!
			// buffers Datas
			const interleaveData = [];
			const indexData = [];
			// interleaveData
			for (iy = 0; iy < gridY1; iy++) {
				tY = iy * segment_height - height_half;
				for (ix = 0; ix < gridX1; ix++) {
					tX = ix * segment_width - width_half;
					// position, normal, texcoord
					interleaveData.push(tX, -tY, 0, 0, 0, 1, ix / gridX, flipY ? (1 - (iy / gridY)) : (iy / gridY));
				}
			}
			// indexData
			for (iy = 0; iy < gridY; iy++) {
				for (ix = 0; ix < gridX; ix++) {
					a = ix + gridX1 * iy;
					b = ix + gridX1 * (iy + 1);
					c = (ix + 1) + gridX1 * (iy + 1);
					d = (ix + 1) + gridX1 * iy;
					indexData.push(a, b, d, b, c, d)
				}
			}
			////////////////////////////////////////////////////////////////////////////
			return new RedGeometry(
				redGPUContext,
				new RedBuffer(
					redGPUContext,
					`${typeKey}_interleaveBuffer`,
					RedBuffer.TYPE_VERTEX,
					new Float32Array(interleaveData),
					[
						new RedInterleaveInfo('vertexPosition', 'float3'),
						new RedInterleaveInfo('vertexNormal', 'float3'),
						new RedInterleaveInfo('texcoord', 'float2')
					]
				),
				new RedBuffer(
					redGPUContext,
					`${typeKey}_indexBuffer`,
					RedBuffer.TYPE_INDEX,
					new Uint32Array(indexData)
				)
			)
		}
	})();
}