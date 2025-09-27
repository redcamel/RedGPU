import {mat4, vec3} from "gl-matrix";
import AView from "../../display/view/core/AView";
import View3D from "../../display/view/View3D";

let x, y, z, w;
let invW;
let point = vec3.create();
let pointMTX = mat4.create();
let invViewProjection = mat4.create();
let resultMTX;
const screenToWorld = (screenX: number, screenY: number, view: AView,) => {
	const {rawCamera, pixelRectArray} = view
	x = 2.0 * (screenX * window.devicePixelRatio + pixelRectArray[0]) / pixelRectArray[2] - 1;
	y = -2.0 * (screenY * window.devicePixelRatio + pixelRectArray[1]) / pixelRectArray[3] + 1;
	z = 1;
	mat4.multiply(invViewProjection, view.noneJitterProjectionMatrix, rawCamera.modelMatrix);
	resultMTX = mat4.clone(invViewProjection);
	mat4.invert(resultMTX, resultMTX);
	point = vec3.fromValues(x, y, z);
	mat4.identity(pointMTX);
	mat4.translate(pointMTX, pointMTX, point);
	mat4.multiply(resultMTX, resultMTX, pointMTX);
	point[0] = resultMTX[12];
	point[1] = resultMTX[13];
	point[2] = resultMTX[14];
	// w = invViewProjection[12] * x + invViewProjection[13] * y + invViewProjection[14] * 0 + invViewProjection[15]; // required for perspective divide
	w = invViewProjection[12] * x + invViewProjection[13] * y + invViewProjection[15]; // required for perspective divide
	if (w !== 0) {
		invW = 1 / w;
		point[0] /= invW;
		point[1] /= invW;
		point[2] /= invW;
		point[0] = point[0] + (rawCamera.x);
		point[1] = point[1] + (rawCamera.y);
		point[2] = point[2] + (rawCamera.z);
	}
	return [point[0], point[1], point[2]]
}
export default screenToWorld
