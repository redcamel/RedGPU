import { mat4, vec3 } from "gl-matrix";
import Mesh from "../../display/mesh/Mesh";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import PerspectiveCamera from "../camera/PerspectiveCamera";
import AController from "../core/AController";
let currentEventView;
let tMTX0 = mat4.create();
const displacementMTX = mat4.create();
const displacementVec3 = vec3.create();
/**
 * 기본 3D 카메라 컨트롤러(BasicController) 클래스입니다.
 * 키보드(WASD, QERFTG)와 마우스/터치로 카메라 이동·회전이 가능합니다.
 * 속도, 가속도, 키 매핑 등 다양한 파라미터를 지원합니다.
 *
 * @category Controller
 *
 * @example
 * ```javascript
 * const controller = new RedGPU.Camera.BasicController(redGPUContext);
 * controller.x = 10;
 * controller.y = 5;
 * controller.z = 20;
 * controller.pan = 30;
 * controller.tilt = 10;
 * controller.setMoveForwardKey('ArrowUp');
 * ```
 */
class BasicController extends AController {
    /** 연결된 View3D 인스턴스 */
    #targetView;
    /** 키 매핑 정보 */
    #keyNameMapper = {
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
    /** 이동 속도. 기본값 1 */
    #speed = 1;
    /** 이동 보간 딜레이. 기본값 0.1 */
    #delay = 0.1;
    /** 회전 속도. 기본값 1 */
    #speedRotation = 1;
    /** 회전 보간 딜레이. 기본값 0.1 */
    #delayRotation = 0.1;
    /** 최대 가속도. 기본값 3 */
    #maxAcceleration = 3;
    /** 현재 가속도 */
    #currentAcceleration = 0;
    /** 목표 위치 [x, y, z] */
    #desirePosition = [0, 0, 0];
    /** 목표 pan(수평 회전) */
    #desirePan = 0;
    /** 목표 tilt(수직 회전) */
    #desireTilt = 0;
    /** 내부 이동용 Mesh */
    #targetMesh;
    constructor(redGPUContext) {
        super();
        this.#targetMesh = new Mesh(redGPUContext);
        this.camera = new PerspectiveCamera();
        const isMobile = redGPUContext.detector.isMobile;
        const detector = {
            move: isMobile ? 'touchmove' : 'mousemove',
            up: isMobile ? 'touchend' : 'mouseup',
            down: isMobile ? 'touchstart' : 'mousedown',
        };
        let sX, sY;
        const checkArea = e => {
            let targetView = this.#targetView;
            if (currentEventView && targetView === currentEventView) {
                let tX, tY;
                let tViewRect = targetView.pixelRectObject;
                const { x, y } = this.getCanvasEventPoint(e, redGPUContext);
                if (isMobile) {
                    tX = x * window.devicePixelRatio * redGPUContext.renderScale;
                    tY = y * window.devicePixelRatio * redGPUContext.renderScale;
                }
                else {
                    tX = x * window.devicePixelRatio * redGPUContext.renderScale;
                    tY = y * window.devicePixelRatio * redGPUContext.renderScale;
                }
                if (!(tViewRect.x < tX && tX < tViewRect.x + tViewRect.width))
                    return;
                if (!(tViewRect.y < tY && tY < tViewRect.y + tViewRect.height))
                    return;
            }
            return true;
        };
        sX = 0;
        sY = 0;
        const HD_down = e => {
            currentEventView = this.#targetView;
            if (!checkArea(e))
                return;
            const { x, y } = this.getCanvasEventPoint(e, redGPUContext);
            sX = x;
            sY = y;
            redGPUContext.htmlCanvas.addEventListener(detector.move, HD_Move);
            window.addEventListener(detector.up, HD_up);
        };
        const HD_Move = e => {
            const { x, y } = this.getCanvasEventPoint(e, redGPUContext);
            const deltaX = x - sX;
            const deltaY = y - sY;
            sX = x;
            sY = y;
            this.#desirePan -= deltaX * this.#speedRotation * 0.1;
            this.#desireTilt -= deltaY * this.#speedRotation * 0.1;
        };
        const HD_up = () => {
            currentEventView = null;
            redGPUContext.htmlCanvas.removeEventListener(detector.move, HD_Move);
            window.removeEventListener(detector.up, HD_up);
        };
        redGPUContext.htmlCanvas.addEventListener(detector.down, HD_down);
    }
    ;
    get x() {
        return this.#targetMesh.x;
    }
    set x(value) {
        validateNumber(value);
        this.#targetMesh.x = value;
        this.#desirePosition[0] = value;
    }
    get y() {
        return this.#targetMesh.y;
    }
    set y(value) {
        validateNumber(value);
        this.#targetMesh.y = value;
        this.#desirePosition[1] = value;
    }
    get z() {
        return this.#targetMesh.z;
    }
    set z(value) {
        validateNumber(value);
        this.#targetMesh.z = value;
        this.#desirePosition[2] = value;
    }
    get tilt() {
        return this.#desireTilt;
    }
    set tilt(value) {
        validateNumber(value);
        this.#targetMesh.rotationX = value;
        this.#desireTilt = value;
    }
    get pan() {
        return this.#desirePan;
    }
    set pan(value) {
        validateNumber(value);
        this.#targetMesh.rotationY = value;
        this.#desirePan = value;
    }
    get keyNameMapper() {
        return { ...this.#keyNameMapper };
    }
    setMoveForwardKey(value) {
        this.#keyNameMapper.moveForward = value;
    }
    setMoveBackKey(value) {
        this.#keyNameMapper.moveBack = value;
    }
    setMoveLeftKey(value) {
        this.#keyNameMapper.moveLeft = value;
    }
    setMoveRightKey(value) {
        this.#keyNameMapper.moveRight = value;
    }
    setMoveUpKey(value) {
        this.#keyNameMapper.moveUp = value;
    }
    setMoveDownKey(value) {
        this.#keyNameMapper.moveDown = value;
    }
    setTurnLeftKey(value) {
        this.#keyNameMapper.turnLeft = value;
    }
    setTurnRightKey(value) {
        this.#keyNameMapper.turnRight = value;
    }
    setTurnUpKey(value) {
        this.#keyNameMapper.turnUp = value;
    }
    setTurnDownKey(value) {
        this.#keyNameMapper.turnDown = value;
    }
    update(view, time) {
        this.#targetView = view;
        const tDelay = this.#delay;
        const tDelayRotation = this.#delayRotation;
        const tDesirePosition = this.#desirePosition;
        const targetMesh = this.#targetMesh;
        // 움직임 체크
        // pan,tilt 타겟오브젝트에 반영
        targetMesh.rotationY += (this.#desirePan - targetMesh.rotationY) * tDelayRotation;
        targetMesh.rotationX += (this.#desireTilt - targetMesh.rotationX) * tDelayRotation;
        if (this.#checkKeyboardKeyBuffer(view)) {
            tMTX0 = targetMesh.modelMatrix;
            // 이동 매트릭스구함
            mat4.identity(displacementMTX);
            mat4.rotateY(displacementMTX, displacementMTX, targetMesh.rotationY * Math.PI / 180);
            mat4.rotateX(displacementMTX, displacementMTX, targetMesh.rotationX * Math.PI / 180);
            mat4.translate(displacementMTX, displacementMTX, displacementVec3);
            // 오브젝트에 적용할 x,y,z를 찾아냄
            mat4.identity(tMTX0);
            mat4.translate(tMTX0, tMTX0, targetMesh.position);
            mat4.multiply(tMTX0, tMTX0, displacementMTX);
            tDesirePosition[0] = tMTX0[12];
            tDesirePosition[1] = tMTX0[13];
            tDesirePosition[2] = tMTX0[14];
        }
        // 이동 계산
        targetMesh.x += (tDesirePosition[0] - targetMesh.x) * tDelay;
        targetMesh.y += (tDesirePosition[1] - targetMesh.y) * tDelay;
        targetMesh.z += (tDesirePosition[2] - targetMesh.z) * tDelay;
        // pan,tilt 타겟오브젝트에 반영
        targetMesh.rotationY += (this.#desirePan - targetMesh.rotationY) * tDelayRotation;
        targetMesh.rotationX += (this.#desireTilt - targetMesh.rotationX) * tDelayRotation;
        // 타겟 오브젝트 최종적용
        tMTX0 = targetMesh.modelMatrix;
        mat4.identity(tMTX0);
        mat4.translate(tMTX0, tMTX0, targetMesh.position);
        mat4.rotateY(tMTX0, tMTX0, targetMesh.rotationY * Math.PI / 180);
        mat4.rotateX(tMTX0, tMTX0, targetMesh.rotationX * Math.PI / 180);
        // 카메라를 오브젝트 바로 뒤에 위치시킴
        const tMTX1 = mat4.clone(tMTX0);
        mat4.translate(tMTX1, tMTX1, [0, 0, 0.01]);
        this.camera.setPosition(tMTX1[12], tMTX1[13], tMTX1[14]);
        // 카메라는 대상 오브젝트를 바라봄
        this.camera.lookAt(targetMesh.x, targetMesh.y, targetMesh.z);
    }
    #checkKeyboardKeyBuffer(view) {
        // 키보드 이벤트 체크
        if (!view.checkMouseInViewBounds())
            return;
        //
        const tSpeed = this.#speed;
        const tSpeedRotation = this.#speedRotation;
        const { keyboardKeyBuffer } = view.redGPUContext;
        const tKeyNameMapper = this.#keyNameMapper;
        let move = false;
        let rotate = false;
        let pan = 0;
        let tilt = 0;
        displacementVec3[0] = 0;
        displacementVec3[1] = 0;
        displacementVec3[2] = 0;
        const tempAccelerationValue = this.#currentAcceleration * tSpeed;
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
            if (this.#currentAcceleration > this.#maxAcceleration)
                this.#currentAcceleration = this.#maxAcceleration;
        }
        else {
            this.#currentAcceleration += -0.1;
            if (this.#currentAcceleration < 0)
                this.#currentAcceleration = 0;
        }
        //
        // pan,tilt 설정
        if (rotate) {
            this.#desirePan += pan;
            this.#desireTilt += tilt;
        }
        return move || rotate;
    }
}
export default BasicController;
