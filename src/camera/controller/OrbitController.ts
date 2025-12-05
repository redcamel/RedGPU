import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import PerspectiveCamera from "../camera/PerspectiveCamera";
import AController from "../core/AController";

let currentEventView: View3D;

/**
 * 오빗(Orbit) 카메라 컨트롤러 클래스입니다.
 * 마우스/터치 드래그로 회전, 휠로 줌, 중심점/거리/회전/틸트 등 다양한 파라미터를 지원합니다.
 * 여러 View3D에서 동시에 사용할 수 있습니다.
 *
 * @category Controller
 *
 * @example
 * ```javascript
 * const controller = new RedGPU.Camera.OrbitController(redGPUContext);
 * controller.centerX = 0;
 * controller.centerY = 0;
 * controller.centerZ = 0;
 * controller.distance = 20;
 * controller.tilt = -30;
 * controller.pan = 45;
 * ```
 */
class OrbitController extends AController {
    /** 중심 X */
    #centerX = 0;
    /** 중심 Y */
    #centerY = 0;
    /** 중심 Z */
    #centerZ = 0;
    /** 카메라 거리. 기본값 15 */
    #distance = 15;
    /** 줌 속도. 기본값 2 */
    #speedDistance = 2;
    /** 줌 보간 딜레이. 기본값 0.1 */
    #delayDistance = 0.1;
    /** 회전 속도. 기본값 3 */
    #speedRotation = 3;
    /** 회전 보간 딜레이. 기본값 0.1 */
    #delayRotation = 0.1;
    /** 틸트(수직 각도). 기본값 -35 */
    #tilt = -35;
    /** 최소 틸트. 기본값 -90 */
    #minTilt = -90;
    /** 최대 틸트. 기본값 90 */
    #maxTilt = 90;
    /** 팬(수평 각도). 기본값 0 */
    #pan = 0;
    // 애니메이션용 현재 상태
    #currentPan = 0;
    #currentTilt = 0;
    #currentDistance = 0;


    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.camera = new PerspectiveCamera();
        const isMobile = redGPUContext.detector.isMobile;
        const detector = {
            move: isMobile ? 'touchmove' : 'mousemove',
            up: isMobile ? 'touchend' : 'mouseup',
            down: isMobile ? 'touchstart' : 'mousedown',
        };
        let sX: number, sY: number;

        sX = 0;
        sY = 0;
        const HD_down = (e: MouseEvent | TouchEvent) => {
            // 현재 마우스/터치 위치에서 해당하는 View 찾기
            const targetView = this.findTargetViewByInputEvent(e);
            if (!targetView) return;
            // 찾은 View를 현재 이벤트 View로 설정
            currentEventView = targetView;
            const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
            sX = x;
            sY = y;
            redGPUContext.htmlCanvas.addEventListener(detector.move, HD_Move);
            window.addEventListener(detector.up, HD_up);
        };
        const HD_Move = (e: MouseEvent | TouchEvent) => {
            // 현재 이벤트가 진행 중인 View가 있는지 확인
            if (!currentEventView) return;
            const {x, y} = this.getCanvasEventPoint(e, redGPUContext);
            const deltaX = x - sX;
            const deltaY = y - sY;
            sX = x;
            sY = y;
            this.#pan -= deltaX * this.#speedRotation * 0.1;
            this.#tilt -= deltaY * this.#speedRotation * 0.1;
        };
        const HD_up = () => {
            currentEventView = null;
            redGPUContext.htmlCanvas.removeEventListener(detector.move, HD_Move);
            window.removeEventListener(detector.up, HD_up);
        };
        const HD_wheel = (e: WheelEvent) => {
            // 현재 마우스 위치에서 해당하는 View 찾기
            const targetView = this.findTargetViewByInputEvent(e);
            e.stopPropagation()
            e.preventDefault()
            if (!targetView) return;
            // 거리 조정
            this.#distance += e.deltaY / 100 * this.#speedDistance;
        };
        redGPUContext.htmlCanvas.addEventListener(detector.down, HD_down);
        redGPUContext.htmlCanvas.addEventListener('wheel', HD_wheel);
    }


    get centerX(): number {
        return this.#centerX;
    }

    set centerX(value: number) {
        this.#centerX = value;
    }

    get centerY(): number {
        return this.#centerY;
    }

    set centerY(value: number) {
        this.#centerY = value;
    }

    get centerZ(): number {
        return this.#centerZ;
    }

    set centerZ(value: number) {
        this.#centerZ = value;
    }

    get distance(): number {
        return this.#distance;
    }

    set distance(value: number) {
        validateNumberRange(value, 0);
        this.#distance = value;
    }

    get speedDistance(): number {
        return this.#speedDistance;
    }

    set speedDistance(value: number) {
        validateNumberRange(value, 0.01);
        this.#speedDistance = value;
    }

    get delayDistance(): number {
        return this.#delayDistance;
    }

    set delayDistance(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#delayDistance = value;
    }

    get speedRotation(): number {
        return this.#speedRotation;
    }

    set speedRotation(value: number) {
        validateNumberRange(value, 0.01);
        this.#speedRotation = value;
    }

    get delayRotation(): number {
        return this.#delayRotation;
    }

    set delayRotation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#delayRotation = value;
    }

    get minTilt(): number {
        return this.#minTilt;
    }

    set minTilt(value: number) {
        validateNumberRange(value, -90, 90);
        this.#minTilt = value;
    }

    get maxTilt(): number {
        return this.#maxTilt;
    }

    set maxTilt(value: number) {
        validateNumberRange(value, -90, 90);
        this.#maxTilt = value;
    }

    get pan(): number {
        return this.#pan;
    }

    set pan(value: number) {
        this.#pan = value;
    }

    get tilt(): number {
        return this.#tilt;
    }

    set tilt(value: number) {
        validateNumberRange(value, -90, 90);
        this.#tilt = value;
    }

    update(view: View3D, time: number): void {
        super.update(view, time, () => {
            this.#updateAnimation()
        })
    }

    #updateAnimation(): void {
        const PER_PI = Math.PI / 180;
        // tilt 범위 제한
        if (this.#tilt < this.#minTilt) this.#tilt = this.#minTilt;
        if (this.#tilt > this.#maxTilt) this.#tilt = this.#maxTilt;
        const {camera} = this;
        // 공통 현재 상태를 목표값으로 애니메이션
        this.#currentPan += (this.#pan - this.#currentPan) * this.#delayRotation;
        this.#currentTilt += (this.#tilt - this.#currentTilt) * this.#delayRotation;
        if (this.#distance < camera.nearClipping) this.#distance = camera.nearClipping;
        this.#currentDistance += (this.#distance - this.#currentDistance) * this.#delayDistance;
        if (this.#currentDistance < camera.nearClipping) this.#currentDistance = camera.nearClipping;
        const tMTX0 = camera.modelMatrix;
        mat4.identity(tMTX0);
        mat4.translate(tMTX0, tMTX0, [this.#centerX, this.#centerY, this.#centerZ]);
        mat4.rotateY(tMTX0, tMTX0, this.#currentPan * PER_PI);
        mat4.rotateX(tMTX0, tMTX0, this.#currentTilt * PER_PI);
        mat4.translate(tMTX0, tMTX0, [0, 0, this.#currentDistance]);
        camera.x = tMTX0[12];
        camera.y = tMTX0[13];
        camera.z = tMTX0[14];
        this.camera.lookAt(this.#centerX, this.#centerY, this.#centerZ);
    }
}

export default OrbitController;
