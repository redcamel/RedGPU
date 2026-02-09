import AView from "../../display/view/core/AView";
/**
 * [KO] 화면 상의 2D 픽셀 좌표를 3D 월드 좌표로 변환합니다.
 * [EN] Converts 2D screen pixel coordinates to 3D world coordinates.
 *
 * [KO] View3D의 카메라 및 프로젝션 정보를 바탕으로 3D 공간의 위치를 계산합니다.
 * [EN] Calculates a position in 3D space based on View3D's camera and projection.
 *
 * ### Example
 * ```typescript
 * const worldPos = RedGPU.math.screenToWorld(mouseX, mouseY, view);
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
declare const screenToWorld: (screenX: number, screenY: number, view: AView) => number[];
export default screenToWorld;
