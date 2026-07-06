import {mat4} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import RedGPUObject from "../base/RedGPUObject";
import Mesh from "../display/mesh/Mesh";
import ACamera from "../camera/core/ACamera";
import View3D from "../display/view/View3D";

const tempMat4 = mat4.create();

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
class SimpleCharacterController extends RedGPUObject {
    // 조작 속성
    public speed: number;
    public runSpeed: number;
    public rotationSpeed: number;
    public gravity: number;
    public jumpForce: number;
    public floorHeight: number;
    public useKeyboard: boolean;
    public modelRotationOffset: number;
    public useControllerRotationYaw: boolean;
    public orientRotationToMovement: boolean;
    public keyMap: Required<CharacterKeyMap>;
    /** [KO] 조종할 대상 메시 [EN] Target mesh to control */
    #targetMesh: Mesh;
    /** [KO] 방향 기준으로 삼을 카메라 [EN] Camera used as orientation reference */
    #camera: ACamera;
    // 물리 상태 변수
    #isMoving: boolean = false;
    #isRunning: boolean = false;
    #velocityY: number = 0;
    #isGrounded: boolean = true;
    #lastUpdateTime: number = -1;
    #currentDeltaTime: number = 0;

    /**
     * [KO] SimpleCharacterController 인스턴스를 생성합니다.
     * [EN] Creates an instance of SimpleCharacterController.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     * @param targetMesh - [KO] 제어할 캐릭터 메시 [EN] Character mesh to control
     * @param camera - [KO] 카메라 인스턴스 [EN] Camera instance
     * @param options - [KO] 캐릭터 설정 옵션 [EN] Character settings options
     */
    constructor(
        redGPUContext: RedGPUContext,
        targetMesh: Mesh,
        camera: ACamera,
        options: SimpleCharacterControllerOptions = {}
    ) {
        super(redGPUContext);

        if (!targetMesh) throw new Error("SimpleCharacterController: targetMesh is required.");
        if (!camera) throw new Error("SimpleCharacterController: camera is required.");

        this.#targetMesh = targetMesh;
        this.#camera = camera;

        this.speed = options.speed ?? 5.0;
        this.runSpeed = options.runSpeed ?? (this.speed * 2);
        this.rotationSpeed = options.rotationSpeed ?? 8.0;
        this.gravity = options.gravity ?? 9.8;
        this.jumpForce = options.jumpForce ?? 5.0;
        this.floorHeight = options.floorHeight ?? 0.0;
        this.useKeyboard = options.useKeyboard ?? true;
        this.modelRotationOffset = options.modelRotationOffset ?? 0.0;
        this.useControllerRotationYaw = options.useControllerRotationYaw ?? false;
        this.orientRotationToMovement = options.orientRotationToMovement ?? true;

        // 최초 컨트롤러 주입 시, 3D 모델의 방향각 오차(modelRotationOffset)를 실제 메쉬 회전각에 선행 가산하여 정렬합니다.
        this.#targetMesh.rotationY += this.modelRotationOffset;

        this.keyMap = {
            moveForward: options.keyMap?.moveForward ?? ['w', 'W', 'arrowup', 'ArrowUp'],
            moveBackward: options.keyMap?.moveBackward ?? ['s', 'S', 'arrowdown', 'ArrowDown'],
            strafeLeft: options.keyMap?.strafeLeft ?? ['a', 'A', 'arrowleft', 'ArrowLeft'],
            strafeRight: options.keyMap?.strafeRight ?? ['d', 'D', 'arrowright', 'ArrowRight'],
            turnLeft: options.keyMap?.turnLeft ?? ['q', 'Q'],
            turnRight: options.keyMap?.turnRight ?? ['e', 'E'],
            jump: options.keyMap?.jump ?? [' '],
            run: options.keyMap?.run ?? ['shift', 'Shift']
        };
    }

    // ==================== Getters / Setters ====================

    /** [KO] 제어 중인 대상 메시를 반환합니다. [EN] Returns the controlled target mesh. */
    get targetMesh(): Mesh {
        return this.#targetMesh;
    }

    /** [KO] 제어 중인 대상 메시를 설정합니다. [EN] Sets the controlled target mesh. */
    set targetMesh(value: Mesh) {
        if (!value) throw new Error("SimpleCharacterController: targetMesh cannot be null or undefined");
        this.#targetMesh = value;
    }

    /** [KO] 방향 기준 카메라를 반환합니다. [EN] Returns the reference camera. */
    get camera(): ACamera {
        return this.#camera;
    }

    /** [KO] 방향 기준 카메라를 설정합니다. [EN] Sets the reference camera. */
    set camera(value: ACamera) {
        if (!value) throw new Error("SimpleCharacterController: camera cannot be null or undefined");
        this.#camera = value;
    }

