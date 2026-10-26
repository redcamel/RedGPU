import RedGPUContext from "../context/RedGPUContext";
import RedGPUObject from "../base/RedGPUObject";
import Mesh from "../display/mesh/Mesh";
import ACamera from "../camera/core/ACamera";
import View3D from "../display/view/View3D";
/**
 * [KO] `SimpleCharacterController`의 키보드 입력 매핑 규격 인터페이스입니다.
 * [EN] Keyboard input mapping specification interface for `SimpleCharacterController`.
 *
 * @category Controller
 */
export interface CharacterKeyMap {
    /**
     * [KO] 전진 이동 키 목록
     * [EN] Keys for moving forward
     */
    moveForward?: string[];
    /**
     * [KO] 후진 이동 키 목록
     * [EN] Keys for moving backward
     */
    moveBackward?: string[];
    /**
     * [KO] 좌측 횡이동 키 목록
     * [EN] Keys for strafing left
     */
    strafeLeft?: string[];
    /**
     * [KO] 우측 횡이동 키 목록
     * [EN] Keys for strafing right
     */
    strafeRight?: string[];
    /**
     * [KO] 좌회전 키 목록
     * [EN] Keys for turning left
     */
    turnLeft?: string[];
    /**
     * [KO] 우회전 키 목록
     * [EN] Keys for turning right
     */
    turnRight?: string[];
    /**
     * [KO] 점프 키 목록
     * [EN] Keys for jumping
     */
    jump?: string[];
    /**
     * [KO] 달리기 키 목록
     * [EN] Keys for running
     */
    run?: string[];
}
/**
 * [KO] `SimpleCharacterController`의 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for `SimpleCharacterController`.
 *
 * @category Controller
 */
export interface SimpleCharacterControllerOptions {
    /**
     * [KO] 기본 이동 속도 (기본값: `5.0`)
     * [EN] Default movement speed (default: `5.0`)
     */
    speed?: number;
    /**
     * [KO] 달리기 이동 속도 (기본값: `speed * 2`)
     * [EN] Running movement speed (default: `speed * 2`)
     */
    runSpeed?: number;
    /**
     * [KO] 회전 보간 속도 (기본값: `8.0`)
     * [EN] Rotation interpolation speed (default: `8.0`)
     */
    rotationSpeed?: number;
    /**
     * [KO] 중력 가속도 (기본값: `9.8`)
     * [EN] Gravity acceleration (default: `9.8`)
     */
    gravity?: number;
    /**
     * [KO] 점프 초기 속도 (기본값: `5.0`)
     * [EN] Initial jump velocity (default: `5.0`)
     */
    jumpForce?: number;
    /**
     * [KO] 기준 바닥 Y축 높이 (기본값: `0.0`)
     * [EN] Base floor Y-axis height (default: `0.0`)
     */
    floorHeight?: number;
    /**
     * [KO] 키보드 조작 활성화 여부 (기본값: `true`)
     * [EN] Whether keyboard control is enabled (default: `true`)
     */
    useKeyboard?: boolean;
    /**
     * [KO] 3D 모델의 기본 회전 오프셋 각도 (단위: 도, 기본값: `0.0`)
     * [EN] Default rotation offset angle of the 3D model in degrees (default: `0.0`)
     */
    modelRotationOffset?: number;
    /**
     * [KO] 캐릭터 회전을 카메라 수평 방향(Yaw)에 항상 일치시킬지 여부 (기본값: `false`)
     * [EN] Whether to always align character rotation with camera yaw (default: `false`)
     */
    useControllerRotationYaw?: boolean;
    /**
     * [KO] 이동 방향으로 캐릭터 회전을 자동 정렬할지 여부 (기본값: `true`)
     * [EN] Whether to automatically orient character rotation toward the movement direction (default: `true`)
     */
    orientRotationToMovement?: boolean;
    /**
     * [KO] 지면 안착 시 추가로 적용할 수직 오프셋 (기본값: `0.0`)
     * [EN] Additional vertical offset applied when grounded (default: `0.0`)
     */
    floorOffset?: number;
    /**
     * [KO] 특정 `(x, z)` 좌표의 동적 지면 높이를 반환하는 콜백 함수
     * [EN] Callback function returning the dynamic floor height at `(x, z)` coordinates
     */
    getFloorHeight?: (x: number, z: number) => number;
    /**
     * [KO] 사용자 정의 키보드 입력 매핑
     * [EN] Custom keyboard input mapping
     */
    keyMap?: CharacterKeyMap;
}
/**
 * [KO] 3D 캐릭터의 키보드 기반 이동, 회전 보간, 점프 및 중력을 제어하는 컨트롤러 클래스입니다.
 * [EN] Controller class that handles keyboard-based movement, rotation interpolation, jumping, and gravity for a 3D character.
 *
 * [KO] 카메라 시점 기준 이동과 로컬 축 기준 이동을 모두 지원하며, `getFloorHeight` 콜백을 통해 지형 높이에 실시간으로 동기화할 수 있습니다.
 * [EN] Supports both camera-relative and local-axis movement, and can synchronize with terrain height in real time via the `getFloorHeight` callback.
 *
 * ### Example
 * ```typescript
 * const controller = new RedGPU.Charactor.SimpleCharacterController(
 *     redGPUContext,
 *     characterMesh,
 *     view.camera,
 *     { speed: 5.0, runSpeed: 10.0, jumpForce: 5.0 }
 * );
 * ```
 *
 * @see [Keyboard Character Control example](/RedGPU/examples/gltf/animation/keyboardCharacterControl/)
 * @see [Lake Character Walking example](/RedGPU/examples/3d/water/lake/characterWalking/)
 * @category Controller
 */
