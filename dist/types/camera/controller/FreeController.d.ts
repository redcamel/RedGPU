import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * [KO] 키보드 입력 키 매핑 설정을 정의합니다.
 * [EN] Defines keyboard input key mapping configuration.
 */
type KeyNameMapper = {
    /** [KO] 전진 이동 [EN] Move forward */ moveForward: string;
    /** [KO] 후진 이동 [EN] Move backward */ moveBack: string;
    /** [KO] 좌측 이동 [EN] Move left */ moveLeft: string;
    /** [KO] 우측 이동 [EN] Move right */ moveRight: string;
    /** [KO] 상향 이동 [EN] Move up */ moveUp: string;
    /** [KO] 하향 이동 [EN] Move down */ moveDown: string;
    /** [KO] 좌회전 [EN] Turn left */ turnLeft: string;
    /** [KO] 우회전 [EN] Turn right */ turnRight: string;
    /** [KO] 상향 회전 [EN] Turn up */ turnUp: string;
    /** [KO] 하향 회전 [EN] Turn down */ turnDown: string;
};
/**
 * [KO] 자유롭게 이동 가능한 1인칭 시점의 카메라 컨트롤러입니다.
 * [EN] First-person camera controller that allows free movement.
 *
 * [KO] FPS 게임이나 3D 에디터의 뷰포트처럼 키보드와 마우스를 사용하여 공간을 자유롭게 비행하듯 탐색할 수 있습니다.
 * [EN] Allows for free-flight exploration of the space using keyboard and mouse, similar to FPS games or 3D editor viewports.
 *
 * * ### Example
 * ```typescript
 * const controller = new RedGPU.FreeController(redGPUContext);
 * controller.pan = 30;
 * controller.tilt = 10;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/freeController/" style="width:100%; height:500px;"></iframe>
 * @category Controller
 */
declare class FreeController extends AController {
    #private;
    /**
     * [KO] FreeController 인스턴스를 생성합니다.
     * [EN] Creates an instance of FreeController.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 객체
     * [EN] RedGPU Context object
     */
    constructor(redGPUContext: RedGPUContext);
    /** [KO] X축 위치 [EN] X-axis position */
    get x(): number;
    set x(value: number);
    /** [KO] Y축 위치 [EN] Y-axis position */
    get y(): number;
    set y(value: number);
    /** [KO] Z축 위치 [EN] Z-axis position */
    get z(): number;
    set z(value: number);
    /** [KO] 좌우 회전 각도 (도) [EN] Horizontal rotation angle (Pan) in degrees */
    get pan(): number;
    set pan(value: number);
    /** [KO] 상하 회전 각도 (도) [EN] Vertical rotation angle (Tilt) in degrees */
    get tilt(): number;
    set tilt(value: number);
    /** [KO] 마우스 감도 [EN] Mouse rotation sensitivity */
    get mouseSensitivity(): number;
    set mouseSensitivity(value: number);
    /** [KO] 이동 속도 [EN] Movement speed */
    get moveSpeed(): number;
    set moveSpeed(value: number);
    /** [KO] 이동 보간 계수 [EN] Movement interpolation factor */
    get moveSpeedInterpolation(): number;
    set moveSpeedInterpolation(value: number);
    /** [KO] 회전 속도 [EN] Rotation speed */
    get rotationSpeed(): number;
    set rotationSpeed(value: number);
    /** [KO] 회전 보간 계수 [EN] Rotation interpolation factor */
    get rotationSpeedInterpolation(): number;
    set rotationSpeedInterpolation(value: number);
    /** [KO] 최대 가속도 배율 [EN] Maximum acceleration scale */
    get maxAcceleration(): number;
    set maxAcceleration(value: number);
    /** [KO] 키 매핑 설정 객체 [EN] Key mapping configuration object */
    get keyNameMapper(): KeyNameMapper;
    /** [KO] 전진 키 설정 [EN] Sets the move forward key */
    setMoveForwardKey(value: string): void;
    /** [KO] 후진 키 설정 [EN] Sets the move backward key */
    setMoveBackKey(value: string): void;
    /** [KO] 좌측 이동 키 설정 [EN] Sets the move left key */
    setMoveLeftKey(value: string): void;
    /** [KO] 우측 이동 키 설정 [EN] Sets the move right key */
    setMoveRightKey(value: string): void;
    /** [KO] 상향 이동 키 설정 [EN] Sets the move up key */
    setMoveUpKey(value: string): void;
    /** [KO] 하향 이동 키 설정 [EN] Sets the move down key */
    setMoveDownKey(value: string): void;
    /** [KO] 좌회전 키 설정 [EN] Sets the turn left key */
    setTurnLeftKey(value: string): void;
    /** [KO] 우회전 키 설정 [EN] Sets the turn right key */
    setTurnRightKey(value: string): void;
    /** [KO] 상향 회전 키 설정 [EN] Sets the turn up key */
    setTurnUpKey(value: string): void;
    /** [KO] 하향 회전 키 설정 [EN] Sets the turn down key */
    setTurnDownKey(value: string): void;
    /**
     * [KO] 매 프레임 컨트롤러를 업데이트합니다.
     * [EN] Updates the controller every frame.
     *
     * @param view - [KO] 3D 뷰 [EN] 3D View
     * @param time - [KO] 현재 시간 [EN] Current time
     */
    update(view: View3D, time: number): void;
}
export default FreeController;
