import {mat4} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import RedGPUObject from "../base/RedGPUObject";
import Mesh from "../display/mesh/Mesh";
import ACamera from "../camera/core/ACamera";
import View3D from "../display/view/View3D";

const tempMat4 = mat4.create();

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
class SimpleCharacterController extends RedGPUObject {
    /**
     * [KO] 기본 이동 속도
     * [EN] Default movement speed
     */
    public speed: number;
    /**
     * [KO] 달리기 이동 속도
     * [EN] Running movement speed
     */
    public runSpeed: number;
    /**
     * [KO] 회전 보간 속도
     * [EN] Rotation interpolation speed
     */
    public rotationSpeed: number;
    /**
     * [KO] 중력 가속도
     * [EN] Gravity acceleration
     */
    public gravity: number;
    /**
     * [KO] 점프 초기 속도
     * [EN] Initial jump velocity
     */
    public jumpForce: number;
    /**
     * [KO] 기준 바닥 Y축 높이
     * [EN] Base floor Y-axis height
     */
    public floorHeight: number;
    /**
     * [KO] 지면 안착 시 추가로 적용할 수직 오프셋 (기본값: `0.0`)
     * [EN] Additional vertical offset applied when grounded (default: `0.0`)
     */
    public floorOffset: number = 0.0;
    /**
     * [KO] 키보드 조작 활성화 여부
     * [EN] Whether keyboard control is enabled
     */
    public useKeyboard: boolean;
    /**
     * [KO] 3D 모델의 기본 회전 오프셋 각도 (단위: 도)
     * [EN] Default rotation offset angle of the 3D model in degrees
     */
    public modelRotationOffset: number;
    /**
     * [KO] 캐릭터 회전을 카메라 수평 방향(Yaw)에 항상 일치시킬지 여부
     * [EN] Whether to always align character rotation with camera yaw
     */
    public useControllerRotationYaw: boolean;
    /**
     * [KO] 이동 방향으로 캐릭터 회전을 자동 정렬할지 여부
     * [EN] Whether to automatically orient character rotation toward the movement direction
     */
    public orientRotationToMovement: boolean;
    /**
     * [KO] 특정 `(x, z)` 좌표의 동적 지면 높이를 반환하는 콜백 함수
     * [EN] Callback function returning the dynamic floor height at `(x, z)` coordinates
     */
    public getFloorHeight: ((x: number, z: number) => number) | null = null;
    /**
     * [KO] 키보드 입력 매핑 설정 객체
     * [EN] Keyboard input mapping configuration object
     */
    public keyMap: Required<CharacterKeyMap>;
    #targetMesh: Mesh;
    #camera: ACamera;
    #isMoving: boolean = false;
    #isRunning: boolean = false;
    #velocityY: number = 0;
    #isGrounded: boolean = true;
    #lastUpdateTime: number = -1;
    #currentDeltaTime: number = 0;

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
        this.floorOffset = options.floorOffset ?? 0.0;
        this.getFloorHeight = options.getFloorHeight ?? null;
        this.useKeyboard = options.useKeyboard ?? true;
        this.modelRotationOffset = options.modelRotationOffset ?? 0.0;
        this.useControllerRotationYaw = options.useControllerRotationYaw ?? false;
        this.orientRotationToMovement = options.orientRotationToMovement ?? true;

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

    /**
     * [KO] 제어 중인 대상 캐릭터 메시를 반환하거나 설정합니다.
     * [EN] Returns or sets the controlled target character mesh.
     *
     * @returns
     * [KO] 제어 중인 대상 메시
     * [EN] Controlled target mesh
     */
    get targetMesh(): Mesh {
        return this.#targetMesh;
    }

    set targetMesh(value: Mesh) {
        if (!value) throw new Error("SimpleCharacterController: targetMesh cannot be null or undefined");
        this.#targetMesh = value;
    }

    /**
     * [KO] 이동 방향 기준이 되는 카메라를 반환하거나 설정합니다.
     * [EN] Returns or sets the reference camera for movement direction.
     *
     * @returns
     * [KO] 기준 카메라 인스턴스
     * [EN] Reference camera instance
     */
    get camera(): ACamera {
        return this.#camera;
    }

    set camera(value: ACamera) {
        if (!value) throw new Error("SimpleCharacterController: camera cannot be null or undefined");
        this.#camera = value;
    }

    /**
     * [KO] 캐릭터가 현재 이동 중인지 여부를 반환합니다.
     * [EN] Returns whether the character is currently moving.
     *
     * @returns
     * [KO] 이동 중 여부
     * [EN] Whether moving
     */
    get isMoving(): boolean {
        return this.#isMoving;
    }

    /**
     * [KO] 캐릭터가 현재 달리기 중인지 여부를 반환합니다.
     * [EN] Returns whether the character is currently running.
     *
     * @returns
     * [KO] 달리기 중 여부
     * [EN] Whether running
     */
    get isRunning(): boolean {
        return this.#isRunning;
    }

