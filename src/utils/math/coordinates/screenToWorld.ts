import {mat4, vec3} from "gl-matrix";
import AView from "../../../display/view/core/AView";
import View3D from "../../../display/view/View3D";

let x, y, z, w;
let invW;
let point = vec3.create();
let pointMTX = mat4.create();
let invViewProjection = mat4.create();
let resultMTX;
/**
 * 화면 상의 2D 좌표(픽셀 위치)를 3D 월드 좌표로 변환합니다.
 *
 * View3D의 카메라 및 프로젝션 정보를 바탕으로, 주어진 화면 좌표(screenX, screenY)를
 *
 * 3D 월드 좌표([x, y, z])로 변환합니다. 주로 마우스 클릭 위치 등에서 3D 공간의 위치를 얻을 때 사용합니다.
 *
 * @category Coordinates
 * @param {number} screenX 변환할 화면 X 좌표 (픽셀)
 * @param {number} screenY 변환할 화면 Y 좌표 (픽셀)
 * @param {AView} view 변환에 사용할 AView 인스턴스 (View3D 또는 하위 클래스)
 * @returns {[number, number, number]} 변환된 3D 월드 좌표 [x, y, z]
 */
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
