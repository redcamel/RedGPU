import {mat4} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import RedGPUObject from "../base/RedGPUObject";
import Mesh from "../display/mesh/Mesh";
import ACamera from "../camera/core/ACamera";
import View3D from "../display/view/View3D";

const tempMat4 = mat4.create();

/**
 * [KO] 캐릭터 컨트롤러의 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for CharacterController.
 */
export interface CharacterControllerOptions {
    /** [KO] 이동 속도 (기본값: 5.0) [EN] Movement speed (default: 5.0) */
    speed?: number;
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
    /** [KO] 모델 자체의 기본 회전 오프셋 각도 (도 단위, 기본값: 180.0) [EN] Model's default rotation offset angle (in degrees, default: 180.0) */
    modelRotationOffset?: number;
}

/**
 * [KO] 3D 캐릭터의 움직임과 회전을 제어하는 캐릭터 컨트롤러 클래스입니다.
 * [EN] Character controller class that controls the movement and rotation of a 3D character.
 *
 * [KO] 카메라 뷰 방향에 맞춘 이동(WASD) 및 자연스러운 선회 회전, 그리고 점프 및 낙하 중력을 단독으로 구현합니다.
 * [EN] Implements camera-relative movement (WASD), smooth rotation interpolation, and jump/fall gravity independently.
 *
 * @category Controller
 */
class CharacterController extends RedGPUObject {
    // 조작 속성
    public speed: number;
    public rotationSpeed: number;
    public gravity: number;
    public jumpForce: number;
    public floorHeight: number;
    public useKeyboard: boolean;
    public modelRotationOffset: number;
    /** [KO] 조종할 대상 메시 [EN] Target mesh to control */
    #targetMesh: Mesh;
    /** [KO] 방향 기준으로 삼을 카메라 [EN] Camera used as orientation reference */
    #camera: ACamera;
    // 물리 상태 변수
    #velocityY: number = 0;
    #isGrounded: boolean = true;
    #lastUpdateTime: number = -1;
    #currentDeltaTime: number = 0;

    /**
     * [KO] CharacterController 인스턴스를 생성합니다.
     * [EN] Creates an instance of CharacterController.
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
        options: CharacterControllerOptions = {}
    ) {
        super(redGPUContext);

        if (!targetMesh) throw new Error("CharacterController: targetMesh is required.");
        if (!camera) throw new Error("CharacterController: camera is required.");

        this.#targetMesh = targetMesh;
        this.#camera = camera;

        this.speed = options.speed ?? 5.0;
        this.rotationSpeed = options.rotationSpeed ?? 8.0;
        this.gravity = options.gravity ?? 9.8;
        this.jumpForce = options.jumpForce ?? 5.0;
        this.floorHeight = options.floorHeight ?? 0.0;
        this.useKeyboard = options.useKeyboard ?? true;
        this.modelRotationOffset = options.modelRotationOffset ?? 180.0;
    }

    // ==================== Getters / Setters ====================

    /** [KO] 제어 중인 대상 메시를 반환합니다. [EN] Returns the controlled target mesh. */
    get targetMesh(): Mesh {
        return this.#targetMesh;
    }

    /** [KO] 제어 중인 대상 메시를 설정합니다. [EN] Sets the controlled target mesh. */
    set targetMesh(value: Mesh) {
        if (!value) throw new Error("CharacterController: targetMesh cannot be null or undefined");
        this.#targetMesh = value;
    }

    /** [KO] 방향 기준 카메라를 반환합니다. [EN] Returns the reference camera. */
    get camera(): ACamera {
        return this.#camera;
    }