    /**
     * [KO] 캐릭터가 지면에 닿아 있는지 여부를 반환합니다.
     * [EN] Returns whether the character is on the ground.
     *
     * @returns
     * [KO] 지면 접지 여부
     * [EN] Whether grounded
     */
    get isGrounded(): boolean {
        return this.#isGrounded;
    }

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
    public update(view: View3D, time: number): void {
        if (!this.#targetMesh) return;

        if (this.#lastUpdateTime !== time) {
            this.#currentDeltaTime = this.#lastUpdateTime === -1 ? 0 : (time - this.#lastUpdateTime) / 1000;
            this.#lastUpdateTime = time;
        }

        const dt = Math.min(this.#currentDeltaTime, 0.1);

        this.#updateMovementAndRotation(view, dt);

        if (this.getFloorHeight) {
            const newFloor = this.getFloorHeight(this.#targetMesh.x, this.#targetMesh.z);
            if (typeof newFloor === 'number' && Number.isFinite(newFloor)) {
                this.floorHeight = newFloor + this.floorOffset;
            }
        }

        if (this.#targetMesh.rotationX !== 0) this.#targetMesh.rotationX = 0;
        if (this.#targetMesh.rotationZ !== 0) this.#targetMesh.rotationZ = 0;

        this.#updateGravity(view, dt);
    }

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

        const hasKey = (keys: string[]): boolean => keys.some(key => keyboardKeyBuffer[key]);

        const actualCamera = ('camera' in this.#camera) ? (this.#camera as any).camera : this.#camera;
        const hasCamera = !!(actualCamera && actualCamera.viewMatrix);

        let cameraYawDeg = 0;
        let viewMatrix: mat4 | null = null;
        if (hasCamera) {
            viewMatrix = actualCamera.viewMatrix;

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

            const cameraYawRad = Math.atan2(-camForwardX, -camForwardZ);
            cameraYawDeg = cameraYawRad * (180 / Math.PI);
        }

        const turnInput = (hasKey(this.keyMap.turnLeft) ? 1 : 0) -
            (hasKey(this.keyMap.turnRight) ? 1 : 0);
        if (turnInput !== 0) {
            this.#targetMesh.rotationY += turnInput * this.rotationSpeed * 10 * dt;
        }

        if (this.useControllerRotationYaw && hasCamera && viewMatrix) {
            const desiredRotationY = cameraYawDeg - this.modelRotationOffset;
            let diff = (desiredRotationY - this.#targetMesh.rotationY) % 360;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;

            const factor = 1 - Math.exp(-this.rotationSpeed * dt);
            this.#targetMesh.rotationY += diff * factor;
        }

        const forwardInput = (hasKey(this.keyMap.moveForward) ? 1 : 0) -
            (hasKey(this.keyMap.moveBackward) ? 1 : 0);
        const rightInput = (hasKey(this.keyMap.strafeRight) ? 1 : 0) -
            (hasKey(this.keyMap.strafeLeft) ? 1 : 0);

        this.#isMoving = (forwardInput !== 0 || rightInput !== 0);
        this.#isRunning = this.#isMoving && hasKey(this.keyMap.run);

        if (!this.#isMoving) return;

        let moveX = 0;
        let moveZ = 0;

        if (hasCamera && viewMatrix && (this.orientRotationToMovement || this.useControllerRotationYaw)) {
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

            moveX = (camForwardX * forwardInput) + (camRightX * rightInput);
            moveZ = (camForwardZ * forwardInput) + (camRightZ * rightInput);
        } else {
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

            this.#targetMesh.x += dx;
            this.#targetMesh.z += dz;

            if (!this.useControllerRotationYaw && this.orientRotationToMovement) {
                const targetYawRad = Math.atan2(-moveX, -moveZ);
                const targetYawDeg = targetYawRad * (180 / Math.PI);
                const desiredRotationY = targetYawDeg - this.modelRotationOffset;

                let diff = (desiredRotationY - this.#targetMesh.rotationY) % 360;
                if (diff > 180) diff -= 360;
                if (diff < -180) diff += 360;

                const factor = 1 - Math.exp(-this.rotationSpeed * dt);
                this.#targetMesh.rotationY += diff * factor;
            }
        }
    }

    #updateGravity(view: View3D, dt: number): void {
        const keyboardKeyBuffer = view.redGPUContext.keyboardKeyBuffer;
        if (!keyboardKeyBuffer) return;

        const hasJumpKey = this.keyMap.jump.some(key => keyboardKeyBuffer[key]);
        if (this.useKeyboard && hasJumpKey && this.#isGrounded) {
            this.#velocityY = this.jumpForce;
            this.#isGrounded = false;
        }

        if (!this.#isGrounded) {
            this.#velocityY -= this.gravity * dt;
        }

        this.#targetMesh.y += this.#velocityY * dt;

        if (this.#targetMesh.y <= this.floorHeight) {
            this.#targetMesh.y = this.floorHeight;
            this.#velocityY = 0;
            this.#isGrounded = true;
        } else if (this.#isGrounded) {
            this.#targetMesh.y = this.floorHeight;
            this.#velocityY = 0;
        } else if (this.#velocityY <= 0) {
            this.#isGrounded = false;
        }
    }
}

export default SimpleCharacterController;
