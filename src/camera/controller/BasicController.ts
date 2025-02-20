import {mat4, vec3} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import PerspectiveCamera from "../camera/PerspectiveCamera";
import AController from "../core/AController";

let currentEventView: View3D;
let tMTX0 = mat4.create();
const displacementMTX = mat4.create();
const displacementVec3 = vec3.create();
type KeyNameMapper = {
    moveForward: string,
    moveBack: string,
    moveLeft: string,
    moveRight: string,
    moveUp: string,
    moveDown: string,
    turnLeft: string,
    turnRight: string,
    turnUp: string,
    turnDown: string
};

class BasicController extends AController {
    #needUpdate = true;
    #targetView: View3D;
    #keyNameMapper: KeyNameMapper = {
        moveForward: 'w',
        moveBack: 's',
        moveLeft: 'a',
        moveRight: 'd',
        moveUp: 't',
        moveDown: 'g',
        //
        turnLeft: 'q',
        turnRight: 'e',
        turnUp: 'r',
        turnDown: 'f'
    }
    //
    #speed: number = 1
    #delay: number = 0.1
    #speedRotation: number = 1
    #delayRotation: number = 0.1
    #maxAcceleration: number = 3
    #currentAcceleration: number = 0
    //
    #desirePosition: [number, number, number] = [0, 0, 0]
    #desirePan: number = 0
    #desireTilt: number = 0
    //
    #targetMesh: Mesh

    constructor(redGPUContext: RedGPUContext) {
        super();
        this.#targetMesh = new Mesh(redGPUContext)
        this.camera = new PerspectiveCamera()
        const isMobile = redGPUContext.detector.isMobile
        const detector = {
            move: isMobile ? 'touchmove' : 'mousemove',
            up: isMobile ? 'touchend' : 'mouseup',
            down: isMobile ? 'touchstart' : 'mousedown',
        }
        let sX, sY;
        const checkArea = e => {
            let targetView = this.#targetView;
            if (currentEventView && targetView === currentEventView) {
                let tX, tY;
                let tViewRect = targetView.pixelRectObject;
                const {x, y} = this.getCanvasEventPoint(e, redGPUContext)
                if (isMobile) {
                    tX = x * window.devicePixelRatio * redGPUContext.renderScale;
                    tY = y * window.devicePixelRatio * redGPUContext.renderScale;
                } else {
                    tX = x * window.devicePixelRatio * redGPUContext.renderScale;
                    tY = y * window.devicePixelRatio * redGPUContext.renderScale;
                }
                if (!(tViewRect.x < tX && tX < tViewRect.x + tViewRect.width)) return;
                if (!(tViewRect.y < tY && tY < tViewRect.y + tViewRect.height)) return;
            }
            return true;
        };
        sX = 0;
        sY = 0;
        const HD_down = e => {
            currentEventView = this.#targetView;
            if (!checkArea(e)) return;
            const {x, y} = this.getCanvasEventPoint(e, redGPUContext)
            sX = x
            sY = y
            redGPUContext.htmlCanvas.addEventListener(detector.move, HD_Move);
            window.addEventListener(detector.up, HD_up);
        };
        const HD_Move = e => {
            const {x, y} = this.getCanvasEventPoint(e, redGPUContext)
            const deltaX = x - sX
            const deltaY = y - sY
            sX = x
            sY = y
            this.#desirePan -= deltaX * this.#speedRotation * 0.1;
            this.#desireTilt -= deltaY * this.#speedRotation * 0.1;
        };
        const HD_up = () => {
            currentEventView = null
            redGPUContext.htmlCanvas.removeEventListener(detector.move, HD_Move);
            window.removeEventListener(detector.up, HD_up);
        };
        redGPUContext.htmlCanvas.addEventListener(detector.down, HD_down);
    };

    get x(): number {
        return this.#targetMesh.x;
    }

    set x(value: number) {
        validateNumber(value)
        this.#targetMesh.x = value
        this.#desirePosition[0] = value
    }

    get y(): number {
        return this.#targetMesh.y;
    }

    set y(value: number) {
        validateNumber(value)
        this.#targetMesh.y = value
        this.#desirePosition[1] = value
    }

    get z(): number {
        return this.#targetMesh.z;
    }

    set z(value: number) {
        validateNumber(value)
        this.#targetMesh.z = value
        this.#desirePosition[2] = value
    }

    get tilt(): number {
        return this.#desireTilt;
    }

    set tilt(value: number) {
        validateNumber(value)
        this.#targetMesh.rotationX = value;
        this.#desireTilt = value;
    }

    get pan(): number {
        return this.#desirePan;
    }

    set pan(value: number) {
        validateNumber(value)
        this.#targetMesh.rotationY = value;
        this.#desirePan = value;
    }

    get keyNameMapper(): KeyNameMapper {
        return {...this.#keyNameMapper};
    }

    setMoveForwardKey(value: string) {
        this.#keyNameMapper.moveForward = value
    }

    setMoveBackKey(value: string) {
        this.#keyNameMapper.moveBack = value
    }

    setMoveLeftKey(value: string) {
        this.#keyNameMapper.moveLeft = value
    }

    setMoveRightKey(value: string) {
        this.#keyNameMapper.moveRight = value
    }

    setMoveUpKey(value: string) {
        this.#keyNameMapper.moveUp = value
    }

    setMoveDownKey(value: string) {
        this.#keyNameMapper.moveDown = value
    }

    setTurnLeftKey(value: string) {
        this.#keyNameMapper.turnLeft = value
    }

    setTurnRightKey(value: string) {
        this.#keyNameMapper.turnRight = value
    }

    setTurnUpKey(value: string) {
        this.#keyNameMapper.turnUp = value
    }

    setTurnDownKey(value: string) {
        this.#keyNameMapper.turnDown = value
    }

    update(view: View3D) {
        this.#targetView = view
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
        this.camera.setPosition(tMTX1[12], tMTX1[13], tMTX1[14])
        // 카메라는 대상 오브젝트를 바라봄
        this.camera.lookAt(targetMesh.x, targetMesh.y, targetMesh.z);
    }

    #checkKeyboardKeyBuffer(view: View3D) {
        // 키보드 이벤트 체크
        if (!view.checkMouseInViewBounds()) return
        //
        const tSpeed = this.#speed;
        const tSpeedRotation = this.#speedRotation;
        const {keyboardKeyBuffer} = view.redGPUContext;
        const tKeyNameMapper = this.#keyNameMapper;
        let move = false;
        let rotate = false;
        let pan = 0;
        let tilt = 0;
        displacementVec3[0] = 0;
        displacementVec3[1] = 0;
        displacementVec3[2] = 0;
        const tempAccelerationValue = this.#currentAcceleration * tSpeed
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
            if (this.#currentAcceleration > this.#maxAcceleration) this.#currentAcceleration = this.#maxAcceleration
        } else {
            this.#currentAcceleration += -0.1;
            if (this.#currentAcceleration < 0) this.#currentAcceleration = 0
        }
        //
        // pan,tilt 설정
        if (rotate) {
            this.#desirePan += pan;
            this.#desireTilt += tilt;
        }
        return move || rotate
    }
}

export default BasicController
