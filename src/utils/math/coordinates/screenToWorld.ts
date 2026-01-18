import {mat4, vec3} from "gl-matrix";
import AView from "../../../display/view/core/AView";

let x, y, z, w;
let invW;
let point = vec3.create();
let pointMTX = mat4.create();
let invViewProjection = mat4.create();
let resultMTX;
/**
 * [KO] 화면 상의 2D 픽셀 좌표를 3D 월드 좌표로 변환합니다.
 * [EN] Converts 2D screen pixel coordinates to 3D world coordinates.
 *
 * [KO] View3D의 카메라 및 프로젝션 정보를 바탕으로 3D 공간의 위치를 계산합니다.
 * [EN] Calculates a position in 3D space based on View3D's camera and projection.
 *
 * * ### Example
 * ```typescript
 * const worldPos = screenToWorld(mouseX, mouseY, view);
 * ```
 *
 * @param screenX -
 * [KO] 화면 X 좌표 (픽셀)
 * [EN] Screen X coordinate (pixels)
 * @param screenY -
 * [KO] 화면 Y 좌표 (픽셀)
 * [EN] Screen Y coordinate (pixels)
 * @param view -
 * [KO] 변환에 사용할 AView 인스턴스
 * [EN] AView instance to use for conversion
 * @returns
 * [KO] 변환된 3D 월드 좌표 [x, y, z]
 * [EN] Converted 3D world coordinates [x, y, z]
 * @category Coordinates
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