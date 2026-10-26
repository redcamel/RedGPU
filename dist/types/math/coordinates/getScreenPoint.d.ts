import { mat4 } from "gl-matrix";
import View3D from "../../display/view/View3D";
/**
 * [KO] 대상의 4x4 월드 모델 행렬과 `View3D`의 카메라·투영 행렬을 사용하여 CSS 픽셀 단위의 2D 화면 좌표(`[x, y]`)를 계산합니다.
 * [EN] Calculates 2D screen coordinates (`[x, y]`) in CSS pixels using the target's 4x4 world model matrix and `View3D`'s camera and projection matrices.
 *
 * ### Example
 * ```typescript
 * const [screenX, screenY] = RedGPU.Math.getScreenPoint(view, mesh.modelMatrix);
 * ```
 *
 * @param view -
 * [KO] 투영 및 뷰포트 정보를 제공하는 `View3D` 인스턴스
 * [EN] `View3D` instance providing projection and viewport information
 * @param targetMatrix -
 * [KO] 변환할 대상의 4x4 모델 행렬 (`mat4`, 열 우선)
 * [EN] 4x4 model matrix of the target to transform (`mat4`, column-major)
 * @returns
 * [KO] 변환된 2D 화면 좌표 튜플 (`[x, y]`, CSS 픽셀 단위)
 * [EN] Transformed 2D screen coordinate tuple (`[x, y]`, in CSS pixels)
 * @throws
 * [KO] `view`가 `View3D` 인스턴스가 아닐 경우 에러 발생
 * [EN] Throws an error if `view` is not a `View3D` instance
 * @category Math
 */
declare const getScreenPoint: (view: View3D, targetMatrix: mat4) => [number, number];
export default getScreenPoint;
