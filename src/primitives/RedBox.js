/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

"use strict";
import RedBuffer from "../buffer/RedBuffer.js";
import RedGeometry from "../geometry/RedGeometry.js";
import RedInterleaveInfo from "../geometry/RedInterleaveInfo.js";

export default class RedBox {
	constructor(redGPUContext, width = 1, height = 1, depth = 1, wSegments = 1, hSegments = 1, dSegments = 1) {
		let typeKey;
		// 유일키 생성
		typeKey = [this.constructor.name, width, height, depth, wSegments, hSegments, dSegments].join('_');
		if (redGPUContext.state.RedGeometry.has(typeKey)) return redGPUContext.state.RedGeometry.get(typeKey);
		let tData = this.#makeData(redGPUContext, typeKey, width, height, depth, wSegments, hSegments, dSegments);
		this.interleaveBuffer = tData['interleaveBuffer'];
		this.indexBuffer = tData['indexBuffer'];
		this.vertexState = tData['vertexState'];
		redGPUContext.state.RedGeometry.set(typeKey, this);
		console.log(this)
	}

	#makeData = (function () {
		let numberOfVertices;
		let groupStart;
		let buildPlane;
		buildPlane = function (interleaveData, indexData, u, v, w, udir, vdir, width, height, depth, gridX, gridY) {
			let segmentWidth = width / gridX;
			let segmentHeight = height / gridY;
			let widthHalf = width / 2, heightHalf = height / 2;
			let depthHalf = depth / 2;
			let gridX1 = gridX + 1, gridY1 = gridY + 1;
			let vertexCounter = 0;
			let groupCount = 0;
			let ix, iy;
			let vector = [];
			for (iy = 0; iy < gridY1; iy++) {
				let y = iy * segmentHeight - heightHalf;
				for (ix = 0; ix < gridX1; ix++) {
					let x = ix * segmentWidth - widthHalf;
					// set values to correct vector component
					vector[u] = x * udir, vector[v] = y * vdir, vector[w] = depthHalf,
						interleaveData.push(vector.x, vector.y, vector.z), // position
						vector[u] = 0, vector[v] = 0, vector[w] = depth > 0 ? 1 : -1,
						interleaveData.push(vector.x, vector.y, vector.z), // normal
						interleaveData.push(ix / gridX, (iy / gridY)), // texcoord
						vertexCounter += 1; // counters
				}
			}
			// indices
			for (iy = 0; iy < gridY; iy++) {
				for (ix = 0; ix < gridX; ix++) {
					let a = numberOfVertices + ix + gridX1 * iy;
					let b = numberOfVertices + ix + gridX1 * (iy + 1);
					let c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
					let d = numberOfVertices + (ix + 1) + gridX1 * iy;
					indexData.push(a, b, d, b, c, d);
					groupCount += 6;
				}
			}
			groupStart += groupCount;
			numberOfVertices += vertexCounter;
		};
		return function (redGPUContext, typeKey, width, height, depth, wSegments, hSegments, dSegments) {
			////////////////////////////////////////////////////////////////////////////
			// 데이터 생성!
			// buffers Data
			let interleaveData = [];
			let indexData = [];
			numberOfVertices = 0;
			groupStart = 0;
			buildPlane(interleaveData, indexData, 'z', 'y', 'x', -1, -1, depth, height, width, dSegments, hSegments, 0); // px
			buildPlane(interleaveData, indexData, 'z', 'y', 'x', 1, -1, depth, height, -width, dSegments, hSegments, 1); // nx
			buildPlane(interleaveData, indexData, 'x', 'z', 'y', 1, 1, width, depth, height, wSegments, dSegments, 2); // py
			buildPlane(interleaveData, indexData, 'x', 'z', 'y', 1, -1, width, depth, -height, wSegments, dSegments, 3); // ny
			buildPlane(interleaveData, indexData, 'x', 'y', 'z', 1, -1, width, height, depth, wSegments, hSegments, 4); // pz
			buildPlane(interleaveData, indexData, 'x', 'y', 'z', -1, -1, width, height, -depth, wSegments, hSegments, 5); // nz
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