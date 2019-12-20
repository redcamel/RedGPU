/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:28
 *
 */

"use strict";
let clamp = function (value, min, max) {
	return Math.max(min, Math.min(max, value));
};
export default {
	clamp: clamp,
	nextHighestPowerOfTwo: (function () {
		var i;
		return function (v) {
			--v;
			for (i = 1; i < 32; i <<= 1) v = v | v >> i;
			return v + 1;
		}
	})(),
	quaternionToRotationMat4: function (q, m) {
		let x = q[0];
		let y = q[1];
		let z = q[2];
		let w = q[3];
		let x2 = x + x, y2 = y + y, z2 = z + z;
		let xx = x * x2, xy = x * y2, xz = x * z2;
		let yy = y * y2, yz = y * z2, zz = z * z2;
		let wx = w * x2, wy = w * y2, wz = w * z2;
		m[0] = 1 - (yy + zz);
		m[4] = xy - wz;
		m[8] = xz + wy;
		m[1] = xy + wz;
		m[5] = 1 - (xx + zz);
		m[9] = yz - wx;
		m[2] = xz - wy;
		m[6] = yz + wx;
		m[10] = 1 - (xx + yy);
		// last column
		m[3] = 0;
		m[7] = 0;
		m[11] = 0;
		// bottom row
		m[12] = 0;
		m[13] = 0;
		m[14] = 0;
		m[15] = 1;
		return m;
	},
	mat4ToEuler: function (mat, dest, order) {
		dest = dest || [0, 0, 0];
		order = order || 'XYZ';
		// Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
		let m11 = mat[0], m12 = mat[4], m13 = mat[8];
		let m21 = mat[1], m22 = mat[5], m23 = mat[9];
		let m31 = mat[2], m32 = mat[6], m33 = mat[10];
		if (order === 'XYZ') {
			dest[1] = Math.asin(clamp(m13, -1, 1));
			if (Math.abs(m13) < 0.99999) {
				dest[0] = Math.atan2(-m23, m33);
				dest[2] = Math.atan2(-m12, m11);
			} else {
				dest[0] = Math.atan2(m32, m22);
				dest[2] = 0;
			}
		} else if (order === 'YXZ') {
			dest[0] = Math.asin(-clamp(m23, -1, 1));
			if (Math.abs(m23) < 0.99999) {
				dest[1] = Math.atan2(m13, m33);
				dest[2] = Math.atan2(m21, m22);
			} else {
				dest[1] = Math.atan2(-m31, m11);
				dest[2] = 0;
			}
		} else if (order === 'ZXY') {
			dest[0] = Math.asin(clamp(m32, -1, 1));
			if (Math.abs(m32) < 0.99999) {
				dest[1] = Math.atan2(-m31, m33);
				dest[2] = Math.atan2(-m12, m22);
			} else {
				dest[1] = 0;
				dest[2] = Math.atan2(m21, m11);
			}
		} else if (order === 'ZYX') {
			dest[1] = Math.asin(-clamp(m31, -1, 1));
			if (Math.abs(m31) < 0.99999) {
				dest[0] = Math.atan2(m32, m33);
				dest[2] = Math.atan2(m21, m11);
			} else {
				dest[0] = 0;
				dest[2] = Math.atan2(-m12, m22);
			}
		} else if (order === 'YZX') {
			dest[2] = Math.asin(clamp(m21, -1, 1));
			if (Math.abs(m21) < 0.99999) {
				dest[0] = Math.atan2(-m23, m22);
				dest[1] = Math.atan2(-m31, m11);
			} else {
				dest[0] = 0;
				dest[1] = Math.atan2(m13, m33);
			}
		} else if (order === 'XZY') {
			dest[2] = Math.asin(-clamp(m12, -1, 1));
			if (Math.abs(m12) < 0.99999) {
				dest[0] = Math.atan2(m32, m22);
				dest[1] = Math.atan2(m13, m11);
			} else {
				dest[0] = Math.atan2(-m23, m33);
				dest[1] = 0;
			}
		}
		return dest;
	},

	calculateNormals: function (vertexArray, indexArray) {
		//TODO: 이함수 정리
		let i, j;
		let x = 0;
		let y = 1;
		let z = 2;
		let result = [];
		for (i = 0; i < vertexArray.length; i = i + 3) {
			//for each vertex, initialize normal x, normal y, normal z
			result[i + x] = 0.0;
			result[i + y] = 0.0;
			result[i + z] = 0.0;
		}
		for (i = 0; i < indexArray.length; i = i + 3) { //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
			let v1 = [];
			let v2 = [];
			let normal = [];
			let index0, index1, index2, indexJ;
			index0 = 3 * indexArray[i];
			index1 = 3 * indexArray[i + 1];
			index2 = 3 * indexArray[i + 2];
			//p2 - p1
			v1[x] = vertexArray[index2 + x] - vertexArray[index1 + x];
			v1[y] = vertexArray[index2 + y] - vertexArray[index1 + y];
			v1[z] = vertexArray[index2 + z] - vertexArray[index1 + z];
			//p0 - p1
			v2[x] = vertexArray[index0 + x] - vertexArray[index1 + x];
			v2[y] = vertexArray[index0 + y] - vertexArray[index1 + y];
			v2[z] = vertexArray[index0 + z] - vertexArray[index1 + z];
			//cross product by Sarrus Rule
			normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
			normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
			normal[z] = v1[x] * v2[y] - v1[y] * v2[x];
			for (j = 0; j < 3; j++) { //update the normals of that triangle: sum of vectors
				indexJ = 3 * indexArray[i + j];
				result[indexJ + x] = result[indexJ + x] + normal[x];
				result[indexJ + y] = result[indexJ + y] + normal[y];
				result[indexJ + z] = result[indexJ + z] + normal[z];
			}
		}
		//normalize the result
		for (i = 0; i < vertexArray.length; i = i + 3) { //the increment here is because each vertex occurs with an offset of 3 in the array (due to x, y, z contiguous values)
			let nn = [];
			nn[x] = result[i + x];
			nn[y] = result[i + y];
			nn[z] = result[i + z];
			let len = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
			if (len === 0) len = 1.0;
			nn[x] = nn[x] / len;
			nn[y] = nn[y] / len;
			nn[z] = nn[z] / len;
			result[i + x] = nn[x];
			result[i + y] = nn[y];
			result[i + z] = nn[z];
		}
		return result;
	}
}
