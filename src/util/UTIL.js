/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.10 17:50:10
 *
 */

"use strict";
import UTILColor from './func/UTILColor.js';
import UTILMath from './func/UTILMath.js';
import glMatrix from '../base/gl-matrix-min.js';

const screenToWorld = (_ => {
	let z, w;
	let invW;
	let point = [0, 0, 0];
	let pointMTX = glMatrix.mat4.create();
	let invViewProjection = glMatrix.mat4.create();
	let resultMTX;
	let camera;
	return (x, y, view) => {
		x = 2.0 * x / view.viewRect[2] - 1;
		y = -2.0 * y / view.viewRect[3] + 1;
		z = 1;
		camera = view.camera;
		glMatrix.mat4.multiply(invViewProjection, view.projectionMatrix, camera.matrix);
		resultMTX = glMatrix.mat4.clone(invViewProjection);
		glMatrix.mat4.invert(resultMTX, resultMTX);
		point = [x, y, z];
		glMatrix.mat4.identity(pointMTX);
		glMatrix.mat4.translate(pointMTX, pointMTX, point);
		glMatrix.mat4.multiply(resultMTX, resultMTX, pointMTX);

		point[0] = resultMTX[12];
		point[1] = resultMTX[13];
		point[2] = resultMTX[14];
		w = invViewProjection[12] * x + invViewProjection[13] * y + invViewProjection[15]; // required for perspective divide
		if (w !== 0) {
			invW = 1 / w;
			point[0] /= invW;
			point[1] /= invW;
			point[2] /= invW;
			point[0] = point[0] + (camera.x);
			point[1] = point[1] + (camera.y);
			point[2] = point[2] + (camera.z);
		}
		return point
	}
})();
export default {
	throwFunc: function () {
		throw 'Error : ' + Array.prototype.slice.call(arguments).join(' ')
	},
	...UTILColor,
	...UTILMath,
	screenToWorld
}