declare class SimpleCharacterController extends RedGPUObject {
    #private;
    /**
     * [KO] 기본 이동 속도
     * [EN] Default movement speed
     */
    speed: number;
    /**
     * [KO] 달리기 이동 속도
     * [EN] Running movement speed
     */
    runSpeed: number;
    /**
     * [KO] 회전 보간 속도
     * [EN] Rotation interpolation speed
     */
    rotationSpeed: number;
    /**
     * [KO] 중력 가속도
     * [EN] Gravity acceleration
     */
    gravity: number;
    /**
     * [KO] 점프 초기 속도
     * [EN] Initial jump velocity
     */
    jumpForce: number;
    /**
     * [KO] 기준 바닥 Y축 높이
     * [EN] Base floor Y-axis height
     */
    floorHeight: number;
    /**
     * [KO] 지면 안착 시 추가로 적용할 수직 오프셋 (기본값: `0.0`)
     * [EN] Additional vertical offset applied when grounded (default: `0.0`)
     */
    floorOffset: number;
    /**
     * [KO] 키보드 조작 활성화 여부
     * [EN] Whether keyboard control is enabled
     */
    useKeyboard: boolean;
    /**
     * [KO] 3D 모델의 기본 회전 오프셋 각도 (단위: 도)
     * [EN] Default rotation offset angle of the 3D model in degrees
     */
    modelRotationOffset: number;
    /**
     * [KO] 캐릭터 회전을 카메라 수평 방향(Yaw)에 항상 일치시킬지 여부
     * [EN] Whether to always align character rotation with camera yaw
     */
    useControllerRotationYaw: boolean;
    /**
     * [KO] 이동 방향으로 캐릭터 회전을 자동 정렬할지 여부
     * [EN] Whether to automatically orient character rotation toward the movement direction
     */
    orientRotationToMovement: boolean;
    /**
     * [KO] 특정 `(x, z)` 좌표의 동적 지면 높이를 반환하는 콜백 함수
     * [EN] Callback function returning the dynamic floor height at `(x, z)` coordinates
     */
    getFloorHeight: ((x: number, z: number) => number) | null;
    /**
     * [KO] 키보드 입력 매핑 설정 객체
     * [EN] Keyboard input mapping configuration object
     */
    keyMap: Required<CharacterKeyMap>;
    /**
     * [KO] `SimpleCharacterController` 인스턴스를 생성합니다.
     * [EN] Creates an instance of `SimpleCharacterController`.
     *
     * ### Example
     * ```typescript
     * const controller = new RedGPU.Charactor.SimpleCharacterController(
     *     redGPUContext,
     *     characterMesh,
     *     view.camera,
     *     { speed: 5.0, jumpForce: 5.0 }
     * );
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param targetMesh -
     * [KO] 제어할 대상 캐릭터 메시
     * [EN] Target character mesh to control
     * @param camera -
     * [KO] 이동 방향 기준이 되는 카메라 인스턴스
     * [EN] Camera instance used as the movement direction reference
     * @param options -
     * [KO] 캐릭터 컨트롤러 초기화 옵션
     * [EN] Character controller initialization options
     */
    constructor(redGPUContext: RedGPUContext, targetMesh: Mesh, camera: ACamera, options?: SimpleCharacterControllerOptions);
    /**
     * [KO] 제어 중인 대상 캐릭터 메시를 반환하거나 설정합니다.
     * [EN] Returns or sets the controlled target character mesh.
     *
     * @returns
     * [KO] 제어 중인 대상 메시
     * [EN] Controlled target mesh
     */
    get targetMesh(): Mesh;
    set targetMesh(value: Mesh);
    /**
     * [KO] 이동 방향 기준이 되는 카메라를 반환하거나 설정합니다.
     * [EN] Returns or sets the reference camera for movement direction.
     *
     * @returns
     * [KO] 기준 카메라 인스턴스
     * [EN] Reference camera instance
     */
    get camera(): ACamera;
    set camera(value: ACamera);
    /**
     * [KO] 캐릭터가 현재 이동 중인지 여부를 반환합니다.
     * [EN] Returns whether the character is currently moving.
     *
     * @returns
     * [KO] 이동 중 여부
     * [EN] Whether moving
     */
    get isMoving(): boolean;
    /**
     * [KO] 캐릭터가 현재 달리기 중인지 여부를 반환합니다.
     * [EN] Returns whether the character is currently running.
     *
     * @returns
     * [KO] 달리기 중 여부
     * [EN] Whether running
     */
    get isRunning(): boolean;
    /**
     * [KO] 캐릭터가 지면에 닿아 있는지 여부를 반환합니다.
     * [EN] Returns whether the character is on the ground.
     *
     * @returns
     * [KO] 지면 접지 여부
     * [EN] Whether grounded
     */
    get isGrounded(): boolean;
    /**
     * [KO] 매 프레임 캐릭터의 이동, 회전, 지면 고도 동기화 및 중력을 갱신합니다.
     * [EN] Updates character movement, rotation, floor height synchronization, and gravity each frame.
     *
     * ### Example
     * ```typescript
     * controller.update(view, timestamp);
     * ```
     *
     * @param view -
     * [KO] 현재 렌더링 중인 `View3D` 인스턴스
     * [EN] Currently rendering `View3D` instance
     * @param time -
     * [KO] 현재 렌더 루프 타임스탬프 (단위: ms)
     * [EN] Current render loop timestamp in milliseconds
     */
    update(view: View3D, time: number): void;
}
export default SimpleCharacterController;
