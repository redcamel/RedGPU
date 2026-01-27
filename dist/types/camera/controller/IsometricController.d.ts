import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * [KO] 등각 투영(Isometric) 시점을 제공하는 카메라 컨트롤러입니다.
 * [EN] Camera controller providing an isometric view.
 *
 * [KO] 거리감 없는 직교 투영을 사용하여 전략 시뮬레이션이나 타일 기반 게임에서 주로 사용되는 고정된 각도의 쿼터뷰(Quarter View)를 구현합니다.
 * [EN] Implements a fixed-angle quarter view, commonly used in strategy simulations or tile-based games, using orthographic projection without perspective distortion.
 *
 * * ### Example
 * ```typescript
 * const controller = new RedGPU.Camera.IsometricController(redGPUContext);
 * controller.viewHeight = 15;
 * controller.zoom = 1;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/isometricController/"></iframe>
 * @category Controller
 */
declare class IsometricController extends AController {
    #private;
    /**
     * [KO] IsometricController 생성자
     * [EN] IsometricController constructor
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 줌 레벨을 가져옵니다.
     * [EN] Gets the zoom level.
     *
     * @returns
     * [KO] 줌 레벨 (기본값: 1)
     * [EN] Zoom level (default: 1)
     */
    get zoom(): number;
    /**
     * [KO] 줌 레벨을 설정합니다. minZoom ~ maxZoom 범위로 제한됩니다.
     * [EN] Sets the zoom level. Limited to minZoom ~ maxZoom range.
     *
     * @param value -
     * [KO] 줌 레벨 값
     * [EN] Zoom level value
     */
    set zoom(value: number);
    /**
     * [KO] 줌 보간 계수를 가져옵니다.
     * [EN] Gets the zoom interpolation factor.
     *
     * @returns
     * [KO] 줌 보간 계수 (0.01 ~ 1)
     * [EN] Zoom interpolation factor (0.01 ~ 1)
     */
    get zoomInterpolation(): number;
    /**
     * [KO] 줌 보간 계수를 설정합니다. 낮을수록 부드러운 줌 이동
     * [EN] Sets the zoom interpolation factor. Lower values for smoother zoom.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set zoomInterpolation(value: number);
    /**
     * [KO] 줌 속도를 가져옵니다.
     * [EN] Gets the zoom speed.
     *
     * @returns
     * [KO] 줌 속도
     * [EN] Zoom speed
     */
    get speedZoom(): number;
    /**
     * [KO] 줌 속도를 설정합니다. 높을수록 빠른 줌 속도
     * [EN] Sets the zoom speed. Higher values for faster zoom.
     *
     * @param value -
     * [KO] 줌 속도 (0.01 이상)
     * [EN] Zoom speed (min 0.01)
     */
    set speedZoom(value: number);
    /**
     * [KO] 최소 줌 레벨을 가져옵니다.
     * [EN] Gets the minimum zoom level.
     *
     * @returns
     * [KO] 최소 줌 레벨
     * [EN] Minimum zoom level
     */
    get minZoom(): number;
    /**
     * [KO] 최소 줌 레벨을 설정합니다.
     * [EN] Sets the minimum zoom level.
     *
     * @param value -
     * [KO] 최소 줌 레벨 (0.01 이상)
     * [EN] Minimum zoom level (min 0.01)
     */
    set minZoom(value: number);
    /**
     * [KO] 최대 줌 레벨을 가져옵니다.
     * [EN] Gets the maximum zoom level.
     *
     * @returns
     * [KO] 최대 줌 레벨
     * [EN] Maximum zoom level
     */
    get maxZoom(): number;
    /**
     * [KO] 최대 줌 레벨을 설정합니다.
     * [EN] Sets the maximum zoom level.
     *
     * @param value -
     * [KO] 최대 줌 레벨 (0.01 이상)
     * [EN] Maximum zoom level (min 0.01)
     */
    set maxZoom(value: number);
    /**
     * [KO] 직교 투영 카메라의 뷰 높이를 가져옵니다.
     * [EN] Gets the view height of the orthographic camera.
     *
     * @returns
     * [KO] 뷰 높이
     * [EN] View height
     */
    get viewHeight(): number;
    /**
     * [KO] 직교 투영 카메라의 뷰 높이를 설정합니다.
     * [EN] Sets the view height of the orthographic camera.
     *
     * @param value -
     * [KO] 뷰 높이 (0.1 이상)
     * [EN] View height (min 0.1)
     */
    set viewHeight(value: number);
    /**
     * [KO] 뷰 높이 보간 계수를 가져옵니다.
     * [EN] Gets the view height interpolation factor.
     *
     * @returns
     * [KO] 뷰 높이 보간 계수 (0.01 ~ 1)
     * [EN] View height interpolation factor (0.01 ~ 1)
     */
    get viewHeightInterpolation(): number;
    /**
     * [KO] 뷰 높이 보간 계수를 설정합니다. 낮을수록 부드러운 변화
     * [EN] Sets the view height interpolation factor. Lower values for smoother transition.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set viewHeightInterpolation(value: number);
    /**
     * [KO] 키보드 이동 속도를 가져옵니다.
     * [EN] Gets the keyboard movement speed.
     *
     * @returns
     * [KO] 이동 속도
     * [EN] Movement speed
     */
    get moveSpeed(): number;
    /**
     * [KO] 키보드 이동 속도를 설정합니다.
     * [EN] Sets the keyboard movement speed.
     *
     * @param value -
     * [KO] 이동 속도 (0.01 이상)
     * [EN] Movement speed (min 0.01)
     */
    set moveSpeed(value: number);
    /**
     * [KO] 키보드 이동 보간 계수를 가져옵니다.
     * [EN] Gets the keyboard movement interpolation factor.
     *
     * @returns
     * [KO] 이동 보간 계수 (0.01 ~ 1)
     * [EN] Movement interpolation factor (0.01 ~ 1)
     */
    get moveSpeedInterpolation(): number;
    /**
     * [KO] 키보드 이동 보간 계수를 설정합니다. 낮을수록 부드러운 움직임
     * [EN] Sets the keyboard movement interpolation factor. Lower values for smoother movement.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set moveSpeedInterpolation(value: number);
    /**
     * [KO] 마우스 이동 속도를 가져옵니다.
     * [EN] Gets the mouse movement speed.
     *
     * @returns
     * [KO] 마우스 이동 속도
     * [EN] Mouse movement speed
     */
    get mouseMoveSpeed(): number;
    /**
     * [KO] 마우스 이동 속도를 설정합니다.
     * [EN] Sets the mouse movement speed.
     *
     * @param value -
     * [KO] 마우스 이동 속도 (0.01 이상)
     * [EN] Mouse movement speed (min 0.01)
     */
    set mouseMoveSpeed(value: number);
    /**
     * [KO] 마우스 이동 보간 계수를 가져옵니다.
     * [EN] Gets the mouse movement interpolation factor.
     *
     * @returns
     * [KO] 마우스 이동 보간 계수 (0.01 ~ 1)
     * [EN] Mouse movement interpolation factor (0.01 ~ 1)
     */
    get mouseMoveSpeedInterpolation(): number;
    /**
     * [KO] 마우스 이동 보간 계수를 설정합니다. 낮을수록 부드러운 움직임
     * [EN] Sets the mouse movement interpolation factor. Lower values for smoother movement.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set mouseMoveSpeedInterpolation(value: number);
    /**
     * [KO] 현재 키 매핑 설정을 가져옵니다.
     * [EN] Gets the current key mapping configuration.
     *
     * @returns
     * [KO] 키 매핑 객체의 복사본
     * [EN] Copy of key mapping object
     */
    get keyNameMapper(): {
        moveUp: string;
        moveDown: string;
        moveLeft: string;
        moveRight: string;
    };
    /**
     * [KO] 타겟의 X축 위치를 가져옵니다.
     * [EN] Gets the target's X-axis position.
     *
     * @returns
     * [KO] X축 좌표
     * [EN] X-axis coordinate
     */
    get x(): number;
    /**
     * [KO] 타겟의 Y축 위치를 가져옵니다.
     * [EN] Gets the target's Y-axis position.
     *
     * @returns
     * [KO] Y축 좌표
     * [EN] Y-axis coordinate
     */
    get y(): number;
    /**
     * [KO] 타겟의 Z축 위치를 가져옵니다.
     * [EN] Gets the target's Z-axis position.
     *
     * @returns
     * [KO] Z축 좌표
     * [EN] Z-axis coordinate
     */
    get z(): number;
    /**
     * [KO] 상향 이동 키를 설정합니다.
     * [EN] Sets the move up key.
     *
     * @param value -
     * [KO] 설정할 키 이름
     * [EN] Key name to set
     */
    setMoveUpKey(value: string): void;
    /**
     * [KO] 하향 이동 키를 설정합니다.
     * [EN] Sets the move down key.
     *
     * @param value -
     * [KO] 설정할 키 이름
     * [EN] Key name to set
     */
    setMoveDownKey(value: string): void;
    /**
     * [KO] 좌측 이동 키를 설정합니다.
     * [EN] Sets the move left key.
     *
     * @param value -
     * [KO] 설정할 키 이름
     * [EN] Key name to set
     */
    setMoveLeftKey(value: string): void;
    /**
     * [KO] 우측 이동 키를 설정합니다.
     * [EN] Sets the move right key.
     *
     * @param value -
     * [KO] 설정할 키 이름
     * [EN] Key name to set
     */
    setMoveRightKey(value: string): void;
    /**
     * [KO] 매 프레임마다 아이소메트릭 카메라를 업데이트합니다.
     * [EN] Updates the isometric camera every frame.
     *
     * @param view -
     * [KO] 카메라가 속한 3D 뷰
     * [EN] 3D view the camera belongs to
     * @param time -
     * [KO] 현재 시간 (ms)
     * [EN] Current time (ms)
     */
    update(view: View3D, time: number): void;
}
export default IsometricController;
