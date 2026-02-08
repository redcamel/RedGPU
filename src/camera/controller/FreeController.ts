import {mat4, vec3} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import updateObject3DMatrix from "../../math/updateObject3DMatrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import AController from "../core/AController";

// ==================== 모듈 레벨 상수 ====================
const PER_PI = Math.PI / 180;

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
class FreeController extends AController {
    // ==================== 키 매핑 (Unreal Engine Standard) ====================
    #keyNameMapper: KeyNameMapper = {
        moveForward: 'w',
        moveBack: 's',
        moveLeft: 'a',
        moveRight: 'd',
        moveUp: 'e',
        moveDown: 'q',
        turnLeft: 'z',
        turnRight: 'c',
        turnUp: 'r',
        turnDown: 'f'
    };
    // ==================== 이동 관련 설정 ====================
    #moveSpeed: number = 600;
    #moveDelayInterpolation: number = 0.001;
    #maxAcceleration: number = 1;
    #currentAcceleration: number = 0;
    // ==================== 회전 관련 설정 ====================
    #rotationSpeed: number = 360;
    #rotationInterpolation: number = 0.001;
    #mouseSensitivity: number = 0.15;
    // ==================== 위치 및 회전 상태 ====================
    #desirePosition: [number, number, number] = [0, 0, 0];
    #pan: number = 0;
    #tilt: number = 0;
    #targetMesh: Mesh;

    // ==================== 내부 계산용 속성 (인스턴스 안전성 확보) ====================
    #tMTX0 = mat4.create();
    #displacementMTX = mat4.create();
    #displacementVec3 = vec3.create();

    /**
     * [KO] FreeController 인스턴스를 생성합니다.
     * [EN] Creates an instance of FreeController.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 객체
     * [EN] RedGPU Context object
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            {
                HD_Move: (deltaX: number, deltaY: number) => {
                    this.#pan -= deltaX * this.#mouseSensitivity;
                    this.#tilt -= deltaY * this.#mouseSensitivity;
                },
                useKeyboard: true
            });
        this.#initListener();
    }

    // ==================== 위치(Position) Getter/Setter ====================
    /** [KO] X축 위치 [EN] X-axis position */
    get x(): number { return this.#targetMesh.x; }
    set x(value: number) { validateNumber(value); this.#targetMesh.x = value; this.#desirePosition[0] = value; }

    /** [KO] Y축 위치 [EN] Y-axis position */
    get y(): number { return this.#targetMesh.y; }
    set y(value: number) { validateNumber(value); this.#targetMesh.y = value; this.#desirePosition[1] = value; }

    /** [KO] Z축 위치 [EN] Z-axis position */
    get z(): number { return this.#targetMesh.z; }
    set z(value: number) { validateNumber(value); this.#targetMesh.z = value; this.#desirePosition[2] = value; }


    // ==================== 회전(Rotation) Getter/Setter ====================
    /** [KO] 좌우 회전 각도 (도) [EN] Horizontal rotation angle (Pan) in degrees */
    get pan(): number { return this.#pan; }
    set pan(value: number) { validateNumber(value); this.#pan = value; }

    /** [KO] 상하 회전 각도 (도) [EN] Vertical rotation angle (Tilt) in degrees */
    get tilt(): number { return this.#tilt; }
    set tilt(value: number) { validateNumber(value); this.#tilt = Math.max(-89.9, Math.min(89.9, value)); }

    /** [KO] 마우스 감도 [EN] Mouse rotation sensitivity */
    get mouseSensitivity(): number { return this.#mouseSensitivity; }
    set mouseSensitivity(value: number) { validateNumberRange(value, 0.01); this.#mouseSensitivity = value; }

    // ==================== 이동 속도 및 보간 설정 ====================
    /** [KO] 이동 속도 [EN] Movement speed */
    get moveSpeed(): number { return this.#moveSpeed; }
    set moveSpeed(value: number) { validateNumberRange(value, 0.01); this.#moveSpeed = value; }

    /** [KO] 이동 보간 계수 [EN] Movement interpolation factor */
    get moveSpeedInterpolation(): number { return this.#moveDelayInterpolation; }
    set moveSpeedInterpolation(value: number) { validateNumberRange(value, 0.0001, 1); this.#moveDelayInterpolation = value; }

    /** [KO] 회전 속도 [EN] Rotation speed */
    get rotationSpeed(): number { return this.#rotationSpeed; }
    set rotationSpeed(value: number) { validateNumberRange(value, 0.01); this.#rotationSpeed = value; }

    /** [KO] 회전 보간 계수 [EN] Rotation interpolation factor */
    get rotationSpeedInterpolation(): number { return this.#rotationInterpolation; }
    set rotationSpeedInterpolation(value: number) { validateNumberRange(value, 0.0001, 1); this.#rotationInterpolation = value; }

    /** [KO] 최대 가속도 배율 [EN] Maximum acceleration scale */
    get maxAcceleration(): number { return this.#maxAcceleration; }
    set maxAcceleration(value: number) { this.#maxAcceleration = value; }

    /** [KO] 키 매핑 설정 객체 [EN] Key mapping configuration object */
    get keyNameMapper(): KeyNameMapper { return {...this.#keyNameMapper}; }

    // ==================== 키 매핑 설정 메서드 ====================
    /** [KO] 전진 키 설정 [EN] Sets the move forward key */
    setMoveForwardKey(value: string) { this.#keyNameMapper.moveForward = value; }
    /** [KO] 후진 키 설정 [EN] Sets the move backward key */
    setMoveBackKey(value: string) { this.#keyNameMapper.moveBack = value; }
    /** [KO] 좌측 이동 키 설정 [EN] Sets the move left key */
    setMoveLeftKey(value: string) { this.#keyNameMapper.moveLeft = value; }
    /** [KO] 우측 이동 키 설정 [EN] Sets the move right key */
    setMoveRightKey(value: string) { this.#keyNameMapper.moveRight = value; }
    /** [KO] 상향 이동 키 설정 [EN] Sets the move up key */
    setMoveUpKey(value: string) { this.#keyNameMapper.moveUp = value; }
    /** [KO] 하향 이동 키 설정 [EN] Sets the move down key */
    setMoveDownKey(value: string) { this.#keyNameMapper.moveDown = value; }
    /** [KO] 좌회전 키 설정 [EN] Sets the turn left key */
    setTurnLeftKey(value: string) { this.#keyNameMapper.turnLeft = value; }
    /** [KO] 우회전 키 설정 [EN] Sets the turn right key */
    setTurnRightKey(value: string) { this.#keyNameMapper.turnRight = value; }
    /** [KO] 상향 회전 키 설정 [EN] Sets the turn up key */
    setTurnUpKey(value: string) { this.#keyNameMapper.turnUp = value; }
    /** [KO] 하향 회전 키 설정 [EN] Sets the turn down key */
    setTurnDownKey(value: string) { this.#keyNameMapper.turnDown = value; }

    /**
     * [KO] 매 프레임 컨트롤러를 업데이트합니다.
     * [EN] Updates the controller every frame.
     *
     * @param view - [KO] 3D 뷰 [EN] 3D View
     * @param time - [KO] 현재 시간 [EN] Current time
     */
    update(view: View3D, time: number): void {
        super.update(view, time, (deltaTime: number) => {
            this.#updateAnimation(view, time, deltaTime);
        });
    }

    #initListener() {
        this.#targetMesh = new Mesh(this.redGPUContext);
    }

    #updateAnimation(view: View3D, time: number, deltaTime: number) {
        const targetMesh = this.#targetMesh;
        const tDelay = Math.pow(this.#moveDelayInterpolation, deltaTime);
        const tDelayRotation = Math.pow(this.#rotationInterpolation, deltaTime);

        let panDelta = (this.#pan - targetMesh.rotationY) % 360;
        if (panDelta > 180) panDelta -= 360;
        if (panDelta < -180) panDelta += 360;
        targetMesh.rotationY += panDelta * (1 - tDelayRotation);

        const tiltDelta = (this.#tilt - targetMesh.rotationX);
        targetMesh.rotationX += tiltDelta * (1 - tDelayRotation);

        if (this.#checkKeyboardKeyBuffer(view, deltaTime)) {
            updateObject3DMatrix(targetMesh, view);
            mat4.identity(this.#displacementMTX);
            mat4.rotateY(this.#displacementMTX, this.#displacementMTX, targetMesh.rotationY * PER_PI);
            mat4.rotateX(this.#displacementMTX, this.#displacementMTX, targetMesh.rotationX * PER_PI);
            mat4.translate(this.#displacementMTX, this.#displacementMTX, this.#displacementVec3);

            mat4.identity(this.#tMTX0);
            mat4.translate(this.#tMTX0, this.#tMTX0, targetMesh.position);
            mat4.multiply(this.#tMTX0, this.#tMTX0, this.#displacementMTX);
            this.#desirePosition[0] = this.#tMTX0[12];
            this.#desirePosition[1] = this.#tMTX0[13];
            this.#desirePosition[2] = this.#tMTX0[14];
        }

        targetMesh.x += (this.#desirePosition[0] - targetMesh.x) * (1 - tDelay);
        targetMesh.y += (this.#desirePosition[1] - targetMesh.y) * (1 - tDelay);
        targetMesh.z += (this.#desirePosition[2] - targetMesh.z) * (1 - tDelay);

        mat4.identity(this.#tMTX0);
        mat4.translate(this.#tMTX0, this.#tMTX0, targetMesh.position);
        mat4.rotateY(this.#tMTX0, this.#tMTX0, targetMesh.rotationY * PER_PI);
        mat4.rotateX(this.#tMTX0, this.#tMTX0, targetMesh.rotationX * PER_PI);

        this.camera.setPosition(targetMesh.x, targetMesh.y, targetMesh.z);

        const forward = vec3.fromValues(0, 0, -10);
        vec3.transformMat4(forward, forward, this.#tMTX0);
        this.camera.lookAt(forward[0], forward[1], forward[2]);
    }

    #checkKeyboardKeyBuffer(view: View3D, deltaTime: number): boolean {
        if (!this.checkKeyboardInput(view, this.#keyNameMapper)) return false;
        const {keyboardKeyBuffer} = view.redGPUContext;
        const tSpeed = this.#moveSpeed * deltaTime;
        const tSpeedRotation = this.#rotationSpeed * deltaTime;
        const tKeyNameMapper = this.#keyNameMapper;
        let move = false;
        let rotate = false;
        let pan = 0;
        let tilt = 0;
        this.#displacementVec3[0] = 0;
        this.#displacementVec3[1] = 0;
        this.#displacementVec3[2] = 0;

        const tempAccelerationValue = this.#currentAcceleration * tSpeed;

        if (keyboardKeyBuffer[tKeyNameMapper.turnLeft]) { rotate = true; pan = tSpeedRotation; }
        if (keyboardKeyBuffer[tKeyNameMapper.turnRight]) { rotate = true; pan = -tSpeedRotation; }
        if (keyboardKeyBuffer[tKeyNameMapper.turnUp]) { rotate = true; tilt = tSpeedRotation; }
        if (keyboardKeyBuffer[tKeyNameMapper.turnDown]) { rotate = true; tilt = -tSpeedRotation; }

        if (keyboardKeyBuffer[tKeyNameMapper.moveForward]) { move = true; this.#displacementVec3[2] = -tempAccelerationValue; }
        if (keyboardKeyBuffer[tKeyNameMapper.moveBack]) { move = true; this.#displacementVec3[2] = tempAccelerationValue; }
        if (keyboardKeyBuffer[tKeyNameMapper.moveLeft]) { move = true; this.#displacementVec3[0] = -tempAccelerationValue; }
        if (keyboardKeyBuffer[tKeyNameMapper.moveRight]) { move = true; this.#displacementVec3[0] = tempAccelerationValue; }
        if (keyboardKeyBuffer[tKeyNameMapper.moveUp]) { move = true; this.#displacementVec3[1] = tempAccelerationValue; }
        if (keyboardKeyBuffer[tKeyNameMapper.moveDown]) { move = true; this.#displacementVec3[1] = -tempAccelerationValue; }

        const accelerationDelta = 3 * deltaTime;
        if (rotate || move) {
            this.#currentAcceleration = Math.min(this.#maxAcceleration, this.#currentAcceleration + accelerationDelta);
        } else {
            this.#currentAcceleration = Math.max(0, this.#currentAcceleration - accelerationDelta);
        }

        if (rotate) {
            this.#pan += pan;
            this.#tilt = Math.max(-89.9, Math.min(89.9, this.#tilt + tilt));
        }
        return move || rotate;
    }
}

export default FreeController;
