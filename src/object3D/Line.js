/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 17:2:44
 *
 */

import BaseObject3D from "../base/BaseObject3D.js";
import Buffer from "../buffer/Buffer.js";
import InterleaveInfo from "../geometry/InterleaveInfo.js";
import Geometry from "../geometry/Geometry.js";
import UTIL from "../util/UTIL.js";
import UUID from "../base/UUID.js";
import LineMaterial from "../material/system/LineMaterial.js";

let solveCatmullRomPoint;
let getPointsOnBezierCurves;
let serializePoints;
let parsePointsByType;
let setDebugMeshs, destroyDebugMesh;
let simplifyPoints;
let vec2_distanceToSegmentSq;
vec2_distanceToSegmentSq = function (p, v, w) {
	let l2 = vec2.sqrDist(v, w);
	if (l2 === 0) return vec2.sqrDist(p, v);
	let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
	t = Math.max(0, Math.min(1, t));
	return vec2.sqrDist(p, vec2.lerp([0, 0], v, w, t));
};
simplifyPoints = function (points, start, end, epsilon, newPoints) {
	let outPoints = newPoints || [];
	// find the most distant point from the line formed by the endpoints
	let s = points[start];
	let e = points[end - 1];
	let maxDistSq = 0;
	let maxNdx = 1;
	let i = start + 1;
	for (i; i < end - 1; ++i) {
		let distSq = vec2_distanceToSegmentSq(points[i], s, e);
		if (distSq > maxDistSq) {
			maxDistSq = distSq;
			maxNdx = i;
		}
	}
	// if that point is too far
	if (Math.sqrt(maxDistSq) > epsilon) {
		// split
		simplifyPoints(points, start, maxNdx + 1, epsilon, outPoints);
		simplifyPoints(points, maxNdx, end, epsilon, outPoints);
	} else outPoints.push(s, e);// add the 2 end points
	return outPoints;
};
solveCatmullRomPoint = function (points, tension) {
	if (tension == null) tension = 1;
	let size = points.length;
	let last = size - 2;
	let i = 0;
	let p0, p1, p2, p3;
	for (i; i < size - 1; i++) {
		// 이전 포인트를 구함
		p0 = i ? points[i - 1]['point'] : points[i]['point'];
		// 현재 포인트를 구함
		p1 = points[i]['point'];
		// 다음 포인트를 구함
		p2 = points[i + 1]['point'];
		// 다다음 포인트를 구함
		p3 = i === last ? p2 : points[i + 2]['point'];

		points[i]['outPoint'][0] = p1[0] + (p2[0] - p0[0]) / 6 * tension;
		points[i]['outPoint'][1] = p1[1] + (p2[1] - p0[1]) / 6 * tension;
		points[i]['outPoint'][2] = p1[2] + (p2[2] - p0[2]) / 6 * tension;

		points[i + 1]['inPoint'][0] = p2[0] - (p3[0] - p1[0]) / 6 * tension;
		points[i + 1]['inPoint'][1] = p2[1] - (p3[1] - p1[1]) / 6 * tension;
		points[i + 1]['inPoint'][2] = p2[2] - (p3[2] - p1[2]) / 6 * tension;
	}
	return points;
};
serializePoints = function (points) {
	let newPointList = [];
	let i, len;
	let index = 0;
	let targetPoint;
	i = 0;
	len = points.length;
	for (i; i < len; i++) {
		targetPoint = points[i];

		if (index === 0) {
			newPointList[index++] = targetPoint['point'];
			newPointList[index++] = targetPoint['outPoint']
			//
		} else {
			newPointList[index++] = targetPoint['inPoint'];
			newPointList[index++] = targetPoint['point'];
			if (points[i + 1]) newPointList[index++] = targetPoint['outPoint']
		}
	}
	return newPointList;
};
getPointsOnBezierCurves = (function () {
	let flatness;
	let getPointsOnBezierCurveWithSplitting;
	flatness = function (points, offset) {
		let p1 = points[offset + 0];
		let c1 = points[offset + 1];
		let c2 = points[offset + 2];
		let p4 = points[offset + 3];
		let ux = 3 * c1[0] - 2 * p1[0] - p4[0];
		let uy = 3 * c1[1] - 2 * p1[1] - p4[1];
		let vx = 3 * c2[0] - 2 * p4[0] - p1[0];
		let vy = 3 * c2[1] - 2 * p4[1] - p1[1];
		ux *= ux, uy *= uy, vx *= vx, vy *= vy;
		if (ux < vx) ux = vx;
		if (uy < vy) uy = vy;
		return ux + uy;
	};
	getPointsOnBezierCurveWithSplitting = function (points, offset, tolerance, newPoints) {
		let outPoints = newPoints || [];
		if (flatness(points, offset) < tolerance) outPoints.push(points[offset + 0], points[offset + 3]);
		else {
			// subdivide
			let t = .5;
			let p1 = points[offset + 0];
			let c1 = points[offset + 1];
			let c2 = points[offset + 2];
			let p2 = points[offset + 3];/**/
			let q1 = vec3.lerp([0, 0], p1, c1, t);
			let q2 = vec3.lerp([0, 0], c1, c2, t);
			let q3 = vec3.lerp([0, 0], c2, p2, t);/**/
			let r1 = vec3.lerp([0, 0], q1, q2, t);
			let r2 = vec3.lerp([0, 0], q2, q3, t);/**/
			let red = vec3.lerp([0, 0], r1, r2, t);
			red.colorRGBA = p1.colorRGBA;
			// do 1st half
			getPointsOnBezierCurveWithSplitting([p1, q1, r1, red], 0, tolerance, outPoints);
			// do 2nd half
			getPointsOnBezierCurveWithSplitting([red, r2, q3, p2], 0, tolerance, outPoints);
		}
		return outPoints;
	};
	return function (points, tolerance) {
		let newPoints = [];
		let numSegments = (points.length - 1) / 3;
		numSegments = Math.floor(numSegments);
		let i = 0;
		let offset;
		for (i; i < numSegments; ++i) {
			offset = i * 3;
			getPointsOnBezierCurveWithSplitting(points, offset, tolerance, newPoints);
		}
		return newPoints;
	}
})();
destroyDebugMesh = function (target) {
	//TODO
};
setDebugMeshs = function (target) {
	//TODO
};
parsePointsByType = function (target, originalPoints, tension, tolerance, distance) {
	// 타입별로 파서 분기
	target['_interleaveData'].length = 0;
	let newPointList;
	let i, len;
	let tData;
	switch (target.type) {
		case Line['CATMULL_ROM'] :
		case Line['BEZIER'] :
			if (originalPoints.length > 1) {
				target['_serializedPoints'] = serializePoints(Line['CATMULL_ROM'] === target.type ? solveCatmullRomPoint(originalPoints, tension) : originalPoints);
				newPointList = getPointsOnBezierCurves(target['_serializedPoints'], tolerance);
				newPointList = simplifyPoints(newPointList, 0, newPointList.length, distance);
				i = 0;
				len = newPointList.length;
				for (i; i < len; i++) {
					tData = newPointList[i];
					target['_interleaveData'].push(tData[0], tData[1], tData[2], ...tData.colorRGBA)
				}
			} else target['_interleaveData'].push(0, 0, 0, ...UTIL.hexToRGB_ZeroToOne(target.color));
			break;
		default :
			i = 0;
			len = originalPoints.length;
			for (i; i < len; i++) {
				tData = originalPoints[i].point;
				target['_interleaveData'].push(tData[0], tData[1], tData[2], ...tData.colorRGBA);
			}
	}
	if (target['debug']) setDebugMeshs(target);
	// target['_indexData'].push(tIndex);
	target['_upload']();
};

