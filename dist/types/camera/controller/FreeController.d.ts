import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * [KO] 키보드 입력 키 매핑 설정을 정의합니다.
 * [EN] Defines keyboard input key mapping configuration.
 */
type KeyNameMapper = {
    /**
     * [KO] 전진 이동 키
     * [EN] Move forward key
     */
    moveForward: string;
    /**
     * [KO] 후진 이동 키
     * [EN] Move backward key
     */
    moveBack: string;
    /**
     * [KO] 좌측 이동 키
     * [EN] Move left key
     */
    moveLeft: string;
    /**
     * [KO] 우측 이동 키
     * [EN] Move right key
     */
    moveRight: string;
    /**
     * [KO] 상향 이동 키
     * [EN] Move up key
     */
    moveUp: string;
    /**
     * [KO] 하향 이동 키
     * [EN] Move down key
     */
    moveDown: string;
    /**
     * [KO] 좌회전 키
     * [EN] Turn left key
     */
    turnLeft: string;
    /**
     * [KO] 우회전 키
     * [EN] Turn right key
     */
    turnRight: string;
    /**
     * [KO] 상향 회전 키
     * [EN] Turn up key
     */
    turnUp: string;
    /**
     * [KO] 하향 회전 키
     * [EN] Turn down key
     */
    turnDown: string;
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
 * const controller = new RedGPU.Camera.FreeController(redGPUContext);
 * controller.x = 10;
 * controller.y = 5;
 * controller.z = 20;
 * controller.pan = 30;
 * controller.tilt = 10;
 * controller.setMoveForwardKey('w');
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/freeController/"></iframe>
 * @category Controller
 */
declare class FreeController extends AController {
    #private;
    /**
     * [KO] FreeController의 생성자입니다.
     * [EN] Constructor for FreeController.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 객체
     * [EN] RedGPU Context object
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 카메라의 X축 위치를 가져옵니다.
     * [EN] Gets the camera's X-axis position.
     *
     * @returns
     * [KO] 카메라의 X축 위치 값
     * [EN] Camera X-axis position value
     */
    get x(): number;
    /**
     * [KO] 카메라의 X축 위치를 설정합니다.
     * [EN] Sets the camera's X-axis position.
     *
     * @param value -
     * [KO] 설정할 X축 위치 값 (숫자)
     * [EN] X-axis position value to set (number)
     */
    set x(value: number);
    /**
     * [KO] 카메라의 Y축 위치를 가져옵니다.
     * [EN] Gets the camera's Y-axis position.
     *
     * @returns
     * [KO] 카메라의 Y축 위치 값
     * [EN] Camera Y-axis position value
     */
    get y(): number;
    /**
     * [KO] 카메라의 Y축 위치를 설정합니다.
     * [EN] Sets the camera's Y-axis position.
     *
     * @param value -
     * [KO] 설정할 Y축 위치 값 (숫자)
     * [EN] Y-axis position value to set (number)
     */
    set y(value: number);
    /**
     * [KO] 카메라의 Z축 위치를 가져옵니다.
     * [EN] Gets the camera's Z-axis position.
     *
     * @returns
     * [KO] 카메라의 Z축 위치 값
     * [EN] Camera Z-axis position value
     */
    get z(): number;
    /**
     * [KO] 카메라의 Z축 위치를 설정합니다.
     * [EN] Sets the camera's Z-axis position.
     *
     * @param value -
     * [KO] 설정할 Z축 위치 값 (숫자)
     * [EN] Z-axis position value to set (number)
     */
    set z(value: number);
    /**
     * [KO] 카메라의 좌우 회전 각도(Pan)를 가져옵니다. (단위: 도)
     * [EN] Gets the camera's horizontal rotation angle (Pan). (Unit: degrees)
     *
     * @returns
     * [KO] 좌우 회전 각도 값
     * [EN] Horizontal rotation angle value
     */
    get pan(): number;
    /**
     * [KO] 카메라의 좌우 회전 각도(Pan)를 설정합니다. (단위: 도)
     * [EN] Sets the camera's horizontal rotation angle (Pan). (Unit: degrees)
     *
     * @param value -
     * [KO] 설정할 좌우 회전 각도 값
     * [EN] Horizontal rotation angle value to set
     */
    set pan(value: number);
    /**
     * [KO] 카메라의 상하 회전 각도(Tilt)를 가져옵니다. (단위: 도, 범위: -90 ~ 90)
     * [EN] Gets the camera's vertical rotation angle (Tilt). (Unit: degrees, Range: -90 ~ 90)
     *
     * @returns
     * [KO] 상하 회전 각도 값
     * [EN] Vertical rotation angle value
     */
    get tilt(): number;
    /**
     * [KO] 카메라의 상하 회전 각도(Tilt)를 설정합니다. (단위: 도, 범위: -90 ~ 90)
     * [EN] Sets the camera's vertical rotation angle (Tilt). (Unit: degrees, Range: -90 ~ 90)
     *
     * @param value -
     * [KO] 설정할 상하 회전 각도 값
     * [EN] Vertical rotation angle value to set
     */
    set tilt(value: number);
    /**
     * [KO] 카메라의 이동 속도를 가져옵니다.
     * [EN] Gets the camera's movement speed.
     *
     * @returns
     * [KO] 이동 속도 값
     * [EN] Movement speed value
     */
    get moveSpeed(): number;
    /**
     * [KO] 카메라의 이동 속도를 설정합니다.
     * [EN] Sets the camera's movement speed.
     *
     * @param value -
     * [KO] 설정할 이동 속도 값 (0.01 이상)
     * [EN] Movement speed value to set (min 0.01)
     */
    set moveSpeed(value: number);
    /**
     * [KO] 이동 보간 정도를 가져옵니다. (0~1 범위에서 작을수록 부드러움)
     * [EN] Gets the movement interpolation factor. (Range 0~1, smaller is smoother)
     *
     * @returns
     * [KO] 이동 보간 정도 값
     * [EN] Movement interpolation factor value
     */
    get moveSpeedInterpolation(): number;
    /**
     * [KO] 이동 보간 정도를 설정합니다. (0.01~1 범위, 작을수록 부드러운 이동)
     * [EN] Sets the movement interpolation factor. (Range 0.01~1, smaller is smoother movement)
     *
     * @param value -
     * [KO] 설정할 보간 정도 값
     * [EN] Interpolation factor value to set
     */
    set moveSpeedInterpolation(value: number);
    /**
     * [KO] 카메라의 회전 속도를 가져옵니다.
     * [EN] Gets the camera's rotation speed.
     *
     * @returns
     * [KO] 회전 속도 값
     * [EN] Rotation speed value
     */
    get rotationSpeed(): number;
    /**
     * [KO] 카메라의 회전 속도를 설정합니다.
     * [EN] Sets the camera's rotation speed.
     *
     * @param value -
     * [KO] 설정할 회전 속도 값 (0.01 이상)
     * [EN] Rotation speed value to set (min 0.01)
     */
    set rotationSpeed(value: number);
    /**
     * [KO] 회전 보간 정도를 가져옵니다. (0~1 범위에서 작을수록 부드러움)
     * [EN] Gets the rotation interpolation factor. (Range 0~1, smaller is smoother)
     *
     * @returns
     * [KO] 회전 보간 정도 값
     * [EN] Rotation interpolation factor value
     */
    get rotationSpeedInterpolation(): number;
    /**
     * [KO] 회전 보간 정도를 설정합니다. (0.01~1 범위, 작을수록 부드러운 회전)
     * [EN] Sets the rotation interpolation factor. (Range 0.01~1, smaller is smoother rotation)
     *
     * @param value -
     * [KO] 설정할 보간 정도 값
     * [EN] Interpolation factor value to set
     */
    set rotationSpeedInterpolation(value: number);
    /**
     * [KO] 최대 가속도를 가져옵니다.
     * [EN] Gets the maximum acceleration.
     *
     * @returns
     * [KO] 최대 가속도 값
     * [EN] Maximum acceleration value
     */
    get maxAcceleration(): number;
    /**
     * [KO] 최대 가속도를 설정합니다.
     * [EN] Sets the maximum acceleration.
     *
     * @param value -
     * [KO] 설정할 최대 가속도 값
     * [EN] Maximum acceleration value to set
     */
    set maxAcceleration(value: number);
    /**
     * [KO] 현재 키 매핑 설정을 가져옵니다.
     * [EN] Gets the current key mapping configuration.
     *
     * @returns
     * [KO] 키 매핑 객체의 복사본
     * [EN] Copy of key mapping object
     */
    get keyNameMapper(): KeyNameMapper;
    /**
     * [KO] 전진 이동 키를 설정합니다.
     * [EN] Sets the move forward key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'w')
     * [EN] Key name to set (e.g., 'w')
     */
    setMoveForwardKey(value: string): void;
    /**
     * [KO] 후진 이동 키를 설정합니다.
     * [EN] Sets the move backward key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 's')
     * [EN] Key name to set (e.g., 's')
     */
    setMoveBackKey(value: string): void;
    /**
     * [KO] 좌측 이동 키를 설정합니다.
     * [EN] Sets the move left key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'a')
     * [EN] Key name to set (e.g., 'a')
     */
    setMoveLeftKey(value: string): void;
    /**
     * [KO] 우측 이동 키를 설정합니다.
     * [EN] Sets the move right key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'd')
     * [EN] Key name to set (e.g., 'd')
     */
    setMoveRightKey(value: string): void;
    /**
     * [KO] 상향 이동 키를 설정합니다.
     * [EN] Sets the move up key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 't')
     * [EN] Key name to set (e.g., 't')
     */
    setMoveUpKey(value: string): void;
    /**
     * [KO] 하향 이동 키를 설정합니다.
     * [EN] Sets the move down key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'g')
     * [EN] Key name to set (e.g., 'g')
     */
    setMoveDownKey(value: string): void;
    /**
     * [KO] 좌회전 키를 설정합니다.
     * [EN] Sets the turn left key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'q')
     * [EN] Key name to set (e.g., 'q')
     */
    setTurnLeftKey(value: string): void;
    /**
     * [KO] 우회전 키를 설정합니다.
     * [EN] Sets the turn right key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'e')
     * [EN] Key name to set (e.g., 'e')
     */
    setTurnRightKey(value: string): void;
    /**
     * [KO] 상향 회전 키를 설정합니다.
     * [EN] Sets the turn up key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'r')
     * [EN] Key name to set (e.g., 'r')
     */
    setTurnUpKey(value: string): void;
    /**
     * [KO] 하향 회전 키를 설정합니다.
     * [EN] Sets the turn down key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'f')
     * [EN] Key name to set (e.g., 'f')
     */
    setTurnDownKey(value: string): void;
    /**
     * [KO] 매 프레임마다 카메라 컨트롤러를 업데이트합니다.
     * [EN] Updates the camera controller every frame.
     *
     * @param view -
     * [KO] 3D 뷰 객체
     * [EN] 3D View object
     * @param time -
     * [KO] 현재 경과 시간 (밀리초)
     * [EN] Current elapsed time (ms)
     */
    update(view: View3D, time: number): void;
}
export default FreeController;
