import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * [KO] 직교 투영(OrthographicCamera)을 사용하여 고정된 각도의 등각 투영(쿼터뷰) 시점을 제공하는 카메라 컨트롤러 클래스입니다.
 * [EN] Camera controller class that provides a fixed-angle isometric (quarter-view) perspective using orthographic projection (`OrthographicCamera`).
 *
 * ### Example
 * ```typescript
 * const controller = new RedGPU.Camera.IsometricController(redGPUContext);
 * controller.viewHeight = 15;
 * controller.zoom = 1;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:500px;"></iframe>
 * @see [IsometricController example](/RedGPU/examples/3d/controller/isometricController/)
 * @category Controller
 */
declare class IsometricController extends AController {
    #private;
    /**
     * [KO] IsometricController 인스턴스를 생성합니다.
     * [EN] Creates an IsometricController instance.
     *
     * ### Example
     * ```typescript
     * const controller = new RedGPU.Camera.IsometricController(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 목표 줌 배율을 가져오거나 설정합니다. (`minZoom` ~ `maxZoom`)
     * [EN] Gets or sets the target zoom scale. (`minZoom` ~ `maxZoom`)
     *
     * @returns
     * [KO] 목표 줌 배율 (기본값: `1`)
     * [EN] Target zoom scale (default: `1`)
     */
    get zoom(): number;
    set zoom(value: number);
    /**
     * [KO] 줌 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for zoom changes. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 줌 보간 계수 (기본값: `0.02`)
     * [EN] Zoom interpolation factor (default: `0.02`)
     */
    get zoomInterpolation(): number;
    set zoomInterpolation(value: number);
    /**
     * [KO] 마우스 휠 줌 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the mouse wheel zoom speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 줌 속도 (기본값: `0.1`)
     * [EN] Zoom speed (default: `0.1`)
     */
    get speedZoom(): number;
    set speedZoom(value: number);
    /**
     * [KO] 최소 줌 배율을 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the minimum zoom scale. (`0.01` or greater)
     *
     * @returns
     * [KO] 최소 줌 배율 (기본값: `0.5`)
     * [EN] Minimum zoom scale (default: `0.5`)
     */
    get minZoom(): number;
    set minZoom(value: number);
    /**
     * [KO] 최대 줌 배율을 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the maximum zoom scale. (`0.01` or greater)
     *
     * @returns
     * [KO] 최대 줌 배율 (기본값: `3`)
     * [EN] Maximum zoom scale (default: `3`)
     */
    get maxZoom(): number;
    set maxZoom(value: number);
    /**
     * [KO] 직교 투영 뷰의 기준 높이를 가져오거나 설정합니다. (`0.1` 이상)
     * [EN] Gets or sets the base height of the orthographic projection view. (`0.1` or greater)
     *
     * @returns
     * [KO] 뷰 높이 (기본값: `15`)
     * [EN] View height (default: `15`)
     */
    get viewHeight(): number;
    set viewHeight(value: number);
    /**
     * [KO] 뷰 높이 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for view height changes. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 뷰 높이 보간 계수 (기본값: `0.02`)
     * [EN] View height interpolation factor (default: `0.02`)
     */
    get viewHeightInterpolation(): number;
    set viewHeightInterpolation(value: number);
    /**
     * [KO] 키보드 이동 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the keyboard movement speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 이동 속도 (기본값: `20`)
     * [EN] Movement speed (default: `20`)
     */
    get moveSpeed(): number;
    set moveSpeed(value: number);
    /**
     * [KO] 위치 이동의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for position movement. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 이동 보간 계수 (기본값: `0.02`)
     * [EN] Movement interpolation factor (default: `0.02`)
     */
    get moveSpeedInterpolation(): number;
    set moveSpeedInterpolation(value: number);
    /**
     * [KO] 마우스 이동 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the mouse movement speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 마우스 이동 속도 (기본값: `1`)
     * [EN] Mouse movement speed (default: `1`)
     */
    get mouseMoveSpeed(): number;
    set mouseMoveSpeed(value: number);
    /**
     * [KO] 마우스 이동의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for mouse movement. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 마우스 이동 보간 계수 (기본값: `0.02`)
     * [EN] Mouse movement interpolation factor (default: `0.02`)
     */
    get mouseMoveSpeedInterpolation(): number;
    set mouseMoveSpeedInterpolation(value: number);
    /**
     * [KO] 현재 설정된 키보드 키 매핑 객체의 복사본을 반환합니다.
     * [EN] Returns a copy of the currently configured keyboard key mapping object.
     *
     * @returns
     * [KO] 키 매핑 설정 객체
     * [EN] Key mapping configuration object
     */
    get keyNameMapper(): {
        moveUp: string;
        moveDown: string;
        moveLeft: string;
        moveRight: string;
    };
    /**
     * [KO] 카메라가 바라보는 기준점의 현재 X축 좌표를 반환합니다.
     * [EN] Returns the current X-axis coordinate of the target point the camera looks at.
     *
     * @returns
     * [KO] 타겟 X축 좌표
     * [EN] Target X-axis coordinate
     */
    get targetX(): number;
    /**
     * [KO] 카메라가 바라보는 기준점의 현재 Y축 좌표를 반환합니다. (항상 `0`)
     * [EN] Returns the current Y-axis coordinate of the target point the camera looks at. (Always `0`)
     *
     * @returns
     * [KO] 타겟 Y축 좌표 (`0`)
     * [EN] Target Y-axis coordinate (`0`)
     */
    get targetY(): number;
    /**
     * [KO] 카메라가 바라보는 기준점의 현재 Z축 좌표를 반환합니다.
     * [EN] Returns the current Z-axis coordinate of the target point the camera looks at.
     *
     * @returns
     * [KO] 타겟 Z축 좌표
     * [EN] Target Z-axis coordinate
     */
    get targetZ(): number;
    /**
     * [KO] 상향 이동 키를 설정합니다.
     * [EN] Sets the move up key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'w'`)
     * [EN] Key name to assign (e.g., `'w'`)
     */
    setMoveUpKey(value: string): void;
    /**
     * [KO] 하향 이동 키를 설정합니다.
     * [EN] Sets the move down key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'s'`)
     * [EN] Key name to assign (e.g., `'s'`)
     */
    setMoveDownKey(value: string): void;
    /**
     * [KO] 좌측 이동 키를 설정합니다.
     * [EN] Sets the move left key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'a'`)
     * [EN] Key name to assign (e.g., `'a'`)
     */
    setMoveLeftKey(value: string): void;
    /**
     * [KO] 우측 이동 키를 설정합니다.
     * [EN] Sets the move right key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'d'`)
     * [EN] Key name to assign (e.g., `'d'`)
     */
    setMoveRightKey(value: string): void;
    /**
     * [KO] 매 프레임 등각 투영 카메라의 상태를 갱신합니다.
     * [EN] Updates the isometric camera state every frame.
     *
     * @param view -
     * [KO] 컨트롤러가 연결된 `View3D` 인스턴스
     * [EN] `View3D` instance connected to the controller
     * @param time -
     * [KO] 현재 경과 시간 (ms)
     * [EN] Current elapsed time (ms)
     */
    update(view: View3D, time: number): void;
}
export default IsometricController;