    /** [KO] 방향 기준 카메라를 설정합니다. [EN] Sets the reference camera. */
    set camera(value: ACamera) {
        if (!value) throw new Error("CharacterController: camera cannot be null or undefined");
        this.#camera = value;
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
        if (!this.useKeyboard) return;

        const keyboardKeyBuffer = view.redGPUContext.keyboardKeyBuffer;
        if (!keyboardKeyBuffer) return;

        // W, S, A, D 및 방향키 입력값 수집
        const forwardInput = (keyboardKeyBuffer['w'] || keyboardKeyBuffer['W'] || keyboardKeyBuffer['arrowup'] || keyboardKeyBuffer['ArrowUp'] ? 1 : 0) -
            (keyboardKeyBuffer['s'] || keyboardKeyBuffer['S'] || keyboardKeyBuffer['arrowdown'] || keyboardKeyBuffer['ArrowDown'] ? 1 : 0);
        const rightInput = (keyboardKeyBuffer['d'] || keyboardKeyBuffer['D'] || keyboardKeyBuffer['arrowright'] || keyboardKeyBuffer['ArrowRight'] ? 1 : 0) -
            (keyboardKeyBuffer['a'] || keyboardKeyBuffer['A'] || keyboardKeyBuffer['arrowleft'] || keyboardKeyBuffer['ArrowLeft'] ? 1 : 0);

        if (forwardInput === 0 && rightInput === 0) return;

        // 카메라 객체 추출 (컨트롤러인 경우 실제 카메라를 획득)
        const actualCamera = (this.#camera as any).camera || this.#camera;

        // 카메라의 뷰 매트릭스 획득
        const viewMatrix = actualCamera.viewMatrix;
        if (!viewMatrix) return;

        // 뷰 매트릭스의 역행렬(카메라 월드 행렬) 구하기
        mat4.invert(tempMat4, viewMatrix);

        // 월드 행렬(tempMat4)의 열(Column) 성분으로부터 카메라의 실제 월드 우측/전방 방향 추출
        // 우측 벡터 (Right Vector): 1번째 열 (X축) -> tempMat4[0], tempMat4[2]
        const rx = tempMat4[0];
        const rz = tempMat4[2];

        // 전방 벡터 (Forward Vector): 3번째 열 (Z축)의 반대 -> -tempMat4[8], -tempMat4[10]
        const fx = -tempMat4[8];
        const fz = -tempMat4[10];

        // Y축 성분을 제거한 수평면 벡터 크기 정형화
        const rLen = Math.sqrt(rx * rx + rz * rz);
        const rightX = rLen > 0 ? rx / rLen : 0;
        const rightZ = rLen > 0 ? rz / rLen : 0;

        const fLen = Math.sqrt(fx * fx + fz * fz);
        const forwardX = fLen > 0 ? fx / fLen : 0;
        const forwardZ = fLen > 0 ? fz / fLen : 0;

        // 최종 이동 방향 벡터 결합
        const moveX = (forwardX * forwardInput) + (rightX * rightInput);
        const moveZ = (forwardZ * forwardInput) + (rightZ * rightInput);

        const moveLen = Math.sqrt(moveX * moveX + moveZ * moveZ);
        if (moveLen > 0) {
            const dx = (moveX / moveLen) * this.speed * dt;
            const dz = (moveZ / moveLen) * this.speed * dt;

            // 캐릭터 위치 업데이트
            this.#targetMesh.x += dx;
            this.#targetMesh.z += dz;

            // 이동 벡터 기준의 타겟 각도(도 단위) 구하기
            // RedGPU는 -Z축 방향이 캐릭터 정면이므로 이에 맞추어 각도 오프셋 계산 (+ 모델 자체의 오프셋 반영)
            const targetAngle = Math.atan2(moveX, moveZ) * (180 / Math.PI) + this.modelRotationOffset;

            // 캐릭터 회전 처리 (최단 방향 선회 보간)
            let currentAngle = this.#targetMesh.rotationY ?? 0;
            let angleDiff = targetAngle - currentAngle;

            while (angleDiff < -180) angleDiff += 360;
            while (angleDiff > 180) angleDiff -= 360;

            this.#targetMesh.rotationY = currentAngle + angleDiff * this.rotationSpeed * dt;
        }
    }

    /**
     * [KO] 중력, 수직 축 점프 및 지면 안착 로직을 수행합니다.
     * [EN] Performs gravity, vertical jumping, and ground landing logic.
     */
    #updateGravity(view: View3D, dt: number): void {
        const keyboardKeyBuffer = view.redGPUContext.keyboardKeyBuffer;

        // 1. 점프 입력 감지 (Space 키가 눌렸고 접지 상태일 때)
        if (this.useKeyboard && keyboardKeyBuffer && keyboardKeyBuffer[' '] && this.#isGrounded) {
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

export default CharacterController;
