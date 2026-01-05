import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * 아이소메트릭(Isometric) 카메라 컨트롤러 클래스입니다.
 * 고정된 각도의 직교 투영 카메라로 타겟 오브젝트를 추적합니다.
 * 마우스 휠로 줌 인/아웃이 가능하며, 키보드로 타겟을 이동할 수 있습니다.
 *
 * @category Controller
 *
 * @example
 * ```javascript
 * const controller = new RedGPU.Camera.IsometricController(redGPUContext);
 * controller.cameraDistance = 15;
 * controller.cameraAngle = 45;
 * controller.zoom = 1;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/isometricController/"></iframe>
 */
declare class IsometricController extends AController {
    #private;
    /**
     * IsometricController 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * 줌 레벨을 가져옵니다.
     * @returns {number} 줌 레벨 (기본값: 1)
     */
    get zoom(): number;
    /**
     * 줌 레벨을 설정합니다. minZoom ~ maxZoom 범위로 제한됩니다.
     * @param {number} value - 줌 레벨 값
     */
    set zoom(value: number);
    /**
     * 줌 보간 계수를 가져옵니다.
     * @returns {number} 줌 보간 계수 (0.01 ~ 1)
     */
    get zoomInterpolation(): number;
    /**
     * 줌 보간 계수를 설정합니다. 낮을수록 부드러운 줌 이동
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set zoomInterpolation(value: number);
    /**
     * 줌 속도를 가져옵니다.
     * @returns {number} 줌 속도
     */
    get speedZoom(): number;
    /**
     * 줌 속도를 설정합니다. 높을수록 빠른 줌 속도
     * @param {number} value - 줌 속도 (0.01 이상)
     */
    set speedZoom(value: number);
    /**
     * 최소 줌 레벨을 가져옵니다.
     * @returns {number} 최소 줌 레벨
     */
    get minZoom(): number;
    /**
     * 최소 줌 레벨을 설정합니다.
     * @param {number} value - 최소 줌 레벨 (0.01 이상)
     */
    set minZoom(value: number);
    /**
     * 최대 줌 레벨을 가져옵니다.
     * @returns {number} 최대 줌 레벨
     */
    get maxZoom(): number;
    /**
     * 최대 줌 레벨을 설정합니다.
     * @param {number} value - 최대 줌 레벨 (0.01 이상)
     */
    set maxZoom(value: number);
    /**
     * 직교 투영 카메라의 뷰 높이를 가져옵니다.
     * @returns {number} 뷰 높이
     */
    get viewHeight(): number;
    /**
     * 직교 투영 카메라의 뷰 높이를 설정합니다.
     * @param {number} value - 뷰 높이 (0.1 이상)
     */
    set viewHeight(value: number);
    /**
     * 뷰 높이 보간 계수를 가져옵니다.
     * @returns {number} 뷰 높이 보간 계수 (0.01 ~ 1)
     */
    get viewHeightInterpolation(): number;
    /**
     * 뷰 높이 보간 계수를 설정합니다. 낮을수록 부드러운 변화
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set viewHeightInterpolation(value: number);
    /**
     * 키보드 이동 속도를 가져옵니다.
     * @returns {number} 이동 속도
     */
    get moveSpeed(): number;
    /**
     * 키보드 이동 속도를 설정합니다.
     * @param {number} value - 이동 속도 (0.01 이상)
     */
    set moveSpeed(value: number);
    /**
     * 키보드 이동 보간 계수를 가져옵니다.
     * @returns {number} 이동 보간 계수 (0.01 ~ 1)
     */
    get moveSpeedInterpolation(): number;
    /**
     * 키보드 이동 보간 계수를 설정합니다. 낮을수록 부드러운 움직임
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set moveSpeedInterpolation(value: number);
    /**
     * 마우스 이동 속도를 가져옵니다.
     * @returns {number} 마우스 이동 속도
     */
    get mouseMoveSpeed(): number;
    /**
     * 마우스 이동 속도를 설정합니다.
     * @param {number} value - 마우스 이동 속도 (0.01 이상)
     */
    set mouseMoveSpeed(value: number);
    /**
     * 마우스 이동 보간 계수를 가져옵니다.
     * @returns {number} 마우스 이동 보간 계수 (0.01 ~ 1)
     */
    get mouseMoveSpeedInterpolation(): number;
    /**
     * 마우스 이동 보간 계수를 설정합니다. 낮을수록 부드러운 움직임
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set mouseMoveSpeedInterpolation(value: number);
    /**
     * 현재 키 매핑 설정을 가져옵니다.
     * @returns {Object} 키 매핑 객체의 복사본
     */
    get keyNameMapper(): {
        moveUp: string;
        moveDown: string;
        moveLeft: string;
        moveRight: string;
    };
    /**
     * 타겟의 X축 위치를 가져옵니다.
     * @returns {number} X축 좌표
     */
    get x(): number;
    /**
     * 타겟의 Y축 위치를 가져옵니다.
     * @returns {number} Y축 좌표
     */
    get y(): number;
    /**
     * 타겟의 Z축 위치를 가져옵니다.
     * @returns {number} Z축 좌표
     */
    get z(): number;
    /**
     * 상향 이동 키를 설정합니다.
     * @param {string} value - 설정할 키 이름
     */
    setMoveUpKey(value: string): void;
    /**
     * 하향 이동 키를 설정합니다.
     * @param {string} value - 설정할 키 이름
     */
    setMoveDownKey(value: string): void;
    /**
     * 좌측 이동 키를 설정합니다.
     * @param {string} value - 설정할 키 이름
     */
    setMoveLeftKey(value: string): void;
    /**
     * 우측 이동 키를 설정합니다.
     * @param {string} value - 설정할 키 이름
     */
    setMoveRightKey(value: string): void;
    /**
     * 매 프레임마다 아이소메트릭 카메라를 업데이트합니다.
     * 줌, 뷰 높이, 타겟 위치를 보간하고 카메라 위치를 계산합니다.
     *
     * @param {View3D} view - 카메라가 속한 3D 뷰
     * @param {number} time - 현재 시간 (ms)
     */
    update(view: View3D, time: number): void;
}
export default IsometricController;
