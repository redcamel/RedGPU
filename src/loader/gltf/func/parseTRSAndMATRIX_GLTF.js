/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.17 20:58:48
 *
 */
"use strict";
import glMatrix from "../../../base/gl-matrix-min.js";
import UTIL from "../../../util/UTIL.js";

var parseTRSAndMATRIX_GLTF = (function () {
	var rotationMTX = glMatrix.mat4.create();
	var tRotation = [0, 0, 0];
	var tQuaternion = [];
	var tScale = [];
	var tMatrix;
	return function (target, info) {
		if ('matrix' in info) {
			// parseMatrix
			tMatrix = info['matrix'];
			UTIL.mat4ToEuler(tMatrix, tRotation);
			target._rotationX = -(tRotation[0] * 180 / Math.PI);
			target._rotationY = -(tRotation[1] * 180 / Math.PI);
			target._rotationZ = -(tRotation[2] * 180 / Math.PI);
			target._x = tMatrix[12];
			target._y = tMatrix[13];
			target._z = tMatrix[14];
			glMatrix.mat4.getScaling(tScale, tMatrix);
			target._scaleX = tScale[0];
			target._scaleY = tScale[1];
			target._scaleZ = tScale[2]
		}
		if ('rotation' in info) {
			// 로데이션은 쿼터니언으로 들어온다.
			tQuaternion = info['rotation'];
			UTIL.quaternionToRotationMat4(tQuaternion, rotationMTX);
			UTIL.mat4ToEuler(rotationMTX, tRotation);
			target._rotationX = -(tRotation[0] * 180 / Math.PI);
			target._rotationY = -(tRotation[1] * 180 / Math.PI);
			target._rotationZ = -(tRotation[2] * 180 / Math.PI)
		}
		if ('translation' in info) {
			// 위치
			target._x = info['translation'][0];
			target._y = info['translation'][1];
			target._z = info['translation'][2];
		}
		if ('scale' in info) {
			// 스케일
			target._scaleX = info['scale'][0];
			target._scaleY = info['scale'][1];
			target._scaleZ = info['scale'][2];
		}
		target.dirtyTransform = true;
	}
})();
export default parseTRSAndMATRIX_GLTF;