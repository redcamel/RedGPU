import {mat4} from "gl-matrix";
import View3D from "../../display/view/View3D";
import consoleAndThrowError from "../consoleAndThrowError";

const resultMTX = mat4.create();
const resultPosition = {x: 0, y: 0, z: 0, w: 0};
const getScreenPoint = (view: View3D, targetMatrix: mat4): [number, number] => {
    if (!(view?.constructor?.name === 'View')) consoleAndThrowError('allow only View3D instance')
    mat4.identity(resultMTX);
    const {projectionMatrix, rawCamera, pixelRectArray} = view;
    mat4.multiply(resultMTX, projectionMatrix, rawCamera.modelMatrix);
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