class LinePoint {
	constructor(x = 0, y = 0, z = 0, inX = 0, inY = 0, inZ = 0, outX = 0, outY = 0, outZ = 0, color, colorAlpha) {
		let t0 = [...UTIL.hexToRGB_ZeroToOne(color), colorAlpha];
		this.inPoint = [inX, inY, inZ];
		this.inPoint.colorRGBA = t0;
		this.point = [x, y, z];
		this.point.colorRGBA = t0;
		this.outPoint = [outX, outY, outZ];
		this.outPoint.colorRGBA = t0;
	}
}

export default class Line extends BaseObject3D {
	static LINEAR = 'linear';
	static CATMULL_ROM = 'catmullRom';
	static BEZIER = 'bezier';
	#type;
	#tension;
	#distance;
	#tolerance;
	#originalPoints = [];
	get type() {return this.#type;}
	set type(v) {
		if (!(v === Line.LINEAR || v === Line.CATMULL_ROM || v === Line.BEZIER)) UTIL.throwFunc('Line : 허용하지 않는 타입', '입력값 : ' + v);
		this.#type = v;
		parsePointsByType(this, this.#originalPoints, this.#tension, this.#tolerance, this.#distance);
	}
	get tension() {return this.#tension;}
	set tension(v) {
		this.#tension = v;
		parsePointsByType(this, this.#originalPoints, this.#tension, this.#tolerance, this.#distance)
	}
	get distance() {return this.#distance;}
	set distance(v) {
		this.#distance = v;
		parsePointsByType(this, this.#originalPoints, this.#tension, this.#tolerance, this.#distance)
	}
	constructor(redGPUContext, baseColor = '#ff0000', type = Line.LINEAR) {
		super(redGPUContext);
		this.redGPUContext = redGPUContext;
		this._interleaveData = [0, 0, 0];
		this.primitiveTopology = 'line-strip';
		this['_serializedPoints'] = []; //직렬화된 포인트
		this.#tension = 1;
		this.#tolerance = 0.01;
		this.#distance = 0.1;
		this.color = baseColor;
		this.#type = type;
		this['_debug'] = false;
		this.material = new LineMaterial(this.redGPUContext);
		this.dirtyPipeline = false
	}
	addPoint(x = 0, y = 0, z = 0, color, colorAlpha = 1, inX = 0, inY = 0, inZ = 0, outX = 0, outY = 0, outZ = 0) {
		typeof x == 'number' || UTIL.throwFunc('Line : addPoint - x값은 숫자만 허용', '입력값 : ' + x);
		typeof y == 'number' || UTIL.throwFunc('Line : addPoint - y값은 숫자만 허용', '입력값 : ' + y);
		typeof z == 'number' || UTIL.throwFunc('Line : addPoint - z값은 숫자만 허용', '입력값 : ' + z);
		typeof inX == 'number' || UTIL.throwFunc('Line : addPoint - inX값은 숫자만 허용', '입력값 : ' + inX);
		typeof inY == 'number' || UTIL.throwFunc('Line : addPoint - inY값은 숫자만 허용', '입력값 : ' + inY);
		typeof inZ == 'number' || UTIL.throwFunc('Line : addPoint - inZ값은 숫자만 허용', '입력값 : ' + inZ);
		typeof outX == 'number' || UTIL.throwFunc('Line : addPoint - outX값은 숫자만 허용', '입력값 : ' + outX);
		typeof outY == 'number' || UTIL.throwFunc('Line : addPoint - outY값은 숫자만 허용', '입력값 : ' + outY);
		typeof outZ == 'number' || UTIL.throwFunc('Line : addPoint - outZ값은 숫자만 허용', '입력값 : ' + outZ);
		this.#originalPoints.push(new LinePoint(x, y, z, inX, inY, inZ, outX, outY, outZ, color || this.color, colorAlpha));
		parsePointsByType(this, this.#originalPoints, this.#tension, this.#tolerance, this.#distance);
	}
	addPointAt(index, x = 0, y = 0, z = 0, color, colorAlpha = 1, inX = 0, inY = 0, inZ = 0, outX = 0, outY = 0, outZ = 0) {
		typeof x == 'number' || UTIL.throwFunc('Line : addPoint - x값은 숫자만 허용', '입력값 : ' + x);
		typeof y == 'number' || UTIL.throwFunc('Line : addPoint - y값은 숫자만 허용', '입력값 : ' + y);
		typeof z == 'number' || UTIL.throwFunc('Line : addPoint - z값은 숫자만 허용', '입력값 : ' + z);
		typeof inX == 'number' || UTIL.throwFunc('Line : addPoint - inX값은 숫자만 허용', '입력값 : ' + inX);
		typeof inY == 'number' || UTIL.throwFunc('Line : addPoint - inY값은 숫자만 허용', '입력값 : ' + inY);
		typeof inZ == 'number' || UTIL.throwFunc('Line : addPoint - inZ값은 숫자만 허용', '입력값 : ' + inZ);
		typeof outX == 'number' || UTIL.throwFunc('Line : addPoint - outX값은 숫자만 허용', '입력값 : ' + outX);
		typeof outY == 'number' || UTIL.throwFunc('Line : addPoint - outY값은 숫자만 허용', '입력값 : ' + outY);
		typeof outZ == 'number' || UTIL.throwFunc('Line : addPoint - outZ값은 숫자만 허용', '입력값 : ' + outZ);
		typeof index == 'number' || UTIL.throwFunc('addPointAt', 'index는 숫자만 입력가능', '입력값 : ' + index);
		if (this.#originalPoints.length < index) index = this.#originalPoints.length;
		if (index != undefined) this.#originalPoints.splice(index, 0, new LinePoint(x, y, z, inX, inY, inZ, outX, outY, outZ, color || this.color, colorAlpha));
		else this.#originalPoints.push(new LinePoint(x, y, z, inX, inY, inZ, outX, outY, outZ, color || this.color, colorAlpha));
		parsePointsByType(this, this.#originalPoints, this.#tension, this.#tolerance, this.#distance);
	}
	removePointAt(index) {
		if (typeof index != 'number') UTIL.throwFunc('removeChildAt', 'index가 Number형이 아님 ', '입력값 : ' + index);
		if (this.#originalPoints[index]) this.#originalPoints.splice(index, 1);
		else UTIL.throwFunc('removeChildAt', 'index 해당인덱스에 위치한 포인트가 없음.', '입력값 : ' + index);
		parsePointsByType(this, this.#originalPoints, this.#tension, this.#tolerance, this.#distance);
	};
	removeAllPoint() {
		this.#originalPoints.length = 0;
		parsePointsByType(this, this.#originalPoints, this.#tension, this.#tolerance, this.#distance);
		this['_upload']();
	};
	_upload() {
		this._UUID = UUID.getNextUUID();
		if (this.#originalPoints.length) {
			this._interleaveBuffer = new Buffer(
				this.redGPUContext,
				'Line_InterleaveBuffer_' + this._UUID,
				Buffer.TYPE_VERTEX,
				new Float32Array(this._interleaveData),
				[
					new InterleaveInfo('vertexPosition', 'float3'),
					new InterleaveInfo('vertexColor', 'float4')
				]
			);
			this.geometry = new Geometry(this.redGPUContext, this._interleaveBuffer)
		} else {
			this._interleaveBuffer = null;
			this.geometry = null
		}
	};
}