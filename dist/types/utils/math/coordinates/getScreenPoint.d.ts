import { mat4 } from "gl-matrix";
import View3D from "../../../display/view/View3D";
/**
 * 3D 객체의 변환 행렬을 이용해 화면 상의 2D 좌표(픽셀 위치)를 계산합니다.
 *
 * View3D의 카메라 및 프로젝션 정보를 바탕으로, 주어진 targetMatrix(모델 변환 행렬)를
 *
 * 화면 픽셀 좌표로 변환합니다. 반환값은 [x, y] 형태의 2D 좌표입니다.
 *
 * @category Coordinates
 * @param {View3D} view 변환에 사용할 View3D 인스턴스
 * @param {mat4} targetMatrix 변환할 대상의 모델 행렬
 * @returns {[number, number]} 변환된 화면 픽셀 좌표 [x, y]
 * @throws {Error} view가 View3D 인스턴스가 아니면 예외 발생
 */
declare const getScreenPoint: (view: View3D, targetMatrix: mat4) => [number, number];
export default getScreenPoint;
