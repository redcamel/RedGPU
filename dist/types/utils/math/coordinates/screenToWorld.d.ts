import AView from "../../../display/view/core/AView";
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
declare const screenToWorld: (screenX: number, screenY: number, view: AView) => number[];
export default screenToWorld;
