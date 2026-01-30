import {mat4} from "gl-matrix";
import View3D from "../../display/view/View3D";
import consoleAndThrowError from "../../utils/consoleAndThrowError";

const resultMTX = mat4.create();
const resultPosition = {x: 0, y: 0, z: 0, w: 0};
/**
 * [KO] 3D 모델 행렬을 이용해 화면 상의 2D 픽셀 좌표를 계산합니다.
 * [EN] Calculates 2D screen pixel coordinates from a 3D model matrix.
 *
 * [KO] View3D의 카메라 및 프로젝션 정보를 바탕으로 화면 좌표로 변환합니다.
 * [EN] Converts to screen coordinates based on View3D's camera and projection.
 *
 * * ### Example
 * ```typescript
 * const [px, py] = RedGPU.Util.getScreenPoint(view, mesh.modelMatrix);
 * ```
 *
 * @param view -
 * [KO] 변환에 사용할 View3D 인스턴스
 * [EN] View3D instance to use for conversion
 * @param targetMatrix -
 * [KO] 변환할 대상의 모델 행렬
 * [EN] Model matrix of the target to convert
 * @returns
 * [KO] 변환된 화면 픽셀 좌표 [x, y]
 * [EN] Converted screen pixel coordinates [x, y]
 * @throws
 * [KO] view가 View3D 인스턴스가 아니면 Error 발생
 * [EN] Throws Error if view is not a View3D instance
 * @category Coordinates
 */
const getScreenPoint = (view: View3D, targetMatrix: mat4): [number, number] => {
    if (!(view?.constructor?.name === 'View3D')) consoleAndThrowError('allow only View3D instance')
    mat4.identity(resultMTX);
    const {noneJitterProjectionMatrix, rawCamera, pixelRectArray} = view;
    mat4.multiply(resultMTX, noneJitterProjectionMatrix, rawCamera.modelMatrix);
    mat4.multiply(resultMTX, resultMTX, targetMatrix);
    resultPosition.z = resultMTX[14];
    resultPosition.w = resultMTX[15];
    resultPosition.x = resultMTX[12] * 0.5 / resultPosition.w + 0.5;
    resultPosition.y = resultMTX[13] * 0.5 / resultPosition.w + 0.5;
    return [
        (pixelRectArray[0] + resultPosition.x * pixelRectArray[2]) / window.devicePixelRatio,
        (pixelRectArray[1] + (1 - resultPosition.y) * pixelRectArray[3]) / window.devicePixelRatio
    ]
}
export default getScreenPoint