import {mat4, vec3} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import AController from "../core/AController";
// ==================== 모듈 레벨 상수 및 임시 변수 ====================
const PER_PI = Math.PI / 180;
let tMTX0 = mat4.create();
const displacementMTX = mat4.create();
const displacementVec3 = vec3.create();
// ==================== 키 매핑 타입 ====================
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
 * controller.setPosition(10, 5, 20);
 * controller.pan = 30;
 * controller.tilt = 10;
 * controller.setMoveForwardKey('w');
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/freeController/"></iframe>
 * @category Controller
 */
class FreeController extends AController {
    // ==================== 키 매핑 ====================
    #keyNameMapper: KeyNameMapper = {
        moveForward: 'w',
        moveBack: 's',
        moveLeft: 'a',
        moveRight: 'd',
        moveUp: 't',
        moveDown: 'g',
        turnLeft: 'q',
        turnRight: 'e',
        turnUp: 'r',
        turnDown: 'f'
    };
    // ==================== 이동 관련 설정 ====================
    #moveSpeed: number = 0.5;
    #moveDelayInterpolation: number = 0.1;
    #maxAcceleration: number = 1;
    #currentAcceleration: number = 0;
    // ==================== 회전 관련 설정 ====================
    #rotationSpeed: number = 1;
    #rotationInterpolation: number = 0.1;
    // ==================== 위치 및 회전 상태 ====================
    #desirePosition: [number, number, number] = [0, 0, 0];
    #pan: number = 0;
    #tilt: number = 0;
    // ==================== 메시 및 입력 관련 ====================
    #targetMesh: Mesh;

    // ==================== 라이프사이클 ====================
    /**
     * [KO] FreeController의 생성자입니다.
     * [EN] Constructor for FreeController.
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
                    this.#pan -= deltaX * this.#rotationSpeed * 0.1;
                    this.#tilt -= deltaY * this.#rotationSpeed * 0.1;
                },
                useKeyboard: true
            });
        this.#initListener();
    }

    // ==================== 위치(Position) Getter/Setter ====================
    /**
     * [KO] 카메라의 X축 위치를 가져옵니다.
     * [EN] Gets the camera's X-axis position.
     *
     * @returns
     * [KO] 카메라의 X축 위치 값
     * [EN] Camera X-axis position value
     */
    get x(): number {
        return this.#targetMesh.x;
    }

    /**
     * [KO] 카메라의 X축 위치를 설정합니다.
     * [EN] Sets the camera's X-axis position.
     *
     * @param value -
     * [KO] 설정할 X축 위치 값 (숫자)
     * [EN] X-axis position value to set (number)
     */
    set x(value: number) {
        validateNumber(value);
        this.#targetMesh.x = value;
        this.#desirePosition[0] = value;
    }

    /**
     * [KO] 카메라의 Y축 위치를 가져옵니다.
     * [EN] Gets the camera's Y-axis position.
     *
     * @returns
     * [KO] 카메라의 Y축 위치 값
     * [EN] Camera Y-axis position value
     */
    get y(): number {
        return this.#targetMesh.y;
    }

    /**
     * [KO] 카메라의 Y축 위치를 설정합니다.
     * [EN] Sets the camera's Y-axis position.
     *
     * @param value -
     * [KO] 설정할 Y축 위치 값 (숫자)
     * [EN] Y-axis position value to set (number)
     */
    set y(value: number) {
        validateNumber(value);
        this.#targetMesh.y = value;
        this.#desirePosition[1] = value;
    }

    /**
     * [KO] 카메라의 Z축 위치를 가져옵니다.
     * [EN] Gets the camera's Z-axis position.
     *
     * @returns
     * [KO] 카메라의 Z축 위치 값
     * [EN] Camera Z-axis position value
     */
    get z(): number {
        return this.#targetMesh.z;
    }

    /**
     * [KO] 카메라의 Z축 위치를 설정합니다.
     * [EN] Sets the camera's Z-axis position.
     *
     * @param value -
     * [KO] 설정할 Z축 위치 값 (숫자)
     * [EN] Z-axis position value to set (number)
     */
    set z(value: number) {
        validateNumber(value);
        this.#targetMesh.z = value;
        this.#desirePosition[2] = value;
    }

    // ==================== 회전(Rotation) Getter/Setter ====================
    /**
     * [KO] 카메라의 좌우 회전 각도(Pan)를 가져옵니다. (단위: 도)
     * [EN] Gets the camera's horizontal rotation angle (Pan). (Unit: degrees)
     *
     * @returns
     * [KO] 좌우 회전 각도 값
     * [EN] Horizontal rotation angle value
     */
    get pan(): number {
        return this.#pan;
    }

    /**
     * [KO] 카메라의 좌우 회전 각도(Pan)를 설정합니다. (단위: 도)
     * [EN] Sets the camera's horizontal rotation angle (Pan). (Unit: degrees)
     *
     * @param value -
     * [KO] 설정할 좌우 회전 각도 값
     * [EN] Horizontal rotation angle value to set
     */
    set pan(value: number) {
        validateNumber(value);
        this.#targetMesh.rotationY = value;
        this.#pan = value;
    }

    /**
     * [KO] 카메라의 상하 회전 각도(Tilt)를 가져옵니다. (단위: 도, 범위: -90 ~ 90)
     * [EN] Gets the camera's vertical rotation angle (Tilt). (Unit: degrees, Range: -90 ~ 90)
     *
     * @returns
     * [KO] 상하 회전 각도 값
     * [EN] Vertical rotation angle value
     */
    get tilt(): number {
        return this.#tilt;
    }

    /**
     * [KO] 카메라의 상하 회전 각도(Tilt)를 설정합니다. (단위: 도, 범위: -90 ~ 90)
     * [EN] Sets the camera's vertical rotation angle (Tilt). (Unit: degrees, Range: -90 ~ 90)
     *
     * @param value -
     * [KO] 설정할 상하 회전 각도 값
     * [EN] Vertical rotation angle value to set
     */
    set tilt(value: number) {
        validateNumber(value);
        const clampedTilt = Math.max(-90, Math.min(90, value));
        this.#targetMesh.rotationX = clampedTilt;
        this.#tilt = clampedTilt;
    }

    // ==================== 이동 속도 Getter/Setter ====================
    /**
     * [KO] 카메라의 이동 속도를 가져옵니다.
     * [EN] Gets the camera's movement speed.
     *
     * @returns
     * [KO] 이동 속도 값
     * [EN] Movement speed value
     */
    get moveSpeed(): number {
        return this.#moveSpeed;
    }

    /**
     * [KO] 카메라의 이동 속도를 설정합니다.
     * [EN] Sets the camera's movement speed.
     *
     * @param value -
     * [KO] 설정할 이동 속도 값 (0.01 이상)
     * [EN] Movement speed value to set (min 0.01)
     */
    set moveSpeed(value: number) {
        validateNumberRange(value, 0.01);
        this.#moveSpeed = value;
    }

    /**
     * [KO] 이동 보간 정도를 가져옵니다. (0~1 범위에서 작을수록 부드러움)
     * [EN] Gets the movement interpolation factor. (Range 0~1, smaller is smoother)
     *
     * @returns
     * [KO] 이동 보간 정도 값
     * [EN] Movement interpolation factor value
     */
    get moveSpeedInterpolation(): number {
        return this.#moveDelayInterpolation;
    }

    /**
     * [KO] 이동 보간 정도를 설정합니다. (0.01~1 범위, 작을수록 부드러운 이동)
     * [EN] Sets the movement interpolation factor. (Range 0.01~1, smaller is smoother movement)
     *
     * @param value -
     * [KO] 설정할 보간 정도 값
     * [EN] Interpolation factor value to set
     */
    set moveSpeedInterpolation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#moveDelayInterpolation = value;
    }

    // ==================== 회전 속도 Getter/Setter ====================
    /**
     * [KO] 카메라의 회전 속도를 가져옵니다.
     * [EN] Gets the camera's rotation speed.
     *
     * @returns
     * [KO] 회전 속도 값
     * [EN] Rotation speed value
     */
    get rotationSpeed(): number {
        return this.#rotationSpeed;
    }

    /**
     * [KO] 카메라의 회전 속도를 설정합니다.
     * [EN] Sets the camera's rotation speed.
     *
     * @param value -
     * [KO] 설정할 회전 속도 값 (0.01 이상)
     * [EN] Rotation speed value to set (min 0.01)
     */
    set rotationSpeed(value: number) {
        validateNumberRange(value, 0.01);
        this.#rotationSpeed = value;
    }

    /**
     * [KO] 회전 보간 정도를 가져옵니다. (0~1 범위에서 작을수록 부드러움)
     * [EN] Gets the rotation interpolation factor. (Range 0~1, smaller is smoother)
     *
     * @returns
     * [KO] 회전 보간 정도 값
     * [EN] Rotation interpolation factor value
     */
    get rotationSpeedInterpolation(): number {
        return this.#rotationInterpolation;
    }

    /**
     * [KO] 회전 보간 정도를 설정합니다. (0.01~1 범위, 작을수록 부드러운 회전)
     * [EN] Sets the rotation interpolation factor. (Range 0.01~1, smaller is smoother rotation)
     *
     * @param value -
     * [KO] 설정할 보간 정도 값
     * [EN] Interpolation factor value to set
     */
    set rotationSpeedInterpolation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#rotationInterpolation = value;
    }

    // ==================== 가속도 Getter/Setter ====================
    /**
     * [KO] 최대 가속도를 가져옵니다.
     * [EN] Gets the maximum acceleration.
     *
     * @returns
     * [KO] 최대 가속도 값
     * [EN] Maximum acceleration value
     */
    get maxAcceleration(): number {
        return this.#maxAcceleration;
    }

    /**
     * [KO] 최대 가속도를 설정합니다.
     * [EN] Sets the maximum acceleration.
     *
     * @param value -
     * [KO] 설정할 최대 가속도 값
     * [EN] Maximum acceleration value to set
     */
    set maxAcceleration(value: number) {
        this.#maxAcceleration = value;
    }

    // ==================== 키 매핑 Getter/Setter ====================
    /**
     * [KO] 현재 키 매핑 설정을 가져옵니다.
     * [EN] Gets the current key mapping configuration.
     *
     * @returns
     * [KO] 키 매핑 객체의 복사본
     * [EN] Copy of key mapping object
     */
    get keyNameMapper(): KeyNameMapper {
        return {...this.#keyNameMapper};
    }

    /**
     * [KO] 전진 이동 키를 설정합니다.
     * [EN] Sets the move forward key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'w')
     * [EN] Key name to set (e.g., 'w')
     */
    setMoveForwardKey(value: string) {
        this.#keyNameMapper.moveForward = value;
    }

    /**
     * [KO] 후진 이동 키를 설정합니다.
     * [EN] Sets the move backward key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 's')
     * [EN] Key name to set (e.g., 's')
     */
    setMoveBackKey(value: string) {
        this.#keyNameMapper.moveBack = value;
    }

    /**
     * [KO] 좌측 이동 키를 설정합니다.
     * [EN] Sets the move left key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'a')
     * [EN] Key name to set (e.g., 'a')
     */
    setMoveLeftKey(value: string) {
        this.#keyNameMapper.moveLeft = value;
    }

    /**
     * [KO] 우측 이동 키를 설정합니다.
     * [EN] Sets the move right key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'd')
     * [EN] Key name to set (e.g., 'd')
     */
    setMoveRightKey(value: string) {
        this.#keyNameMapper.moveRight = value;
    }

    /**
     * [KO] 상향 이동 키를 설정합니다.
     * [EN] Sets the move up key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 't')
     * [EN] Key name to set (e.g., 't')
     */
    setMoveUpKey(value: string) {
        this.#keyNameMapper.moveUp = value;
    }

    /**
     * [KO] 하향 이동 키를 설정합니다.
     * [EN] Sets the move down key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'g')
     * [EN] Key name to set (e.g., 'g')
     */
    setMoveDownKey(value: string) {
        this.#keyNameMapper.moveDown = value;
    }

    /**
     * [KO] 좌회전 키를 설정합니다.
     * [EN] Sets the turn left key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'q')
     * [EN] Key name to set (e.g., 'q')
     */
    setTurnLeftKey(value: string) {
        this.#keyNameMapper.turnLeft = value;
    }

    /**
     * [KO] 우회전 키를 설정합니다.
     * [EN] Sets the turn right key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'e')
     * [EN] Key name to set (e.g., 'e')
     */
    setTurnRightKey(value: string) {
        this.#keyNameMapper.turnRight = value;
    }

    /**
     * [KO] 상향 회전 키를 설정합니다.
     * [EN] Sets the turn up key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'r')
     * [EN] Key name to set (e.g., 'r')
     */
    setTurnUpKey(value: string) {
        this.#keyNameMapper.turnUp = value;
    }

    /**
     * [KO] 하향 회전 키를 설정합니다.
     * [EN] Sets the turn down key.
     *
     * @param value -
     * [KO] 설정할 키 이름 (예: 'f')
     * [EN] Key name to set (e.g., 'f')
     */
    setTurnDownKey(value: string) {
        this.#keyNameMapper.turnDown = value;
    }

    // ==================== 업데이트 ====================
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
    update(view: View3D, time: number): void {
        super.update(view, time, () => {
            this.#updateAnimation(view, time);
        });
    }

    // ==================== Private Methods ====================
    #initListener() {
        const {redGPUContext} = this;
        this.#targetMesh = new Mesh(redGPUContext);
    }

    #updateAnimation(view: View3D, time: number) {
        const tDelay = this.#moveDelayInterpolation;
        const tDelayRotation = this.#rotationInterpolation;
        const tDesirePosition = this.#desirePosition;
        const targetMesh = this.#targetMesh;
        // 회전 보간
        targetMesh.rotationY += (this.#pan - targetMesh.rotationY) * tDelayRotation;
        targetMesh.rotationX += (this.#tilt - targetMesh.rotationX) * tDelayRotation;
        // 키보드 입력 체크 및 이동 계산
        if (this.#checkKeyboardKeyBuffer(view)) {
            tMTX0 = targetMesh.modelMatrix;
            // 이동 방향 계산 (회전 고려)
            mat4.identity(displacementMTX);
            mat4.rotateY(displacementMTX, displacementMTX, targetMesh.rotationY * PER_PI);
            mat4.rotateX(displacementMTX, displacementMTX, targetMesh.rotationX * PER_PI);
            mat4.translate(displacementMTX, displacementMTX, displacementVec3);
            // 최종 위치 계산
            mat4.identity(tMTX0);
            mat4.translate(tMTX0, tMTX0, targetMesh.position);
            mat4.multiply(tMTX0, tMTX0, displacementMTX);
            tDesirePosition[0] = tMTX0[12];
            tDesirePosition[1] = tMTX0[13];
            tDesirePosition[2] = tMTX0[14];
        }
        // 위치 보간
        targetMesh.x += (tDesirePosition[0] - targetMesh.x) * tDelay;
        targetMesh.y += (tDesirePosition[1] - targetMesh.y) * tDelay;
        targetMesh.z += (tDesirePosition[2] - targetMesh.z) * tDelay;
        // 회전 재적용
        targetMesh.rotationY += (this.#pan - targetMesh.rotationY) * tDelayRotation;
        targetMesh.rotationX += (this.#tilt - targetMesh.rotationX) * tDelayRotation;
        // 메시 모델 매트릭스 생성
        tMTX0 = targetMesh.modelMatrix;
        mat4.identity(tMTX0);
        mat4.translate(tMTX0, tMTX0, targetMesh.position);
        mat4.rotateY(tMTX0, tMTX0, targetMesh.rotationY * PER_PI);
        mat4.rotateX(tMTX0, tMTX0, targetMesh.rotationX * PER_PI);
        // 카메라를 메시 바로 뒤에 위치
        const tMTX1 = mat4.clone(tMTX0);
        mat4.translate(tMTX1, tMTX1, [0, 0, 0.01]);
        this.camera.setPosition(tMTX1[12], tMTX1[13], tMTX1[14]);
        this.camera.lookAt(targetMesh.x, targetMesh.y, targetMesh.z);
    }

    #checkKeyboardKeyBuffer(view: View3D): boolean {
        if (!this.checkKeyboardInput(view, this.#keyNameMapper)) return false;
        const {keyboardKeyBuffer} = view.redGPUContext;
        const tSpeed = this.#moveSpeed;
        const tSpeedRotation = this.#rotationSpeed;
        const tKeyNameMapper = this.#keyNameMapper;
        let move = false;
        let rotate = false;
        let pan = 0;
        let tilt = 0;
        displacementVec3[0] = 0;
        displacementVec3[1] = 0;
        displacementVec3[2] = 0;
        const tempAccelerationValue = this.#currentAcceleration * tSpeed;
        // 회전 입력
        if (keyboardKeyBuffer[tKeyNameMapper.turnLeft]) {
            rotate = true;
            pan = tSpeedRotation;
        }
        if (keyboardKeyBuffer[tKeyNameMapper.turnRight]) {
            rotate = true;
            pan = -tSpeedRotation;
        }
        if (keyboardKeyBuffer[tKeyNameMapper.turnUp]) {
            rotate = true;
            tilt = tSpeedRotation;
        }
        if (keyboardKeyBuffer[tKeyNameMapper.turnDown]) {
            rotate = true;
            tilt = -tSpeedRotation;
        }
        // 이동 입력
        if (keyboardKeyBuffer[tKeyNameMapper.moveForward]) {
            move = true;
            displacementVec3[2] = -tempAccelerationValue;
        }
        if (keyboardKeyBuffer[tKeyNameMapper.moveBack]) {
            move = true;
            displacementVec3[2] = tempAccelerationValue;
        }
        if (keyboardKeyBuffer[tKeyNameMapper.moveLeft]) {
            move = true;
            displacementVec3[0] = -tempAccelerationValue;
        }
        if (keyboardKeyBuffer[tKeyNameMapper.moveRight]) {
            move = true;
            displacementVec3[0] = tempAccelerationValue;
        }
        if (keyboardKeyBuffer[tKeyNameMapper.moveUp]) {
            move = true;
            displacementVec3[1] = tempAccelerationValue;
        }
        if (keyboardKeyBuffer[tKeyNameMapper.moveDown]) {
            move = true;
            displacementVec3[1] = -tempAccelerationValue;
        }
        // 가속도 계산
        if (rotate || move) {
            this.#currentAcceleration += 0.1;
            if (this.#currentAcceleration > this.#maxAcceleration) {
                this.#currentAcceleration = this.#maxAcceleration;
            }
        } else {
            this.#currentAcceleration -= 0.1;
            if (this.#currentAcceleration < 0) {
                this.#currentAcceleration = 0;
            }
        }
        if (rotate) {
            this.#pan += pan;
            this.#tilt += tilt;
        }
        return move || rotate;
    }
}

export default FreeController;