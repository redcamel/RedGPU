import RedGPUContext from "../context/RedGPUContext";
import RedGPUObject from "../base/RedGPUObject";
import Mesh from "../display/mesh/Mesh";
import ACamera from "../camera/core/ACamera";
import View3D from "../display/view/View3D";
/**
 * [KO] Simple 캐릭터 컨트롤러의 키 매핑 규격 인터페이스입니다.
 * [EN] Key mapping specification interface for SimpleCharacterController.
 */
export interface CharacterKeyMap {
    moveForward?: string[];
    moveBackward?: string[];
    strafeLeft?: string[];
    strafeRight?: string[];
    turnLeft?: string[];
    turnRight?: string[];
    jump?: string[];
    run?: string[];
}
/**
 * [KO] Simple 캐릭터 컨트롤러의 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for SimpleCharacterController.
 */
export interface SimpleCharacterControllerOptions {
    /** [KO] 이동 속도 (기본값: 5.0) [EN] Movement speed (default: 5.0) */
    speed?: number;
    /** [KO] 달리기 속도 (기본값: 10.0) [EN] Run speed (default: 10.0) */
    runSpeed?: number;
    /** [KO] 회전 보간 속도 (기본값: 8.0) [EN] Rotation interpolation speed (default: 8.0) */
    rotationSpeed?: number;
    /** [KO] 중력 가속도 (기본값: 9.8) [EN] Gravity acceleration (default: 9.8) */
    gravity?: number;
    /** [KO] 점프 힘 (기본값: 5.0) [EN] Jump force (default: 5.0) */
    jumpForce?: number;
    /** [KO] 바닥 Y축 높이 (기본값: 0.0) [EN] Floor Y-axis height (default: 0.0) */
    floorHeight?: number;
    /** [KO] 키보드 조작 활성화 여부 (기본값: true) [EN] Whether to enable keyboard control (default: true) */
    useKeyboard?: boolean;
    /** [KO] 모델 자체의 기본 회전 오프셋 각도 (도 단위, 기본값: 0.0) [EN] Model's default rotation offset angle (in degrees, default: 0.0) */
    modelRotationOffset?: number;
    /** [KO] 컨트롤러 회전 사용 여부 (캐릭터가 카메라 방향을 항상 유지할지 여부, 기본값: false) [EN] Whether to use controller rotation yaw (whether the character always aligns with camera direction, default: false) */
    useControllerRotationYaw?: boolean;
    /** [KO] 이동 방향으로 캐릭터 회전 정렬 여부 (기본값: true) [EN] Whether to orient character rotation to movement direction (default: true) */
    orientRotationToMovement?: boolean;
    /** [KO] 사용자 정의 키보드 매핑 [EN] Custom keyboard mapping configuration */
    keyMap?: CharacterKeyMap;
}
/**
 * [KO] 3D 캐릭터의 움직임과 회전을 제어하는 Simple 캐릭터 컨트롤러 클래스입니다.
 * [EN] Simple character controller class that controls the movement and rotation of a 3D character.
 *
 * [KO] 카메라 뷰 방향과 독립된 이동(WASD) 및 자연스러운 선회 회전, 그리고 점프 및 낙하 중력을 단독으로 구현합니다.
 * [EN] Implements camera-independent movement (WASD), smooth rotation interpolation, and jump/fall gravity independently.
 *
 * @category Controller
 */
declare class SimpleCharacterController extends RedGPUObject {
    #private;
    speed: number;
    runSpeed: number;
    rotationSpeed: number;
    gravity: number;
    jumpForce: number;
    floorHeight: number;
    useKeyboard: boolean;
    modelRotationOffset: number;
    useControllerRotationYaw: boolean;
    orientRotationToMovement: boolean;
    keyMap: Required<CharacterKeyMap>;
    /**
     * [KO] SimpleCharacterController 인스턴스를 생성합니다.
     * [EN] Creates an instance of SimpleCharacterController.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     * @param targetMesh - [KO] 제어할 캐릭터 메시 [EN] Character mesh to control
     * @param camera - [KO] 카메라 인스턴스 [EN] Camera instance
     * @param options - [KO] 캐릭터 설정 옵션 [EN] Character settings options
     */
    constructor(redGPUContext: RedGPUContext, targetMesh: Mesh, camera: ACamera, options?: SimpleCharacterControllerOptions);
    /** [KO] 제어 중인 대상 메시를 반환합니다. [EN] Returns the controlled target mesh. */
    get targetMesh(): Mesh;
    /** [KO] 제어 중인 대상 메시를 설정합니다. [EN] Sets the controlled target mesh. */
    set targetMesh(value: Mesh);
    /** [KO] 방향 기준 카메라를 반환합니다. [EN] Returns the reference camera. */
    get camera(): ACamera;
    /** [KO] 방향 기준 카메라를 설정합니다. [EN] Sets the reference camera. */
    set camera(value: ACamera);
    /** [KO] 캐릭터가 현재 이동(WASD 입력) 중인지 여부를 반환합니다. [EN] Returns whether the character is currently moving. */
    get isMoving(): boolean;
    /** [KO] 캐릭터가 현재 달리기(Shift 조합 입력) 중인지 여부를 반환합니다. [EN] Returns whether the character is currently running. */
    get isRunning(): boolean;
    /** [KO] 지면에 닿아있는지 여부를 반환합니다. [EN] Returns whether the character is on the ground. */
    get isGrounded(): boolean;
    /**
     * [KO] 매 프레임 업데이트 루프를 수행합니다.
     * [EN] Performs the update loop per frame.
     *
     * @param view - [KO] 현재 View3D 인스턴스 [EN] Current View3D instance
     * @param time - [KO] 현재 렌더 타임스탬프 (ms) [EN] Current render timestamp (ms)
     */
    update(view: View3D, time: number): void;
}
export default SimpleCharacterController;
