import AView from "../../display/view/core/AView";
/**
 * [KO] 화면의 2D 픽셀 좌표(`screenX`, `screenY`)를 뷰(`AView`)의 역 투영-뷰 행렬을 통해 3D 월드 좌표(`[x, y, z]`)로 변환합니다.
 * [EN] Converts 2D screen pixel coordinates (`screenX`, `screenY`) into 3D world coordinates (`[x, y, z]`) using the inverse view-projection matrix of the view (`AView`).
 *
 * ### Example
 * ```typescript
 * const [worldX, worldY, worldZ] = RedGPU.Math.screenToWorld(mouseX, mouseY, view);
 * ```
 *
 * @param screenX -
 * [KO] 화면 X 좌표 (CSS 픽셀 단위)
 * [EN] Screen X coordinate (in CSS pixels)
 * @param screenY -
 * [KO] 화면 Y 좌표 (CSS 픽셀 단위)
 * [EN] Screen Y coordinate (in CSS pixels)
 * @param view -
 * [KO] 변환 기준이 되는 `AView` 인스턴스
 * [EN] Target `AView` instance for transformation
 * @returns
 * [KO] 변환된 3D 월드 좌표 배열 (`[x, y, z]`)
 * [EN] Transformed 3D world coordinate array (`[x, y, z]`)
 * @see [Screen to World example](/RedGPU/examples/3d/coordinateTransformation/screenToWorld/)
 * @category Math
 */
declare const screenToWorld: (screenX: number, screenY: number, view: AView) => number[];
export default screenToWorld;
