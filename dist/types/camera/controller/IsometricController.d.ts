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
 * const controller = new RedGPU.IsometricController(redGPUContext);
 * controller.viewHeight = 15;
 * controller.zoom = 1;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:500px;"></iframe>
 * @category Controller
 */
declare class IsometricController extends AController {
    #private;
    /**
     * [KO] IsometricController 인스턴스를 생성합니다.
     * [EN] Creates an instance of IsometricController.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 줌 레벨을 가져옵니다.
     * [EN] Gets the zoom level.
     * @returns [KO] 줌 레벨 [EN] Zoom level
     */
    get zoom(): number;
    /**
     * [KO] 줌 레벨을 설정합니다.
     * [EN] Sets the zoom level.
     * @param value - [KO] 줌 레벨 [EN] Zoom level
     */
    set zoom(value: number);
    /** [KO] 줌 보간 계수 [EN] Zoom interpolation factor */
    get zoomInterpolation(): number;
    set zoomInterpolation(value: number);
    /** [KO] 줌 속도 [EN] Zoom speed */
    get speedZoom(): number;
    set speedZoom(value: number);
    /** [KO] 최소 줌 [EN] Minimum zoom */
    get minZoom(): number;
    set minZoom(value: number);
    /** [KO] 최대 줌 [EN] Maximum zoom */
    get maxZoom(): number;
    set maxZoom(value: number);
    /** [KO] 뷰 높이 [EN] View height */
    get viewHeight(): number;
    set viewHeight(value: number);
    /** [KO] 뷰 높이 보간 계수 [EN] View height interpolation factor */
    get viewHeightInterpolation(): number;
    set viewHeightInterpolation(value: number);
    /** [KO] 이동 속도 [EN] Movement speed */
    get moveSpeed(): number;
    set moveSpeed(value: number);
    /** [KO] 이동 보간 계수 [EN] Movement interpolation factor */
    get moveSpeedInterpolation(): number;
    set moveSpeedInterpolation(value: number);
    /** [KO] 마우스 이동 속도 [EN] Mouse movement speed */
    get mouseMoveSpeed(): number;
    set mouseMoveSpeed(value: number);
    /** [KO] 마우스 이동 보간 계수 [EN] Mouse movement interpolation factor */
    get mouseMoveSpeedInterpolation(): number;
    set mouseMoveSpeedInterpolation(value: number);
    /** [KO] 키 매핑 설정 [EN] Key mapping configuration */
    get keyNameMapper(): {
        moveUp: string;
        moveDown: string;
        moveLeft: string;
        moveRight: string;
    };
    /** [KO] 타겟 X 위치 [EN] Target X position */
    get targetX(): number;
    /** [KO] 타겟 Y 위치 [EN] Target Y position */
    get targetY(): number;
    /** [KO] 타겟 Z 위치 [EN] Target Z position */
    get targetZ(): number;
    /** [KO] 상향 이동 키 설정 [EN] Sets the move up key */
    setMoveUpKey(value: string): void;
    /** [KO] 하향 이동 키 설정 [EN] Sets the move down key */
    setMoveDownKey(value: string): void;
    /** [KO] 좌측 이동 키 설정 [EN] Sets the move left key */
    setMoveLeftKey(value: string): void;
    /** [KO] 우측 이동 키 설정 [EN] Sets the move right key */
    setMoveRightKey(value: string): void;
    /**
     * [KO] 매 프레임마다 카메라를 업데이트합니다.
     * [EN] Updates the camera every frame.
     * @param view - [KO] 3D 뷰 [EN] 3D view
     * @param time - [KO] 현재 시간 [EN] Current time
     */
    update(view: View3D, time: number): void;
}
export default IsometricController;
