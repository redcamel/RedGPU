import {mat4, vec3} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;

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
class FreeController extends AController {
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
    #moveSpeed: number = 20;
    #moveDelayInterpolation: number = 0.01;
    #maxAcceleration: number = 1;
    #currentAcceleration: number = 0;
    #rotationSpeed: number = 100;
    #rotationInterpolation: number = 0.01;
    #mouseSensitivity: number = 0.15;
    #desirePosition: [number, number, number] = [0, 0, 0];
    #pan: number = 0;
    #tilt: number = 0;
    #currentX: number = 0;
    #currentY: number = 0;
    #currentZ: number = 0;
    #currentPan: number = 0;
    #currentTilt: number = 0;

    #tempMatrix = mat4.create();
    #displacementMatrix = mat4.create();
    #displacementVec3 = vec3.create();
    #currentPositionVec3 = vec3.create();
    #forwardVec3 = vec3.create();

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
    }

    /**
     * [KO] 카메라의 목표 X축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's target X-axis position.
     *
     * @returns
     * [KO] X축 위치 (기본값: `0`)
     * [EN] X-axis position (default: `0`)
     */
    get x(): number {
        return this.#desirePosition[0];
    }

    set x(value: number) {
        validateNumber(value);
        this.#desirePosition[0] = value;
    }

    /**
     * [KO] 카메라의 목표 Y축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's target Y-axis position.
     *
     * @returns
     * [KO] Y축 위치 (기본값: `0`)
     * [EN] Y-axis position (default: `0`)
     */
    get y(): number {
        return this.#desirePosition[1];
    }

    set y(value: number) {
        validateNumber(value);
        this.#desirePosition[1] = value;
    }

    /**
     * [KO] 카메라의 목표 Z축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's target Z-axis position.
     *
     * @returns
     * [KO] Z축 위치 (기본값: `0`)
     * [EN] Z-axis position (default: `0`)
     */
    get z(): number {
        return this.#desirePosition[2];
    }

    set z(value: number) {
        validateNumber(value);
        this.#desirePosition[2] = value;
    }

    /**
     * [KO] 카메라의 수평 회전(Pan) 목표 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's target horizontal rotation (Pan) angle. (Unit: degrees)
     *
     * @returns
     * [KO] 팬 각도 (기본값: `0`)
     * [EN] Pan angle (default: `0`)
     */
    get pan(): number {
        return this.#pan;
    }

    set pan(value: number) {
        validateNumber(value);
        this.#pan = value;
    }

    /**
     * [KO] 카메라의 수직 회전(Tilt) 목표 각도를 가져오거나 설정합니다. (단위: 도, 범위: `-89.9` ~ `89.9`)
     * [EN] Gets or sets the camera's target vertical rotation (Tilt) angle. (Unit: degrees, Range: `-89.9` ~ `89.9`)
     *
     * @returns
     * [KO] 틸트 각도 (기본값: `0`)
     * [EN] Tilt angle (default: `0`)
     */
    get tilt(): number {
        return this.#tilt;
    }

    set tilt(value: number) {
        validateNumber(value);
        this.#tilt = Math.max(-89.9, Math.min(89.9, value));
    }

    /**
     * [KO] 마우스 드래그 회전 감도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the mouse drag rotation sensitivity. (`0.01` or greater)
     *
     * @returns
     * [KO] 마우스 회전 감도 (기본값: `0.15`)
     * [EN] Mouse rotation sensitivity (default: `0.15`)
     */
    get mouseSensitivity(): number {
        return this.#mouseSensitivity;
    }

    set mouseSensitivity(value: number) {
        validateNumberRange(value, 0.01);
        this.#mouseSensitivity = value;
    }

    /**
     * [KO] 키보드 이동 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the keyboard movement speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 이동 속도 (기본값: `20`)
     * [EN] Movement speed (default: `20`)
     */
    get moveSpeed(): number {
        return this.#moveSpeed;
    }

    set moveSpeed(value: number) {
        validateNumberRange(value, 0.01);
        this.#moveSpeed = value;
    }

    /**
     * [KO] 이동 위치 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for movement position changes. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 이동 보간 계수 (기본값: `0.01`)
     * [EN] Movement interpolation factor (default: `0.01`)
     */
    get moveSpeedInterpolation(): number {
        return this.#moveDelayInterpolation;
    }

    set moveSpeedInterpolation(value: number) {
        validateNumberRange(value, 0.0001, 1);
        this.#moveDelayInterpolation = value;
    }

    /**
     * [KO] 키보드 회전 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the keyboard rotation speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 회전 속도 (기본값: `100`)
     * [EN] Rotation speed (default: `100`)
     */
    get rotationSpeed(): number {
        return this.#rotationSpeed;
    }

    set rotationSpeed(value: number) {
        validateNumberRange(value, 0.01);
        this.#rotationSpeed = value;
    }

    /**
     * [KO] 회전 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for rotation changes. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 회전 보간 계수 (기본값: `0.01`)
     * [EN] Rotation interpolation factor (default: `0.01`)
     */
    get rotationSpeedInterpolation(): number {
        return this.#rotationInterpolation;
    }

    set rotationSpeedInterpolation(value: number) {
        validateNumberRange(value, 0.0001, 1);
        this.#rotationInterpolation = value;
    }

    /**
     * [KO] 최대 이동 가속도 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum movement acceleration scale.
     *
     * @returns
     * [KO] 최대 가속도 배율 (기본값: `1`)
     * [EN] Maximum acceleration scale (default: `1`)
     */
    get maxAcceleration(): number {
        return this.#maxAcceleration;
    }

    set maxAcceleration(value: number) {
        this.#maxAcceleration = value;
    }

    /**
     * [KO] 현재 설정된 키보드 키 매핑 객체의 복사본을 반환합니다.
     * [EN] Returns a copy of the currently configured keyboard key mapping object.
     *
     * @returns
     * [KO] 키 매핑 설정 객체 (`KeyNameMapper`)
     * [EN] Key mapping configuration object (`KeyNameMapper`)
     */
    get keyNameMapper(): KeyNameMapper {
        return {...this.#keyNameMapper};
    }

    /**
     * [KO] 전진 이동 키를 설정합니다.
     * [EN] Sets the move forward key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'w'`)
     * [EN] Key name to assign (e.g., `'w'`)
     */
    setMoveForwardKey(value: string) {
        this.#keyNameMapper.moveForward = value;
    }

    /**
     * [KO] 후진 이동 키를 설정합니다.
     * [EN] Sets the move backward key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'s'`)
     * [EN] Key name to assign (e.g., `'s'`)
     */
    setMoveBackKey(value: string) {
        this.#keyNameMapper.moveBack = value;
    }

    /**
     * [KO] 좌측 이동 키를 설정합니다.
     * [EN] Sets the move left key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'a'`)
     * [EN] Key name to assign (e.g., `'a'`)
     */
    setMoveLeftKey(value: string) {
        this.#keyNameMapper.moveLeft = value;
    }

    /**
     * [KO] 우측 이동 키를 설정합니다.
     * [EN] Sets the move right key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'d'`)
     * [EN] Key name to assign (e.g., `'d'`)
     */
    setMoveRightKey(value: string) {
        this.#keyNameMapper.moveRight = value;
    }

    /**
     * [KO] 상향 이동 키를 설정합니다.
     * [EN] Sets the move up key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'e'`)
     * [EN] Key name to assign (e.g., `'e'`)
     */
    setMoveUpKey(value: string) {
        this.#keyNameMapper.moveUp = value;
    }

    /**
     * [KO] 하향 이동 키를 설정합니다.
     * [EN] Sets the move down key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'q'`)
     * [EN] Key name to assign (e.g., `'q'`)
     */
    setMoveDownKey(value: string) {
        this.#keyNameMapper.moveDown = value;
    }

    /**
     * [KO] 좌회전 키를 설정합니다.
     * [EN] Sets the turn left key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'z'`)
     * [EN] Key name to assign (e.g., `'z'`)
     */
    setTurnLeftKey(value: string) {
        this.#keyNameMapper.turnLeft = value;
    }

    /**
     * [KO] 우회전 키를 설정합니다.
     * [EN] Sets the turn right key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'c'`)
     * [EN] Key name to assign (e.g., `'c'`)
     */
    setTurnRightKey(value: string) {
        this.#keyNameMapper.turnRight = value;
    }

    /**
     * [KO] 상향 회전 키를 설정합니다.
     * [EN] Sets the turn up key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'r'`)
     * [EN] Key name to assign (e.g., `'r'`)
     */
    setTurnUpKey(value: string) {
        this.#keyNameMapper.turnUp = value;
    }

    /**
     * [KO] 하향 회전 키를 설정합니다.
     * [EN] Sets the turn down key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'f'`)
     * [EN] Key name to assign (e.g., `'f'`)
     */
    setTurnDownKey(value: string) {
        this.#keyNameMapper.turnDown = value;
    }

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
    update(view: View3D, time: number): void {
        super.update(view, time, this.#updateAnimation);
    }

    #updateAnimation = (view: View3D, deltaTime: number): void => {
        const moveDelay = Math.pow(this.#moveDelayInterpolation, deltaTime);
        const rotationDelay = Math.pow(this.#rotationInterpolation, deltaTime);

        let panDelta = (this.#pan - this.#currentPan) % 360;
        if (panDelta > 180) panDelta -= 360;
        if (panDelta < -180) panDelta += 360;
        this.#currentPan += panDelta * (1 - rotationDelay);

        const tiltDelta = (this.#tilt - this.#currentTilt);
        this.#currentTilt += tiltDelta * (1 - rotationDelay);

        if (this.#checkKeyboardKeyBuffer(view, deltaTime)) {
            mat4.identity(this.#displacementMatrix);
            mat4.rotateY(this.#displacementMatrix, this.#displacementMatrix, this.#currentPan * PER_PI);
            mat4.rotateX(this.#displacementMatrix, this.#displacementMatrix, this.#currentTilt * PER_PI);
            mat4.translate(this.#displacementMatrix, this.#displacementMatrix, this.#displacementVec3);

            mat4.identity(this.#tempMatrix);
            mat4.translate(this.#tempMatrix, this.#tempMatrix, this.#desirePosition);
            mat4.multiply(this.#tempMatrix, this.#tempMatrix, this.#displacementMatrix);
            this.#desirePosition[0] = this.#tempMatrix[12];
            this.#desirePosition[1] = this.#tempMatrix[13];
            this.#desirePosition[2] = this.#tempMatrix[14];
        }

        this.#currentX += (this.#desirePosition[0] - this.#currentX) * (1 - moveDelay);
        this.#currentY += (this.#desirePosition[1] - this.#currentY) * (1 - moveDelay);
        this.#currentZ += (this.#desirePosition[2] - this.#currentZ) * (1 - moveDelay);

        vec3.set(this.#currentPositionVec3, this.#currentX, this.#currentY, this.#currentZ);
        mat4.identity(this.#tempMatrix);
        mat4.translate(this.#tempMatrix, this.#tempMatrix, this.#currentPositionVec3);
        mat4.rotateY(this.#tempMatrix, this.#tempMatrix, this.#currentPan * PER_PI);
        mat4.rotateX(this.#tempMatrix, this.#tempMatrix, this.#currentTilt * PER_PI);

        this.camera.setPosition(this.#currentX, this.#currentY, this.#currentZ);

        vec3.set(this.#forwardVec3, 0, 0, -10);
        vec3.transformMat4(this.#forwardVec3, this.#forwardVec3, this.#tempMatrix);
        this.camera.lookAt(this.#forwardVec3[0], this.#forwardVec3[1], this.#forwardVec3[2]);
        this.camera.rotationX = this.#currentTilt;
        this.camera.rotationY = this.#currentPan;
    };

    #checkKeyboardKeyBuffer(view: View3D, deltaTime: number): boolean {
        if (!this.checkKeyboardInput(view, this.#keyNameMapper)) return false;
        const {keyboardKeyBuffer} = view.redGPUContext;
        const moveSpeed = this.#moveSpeed * deltaTime;
        const rotationSpeed = this.#rotationSpeed * deltaTime;
        const keyNameMapper = this.#keyNameMapper;
        let isMoving = false;
        let isRotating = false;
        let pan = 0;
        let tilt = 0;
        this.#displacementVec3[0] = 0;
        this.#displacementVec3[1] = 0;
        this.#displacementVec3[2] = 0;

        const tempAccelerationValue = this.#currentAcceleration * moveSpeed;

        if (keyboardKeyBuffer[keyNameMapper.turnLeft]) {
            isRotating = true;
            pan = rotationSpeed;
        }
        if (keyboardKeyBuffer[keyNameMapper.turnRight]) {
            isRotating = true;
            pan = -rotationSpeed;
        }
        if (keyboardKeyBuffer[keyNameMapper.turnUp]) {
            isRotating = true;
            tilt = rotationSpeed;
        }
        if (keyboardKeyBuffer[keyNameMapper.turnDown]) {
            isRotating = true;
            tilt = -rotationSpeed;
        }

        if (keyboardKeyBuffer[keyNameMapper.moveForward]) {
            isMoving = true;
            this.#displacementVec3[2] = -tempAccelerationValue;
        }
        if (keyboardKeyBuffer[keyNameMapper.moveBack]) {
            isMoving = true;
            this.#displacementVec3[2] = tempAccelerationValue;
        }
        if (keyboardKeyBuffer[keyNameMapper.moveLeft]) {
            isMoving = true;
            this.#displacementVec3[0] = -tempAccelerationValue;
        }
        if (keyboardKeyBuffer[keyNameMapper.moveRight]) {
            isMoving = true;
            this.#displacementVec3[0] = tempAccelerationValue;
        }
        if (keyboardKeyBuffer[keyNameMapper.moveUp]) {
            isMoving = true;
            this.#displacementVec3[1] = tempAccelerationValue;
        }
        if (keyboardKeyBuffer[keyNameMapper.moveDown]) {
            isMoving = true;
            this.#displacementVec3[1] = -tempAccelerationValue;
        }

        const accelerationDelta = 3 * deltaTime;
        if (isRotating || isMoving) {
            this.#currentAcceleration = Math.min(this.#maxAcceleration, this.#currentAcceleration + accelerationDelta);
        } else {
            this.#currentAcceleration = Math.max(0, this.#currentAcceleration - accelerationDelta);
        }

        if (isRotating) {
            this.#pan += pan;
            this.#tilt = Math.max(-89.9, Math.min(89.9, this.#tilt + tilt));
        }
        return isMoving || isRotating;
    }
}

Object.freeze(FreeController);
export default FreeController;
