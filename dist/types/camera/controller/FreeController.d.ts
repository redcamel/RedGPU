import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * [KO] FreeController의 키보드 입력 키 매핑 구성을 정의하는 타입입니다.
 * [EN] Type defining the keyboard input key mapping configuration for FreeController.
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
 * [KO] 키보드와 마우스 입력을 사용하여 3D 공간을 자유롭게 탐색하는 1인칭 시점 카메라 컨트롤러 클래스입니다.
 * [EN] First-person camera controller class that freely navigates 3D space using keyboard and mouse inputs.
 *
 * ### Example
 * ```typescript
 * const controller = new RedGPU.Camera.FreeController(redGPUContext);
 * controller.x = 0;
 * controller.y = 5;
 * controller.z = 20;
 * controller.pan = 0;
 * controller.tilt = -15;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/controller/freeController/" style="width:100%; height:500px;"></iframe>
 * @see [FreeController example](/RedGPU/examples/3d/controller/freeController/)
 * @category Controller
 */
declare class FreeController extends AController {
    #private;
    /**
     * [KO] FreeController 인스턴스를 생성합니다.
     * [EN] Creates a FreeController instance.
     *
     * ### Example
     * ```typescript
     * const controller = new RedGPU.Camera.FreeController(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 카메라의 목표 X축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's target X-axis position.
     *
     * @returns
     * [KO] X축 위치 (기본값: `0`)
     * [EN] X-axis position (default: `0`)
     */
    get x(): number;
    set x(value: number);
    /**
     * [KO] 카메라의 목표 Y축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's target Y-axis position.
     *
     * @returns
     * [KO] Y축 위치 (기본값: `0`)
     * [EN] Y-axis position (default: `0`)
     */
    get y(): number;
    set y(value: number);
    /**
     * [KO] 카메라의 목표 Z축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's target Z-axis position.
     *
     * @returns
     * [KO] Z축 위치 (기본값: `0`)
     * [EN] Z-axis position (default: `0`)
     */
    get z(): number;
    set z(value: number);
    /**
     * [KO] 카메라의 수평 회전(Pan) 목표 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's target horizontal rotation (Pan) angle. (Unit: degrees)
     *
     * @returns
     * [KO] 팬 각도 (기본값: `0`)
     * [EN] Pan angle (default: `0`)
     */
    get pan(): number;
    set pan(value: number);
    /**
     * [KO] 카메라의 수직 회전(Tilt) 목표 각도를 가져오거나 설정합니다. (단위: 도, 범위: `-89.9` ~ `89.9`)
     * [EN] Gets or sets the camera's target vertical rotation (Tilt) angle. (Unit: degrees, Range: `-89.9` ~ `89.9`)
     *
     * @returns
     * [KO] 틸트 각도 (기본값: `0`)
     * [EN] Tilt angle (default: `0`)
     */
    get tilt(): number;
    set tilt(value: number);
    /**
     * [KO] 마우스 드래그 회전 감도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the mouse drag rotation sensitivity. (`0.01` or greater)
     *
     * @returns
     * [KO] 마우스 회전 감도 (기본값: `0.15`)
     * [EN] Mouse rotation sensitivity (default: `0.15`)
     */
    get mouseSensitivity(): number;
    set mouseSensitivity(value: number);
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
     * [KO] 이동 위치 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for movement position changes. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 이동 보간 계수 (기본값: `0.01`)
     * [EN] Movement interpolation factor (default: `0.01`)
     */
    get moveSpeedInterpolation(): number;
    set moveSpeedInterpolation(value: number);
    /**
     * [KO] 키보드 회전 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the keyboard rotation speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 회전 속도 (기본값: `100`)
     * [EN] Rotation speed (default: `100`)
     */
    get rotationSpeed(): number;
    set rotationSpeed(value: number);
    /**
     * [KO] 회전 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for rotation changes. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 회전 보간 계수 (기본값: `0.01`)
     * [EN] Rotation interpolation factor (default: `0.01`)
     */
    get rotationSpeedInterpolation(): number;
    set rotationSpeedInterpolation(value: number);
    /**
     * [KO] 최대 이동 가속도 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum movement acceleration scale.
     *
     * @returns
     * [KO] 최대 가속도 배율 (기본값: `1`)
     * [EN] Maximum acceleration scale (default: `1`)
     */
    get maxAcceleration(): number;
    set maxAcceleration(value: number);
    /**
     * [KO] 현재 설정된 키보드 키 매핑 객체의 복사본을 반환합니다.
     * [EN] Returns a copy of the currently configured keyboard key mapping object.
     *
     * @returns
     * [KO] 키 매핑 설정 객체 (`KeyNameMapper`)
     * [EN] Key mapping configuration object (`KeyNameMapper`)
     */
    get keyNameMapper(): KeyNameMapper;
    /**
     * [KO] 전진 이동 키를 설정합니다.
     * [EN] Sets the move forward key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'w'`)
     * [EN] Key name to assign (e.g., `'w'`)
     */
    setMoveForwardKey(value: string): void;
    /**
     * [KO] 후진 이동 키를 설정합니다.
     * [EN] Sets the move backward key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'s'`)
     * [EN] Key name to assign (e.g., `'s'`)
     */
    setMoveBackKey(value: string): void;
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
     * [KO] 상향 이동 키를 설정합니다.
     * [EN] Sets the move up key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'e'`)
     * [EN] Key name to assign (e.g., `'e'`)
     */
    setMoveUpKey(value: string): void;
    /**
     * [KO] 하향 이동 키를 설정합니다.
     * [EN] Sets the move down key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'q'`)
     * [EN] Key name to assign (e.g., `'q'`)
     */
    setMoveDownKey(value: string): void;
    /**
     * [KO] 좌회전 키를 설정합니다.
     * [EN] Sets the turn left key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'z'`)
     * [EN] Key name to assign (e.g., `'z'`)
     */
    setTurnLeftKey(value: string): void;
    /**
     * [KO] 우회전 키를 설정합니다.
     * [EN] Sets the turn right key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'c'`)
     * [EN] Key name to assign (e.g., `'c'`)
     */
    setTurnRightKey(value: string): void;
    /**
     * [KO] 상향 회전 키를 설정합니다.
     * [EN] Sets the turn up key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'r'`)
     * [EN] Key name to assign (e.g., `'r'`)
     */
    setTurnUpKey(value: string): void;
    /**
     * [KO] 하향 회전 키를 설정합니다.
     * [EN] Sets the turn down key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'f'`)
     * [EN] Key name to assign (e.g., `'f'`)
     */
    setTurnDownKey(value: string): void;
    /**
     * [KO] 매 프레임 자유 시점 카메라의 상태를 갱신합니다.
     * [EN] Updates the free-view camera state every frame.
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
export default FreeController;