    /** [KO] 캐릭터가 현재 이동(WASD 입력) 중인지 여부를 반환합니다. [EN] Returns whether the character is currently moving. */
    get isMoving(): boolean {
        return this.#isMoving;
    }

    /** [KO] 캐릭터가 현재 달리기(Shift 조합 입력) 중인지 여부를 반환합니다. [EN] Returns whether the character is currently running. */
    get isRunning(): boolean {
        return this.#isRunning;
    }

    /** [KO] 지면에 닿아있는지 여부를 반환합니다. [EN] Returns whether the character is on the ground. */
    get isGrounded(): boolean {
        return this.#isGrounded;
    }

    // ==================== Public Methods ====================

    /**
     * [KO] 매 프레임 업데이트 루프를 수행합니다.
     * [EN] Performs the update loop per frame.
     *
     * @param view - [KO] 현재 View3D 인스턴스 [EN] Current View3D instance
     * @param time - [KO] 현재 렌더 타임스탬프 (ms) [EN] Current render timestamp (ms)
     */
    public update(view: View3D, time: number): void {
        if (!this.#targetMesh) return;

        // 1. DeltaTime 계산 (초 단위)
        if (this.#lastUpdateTime !== time) {
            this.#currentDeltaTime = this.#lastUpdateTime === -1 ? 0 : (time - this.#lastUpdateTime) / 1000;
            this.#lastUpdateTime = time;
        }

        // 아주 긴 프레임 스파이크 방지
        const dt = Math.min(this.#currentDeltaTime, 0.1);

        // 2. 이동 및 회전 업데이트
        this.#updateMovementAndRotation(view, dt);

        // 3. 중력 및 수직 충돌 업데이트
        this.#updateGravity(view, dt);
    }

    // ==================== Private Methods ====================

    /**
     * [KO] 입력 처리 및 카메라 상대 이동/회전을 반영합니다.
     * [EN] Processes inputs and applies camera-relative movement and rotation.
     */
    #updateMovementAndRotation(view: View3D, dt: number): void {
        if (!this.useKeyboard) {
            this.#isMoving = false;
            this.#isRunning = false;
            return;
        }

        const keyboardKeyBuffer = view.redGPUContext.keyboardKeyBuffer;
        if (!keyboardKeyBuffer) {
            this.#isMoving = false;
            this.#isRunning = false;
            return;
        }


        // 특정 기능에 할당된 키 목록 중 하나라도 입력되었는지 판단하는 헬퍼 함수
        const hasKey = (keys: string[]): boolean => keys.some(key => keyboardKeyBuffer[key]);

        // 카메라 객체 안전 검출
        const actualCamera = ('camera' in this.#camera) ? (this.#camera as any).camera : this.#camera;
        const hasCamera = !!(actualCamera && actualCamera.viewMatrix);

        let cameraYawDeg = 0;
        let viewMatrix: mat4 | null = null;
        if (hasCamera) {
            viewMatrix = actualCamera.viewMatrix;

            // 카메라 수평 정면 벡터 추출
            let camForwardX = -viewMatrix[2];
            let camForwardZ = -viewMatrix[10];
            const lenF = Math.sqrt(camForwardX * camForwardX + camForwardZ * camForwardZ);
            if (lenF > 0.0001) {
                camForwardX /= lenF;
                camForwardZ /= lenF;
            } else {
                camForwardX = 0;
                camForwardZ = -1;
            }

            // 카메라의 수평 방향각(Yaw) 산출 (도 단위)
            const cameraYawRad = Math.atan2(-camForwardX, -camForwardZ);
            cameraYawDeg = cameraYawRad * (180 / Math.PI);
        }

        // 1. 회전 입력 처리 (Turn Left / Turn Right - 기존 수동 회전도 허용)
        const turnInput = (hasKey(this.keyMap.turnLeft) ? 1 : 0) -
            (hasKey(this.keyMap.turnRight) ? 1 : 0);
        if (turnInput !== 0) {
            // 회전 속도에 비례하여 Y축 회전 변경 (도 단위)
            this.#targetMesh.rotationY += turnInput * this.rotationSpeed * 10 * dt;
        }

        // Use Controller Rotation Yaw 가 true일 때 캐릭터 회전을 카메라 방향과 스무스하게 실시간 정렬
        if (this.useControllerRotationYaw && hasCamera && viewMatrix) {
            const desiredRotationY = cameraYawDeg - this.modelRotationOffset;
            let diff = (desiredRotationY - this.#targetMesh.rotationY) % 360;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;

            const factor = 1 - Math.exp(-this.rotationSpeed * dt);
            this.#targetMesh.rotationY += diff * factor;
        }

        // 2. 이동 입력값 수집 (전진/후진/횡이동)
        const forwardInput = (hasKey(this.keyMap.moveForward) ? 1 : 0) -
            (hasKey(this.keyMap.moveBackward) ? 1 : 0);
        const rightInput = (hasKey(this.keyMap.strafeRight) ? 1 : 0) -
            (hasKey(this.keyMap.strafeLeft) ? 1 : 0);

        // 이동 상태 및 달리기 상태 판정
        this.#isMoving = (forwardInput !== 0 || rightInput !== 0);
        this.#isRunning = this.#isMoving && hasKey(this.keyMap.run);

        if (!this.#isMoving) return;

        let moveX = 0;
        let moveZ = 0;

        // 카메라 기반 조작 모드 (orientRotationToMovement 또는 useControllerRotationYaw 가 켜져 있을 때)
        if (hasCamera && viewMatrix && (this.orientRotationToMovement || this.useControllerRotationYaw)) {
            // 카메라 기준 수평 앞 방향 벡터
            let camForwardX = -viewMatrix[2];
            let camForwardZ = -viewMatrix[10];
            const lenF = Math.sqrt(camForwardX * camForwardX + camForwardZ * camForwardZ);
            if (lenF > 0.0001) {
                camForwardX /= lenF;
                camForwardZ /= lenF;
            } else {
                camForwardX = 0;
                camForwardZ = -1;
            }

            // 카메라 기준 수평 오른쪽 방향 벡터
            let camRightX = viewMatrix[0];
            let camRightZ = viewMatrix[8];
            const lenR = Math.sqrt(camRightX * camRightX + camRightZ * camRightZ);
            if (lenR > 0.0001) {
                camRightX /= lenR;
                camRightZ /= lenR;
            } else {
                camRightX = 1;
                camRightZ = 0;
            }

            // 최종 이동 방향 벡터 결합
            moveX = (camForwardX * forwardInput) + (camRightX * rightInput);
            moveZ = (camForwardZ * forwardInput) + (camRightZ * rightInput);
        } else {
            // 레거시/탱크 조작 모드 (캐릭터 로컬 기준 이동)
            const yawAngle = (this.#targetMesh.rotationY + this.modelRotationOffset) * (Math.PI / 180);
            const fx = -Math.sin(yawAngle);
            const fz = -Math.cos(yawAngle);
            const rx = Math.cos(yawAngle);
            const rz = -Math.sin(yawAngle);

            moveX = (fx * forwardInput) + (rx * rightInput);
            moveZ = (fz * forwardInput) + (rz * rightInput);
        }

        const moveLen = Math.sqrt(moveX * moveX + moveZ * moveZ);
        if (moveLen > 0) {
            const currentSpeed = this.#isRunning ? this.runSpeed : this.speed;
            const dx = (moveX / moveLen) * currentSpeed * dt;
            const dz = (moveZ / moveLen) * currentSpeed * dt;

            // 캐릭터 위치 업데이트
            this.#targetMesh.x += dx;
            this.#targetMesh.z += dz;

            // Orient Rotation to Movement 회전 보간 처리 (useControllerRotationYaw 가 꺼져있고 orientRotationToMovement 가 켜져 있을 때만 적용)
            if (!this.useControllerRotationYaw && this.orientRotationToMovement) {
                const targetYawRad = Math.atan2(-moveX, -moveZ);
                const targetYawDeg = targetYawRad * (180 / Math.PI);
                const desiredRotationY = targetYawDeg - this.modelRotationOffset;

                // 360도 보정 및 최단 경로 회전 보간
                let diff = (desiredRotationY - this.#targetMesh.rotationY) % 360;
                if (diff > 180) diff -= 360;
                if (diff < -180) diff += 360;

                const factor = 1 - Math.exp(-this.rotationSpeed * dt);
                this.#targetMesh.rotationY += diff * factor;
            }
        }
    }

    /**
     * [KO] 중력, 수직 축 점프 및 지면 안착 로직을 수행합니다.
     * [EN] Performs gravity, vertical jumping, and ground landing logic.
     */
    #updateGravity(view: View3D, dt: number): void {
        const keyboardKeyBuffer = view.redGPUContext.keyboardKeyBuffer;
        if (!keyboardKeyBuffer) return;

        // 1. 점프 입력 감지 (점프 키가 눌렸고 접지 상태일 때)
        const hasJumpKey = this.keyMap.jump.some(key => keyboardKeyBuffer[key]);
        if (this.useKeyboard && hasJumpKey && this.#isGrounded) {
            this.#velocityY = this.jumpForce;
            this.#isGrounded = false;
        }

        // 2. 공중 상태 시 중력 가속도 누적
        if (!this.#isGrounded) {
            this.#velocityY -= this.gravity * dt;
        }

        // 3. Y 좌표 이동 반영
        this.#targetMesh.y += this.#velocityY * dt;

        // 4. 지면 충돌 체크 및 강제 고정
        if (this.#targetMesh.y <= this.floorHeight) {
            this.#targetMesh.y = this.floorHeight;
            this.#velocityY = 0;
            this.#isGrounded = true;
        }
    }
}

export default SimpleCharacterController;
