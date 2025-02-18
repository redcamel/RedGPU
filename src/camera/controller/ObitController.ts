import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";
import PerspectiveCamera from "../camera/PerspectiveCamera";
import AController from "../core/AController";

let currentEventView: View3D;

class ObitController extends AController {
    #instanceId: number
    #centerX = 0;
    #centerY = 0;
    #centerZ = 0;
    //
    #distance = 15;
    #speedDistance = 5;
    #delayDistance = 0.1;
    //
    #speedRotation = 4;
    #delayRotation = 0.78;
    //
    #tilt = -45;
    #minTilt = -90;
    #maxTilt = 90;
    #pan = 0;
    //
    #currentPan = 0;
    #currentTilt = 0;
    #currentDistance = 0;
    //
    #targetView: View3D;
    #name: string

    constructor(redGPUContext: RedGPUContext) {
        super();
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
                    tX = x * window.devicePixelRatio;
                    tY = y * window.devicePixelRatio;
                } else {
                    tX = x * window.devicePixelRatio;
                    tY = y * window.devicePixelRatio;
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
            console.log(x, y)
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
            this.#pan -= deltaX * this.#speedRotation * 0.1;
            this.#tilt -= deltaY * this.#speedRotation * 0.1;
        };
        const HD_up = () => {
            currentEventView = null
            redGPUContext.htmlCanvas.removeEventListener(detector.move, HD_Move);
            window.removeEventListener(detector.up, HD_up);
        };
        const HD_wheel = e => {
            currentEventView = this.#targetView;
            if (!checkArea(e)) return;
            console.log('보자', this.name)
            this.#distance += e['deltaY'] / 100 * this.#speedDistance;
            currentEventView = null
        };
        redGPUContext.htmlCanvas.addEventListener(detector.down, HD_down);
        redGPUContext.htmlCanvas.addEventListener('wheel', HD_wheel);
    };

    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    set name(value: string) {
        this.#name = value;
    }

    get centerX() {
        return this.#centerX;
    }

    set centerX(value) {
        this.#centerX = value;
    }

    get centerY() {
        return this.#centerY;
    }

    set centerY(value) {
        this.#centerY = value;
    }

    get centerZ() {
        return this.#centerZ;
    }

    set centerZ(value) {
        this.#centerZ = value;
    }

    get distance() {
        return this.#distance;
    }

    set distance(value) {
        validateNumberRange(value, 0)
        this.#distance = value;
    }

    get speedDistance() {
        return this.#speedDistance;
    }

    set speedDistance(value) {
        validateNumberRange(value, 0.01)
        this.#speedDistance = value;
    }

    get delayDistance() {
        return this.#delayDistance;
    }

    set delayDistance(value) {
        validateNumberRange(value, 0.01, 0.99)
        this.#delayDistance = value;
    }

    get speedRotation() {
        return this.#speedRotation;
    }

    set speedRotation(value) {
        validateNumberRange(value, 0.01)
        this.#speedRotation = value;
    }

    get delayRotation() {
        return this.#delayRotation;
    }

    set delayRotation(value) {
        validateNumberRange(value, 0.01, 0.99)
        this.#delayRotation = value;
    }

    get minTilt() {
        return this.#minTilt;
    }

    set minTilt(value) {
        validateNumberRange(value, -90, 90)
        this.#minTilt = value;
    }

    get maxTilt() {
        return this.#maxTilt;
    }

    set maxTilt(value) {
        validateNumberRange(value, -90, 90)
        this.#maxTilt = value;
    }

    get pan() {
        return this.#pan;
    }

    set pan(value) {
        this.#pan = value;
    }

    get tilt() {
        return this.#tilt;
    }

    set tilt(value) {
        validateNumberRange(value, -90, 90)
        this.#tilt = value;
    }

    update(view: View3D) {
        this.#targetView = view
        let tDelayRotation;
        let tMTX0;
        let PER_PI;
        PER_PI = Math.PI / 180;
        if (this.#tilt < this.#minTilt) this.#tilt = this.#minTilt;
        if (this.#tilt > this.#maxTilt) this.#tilt = this.#maxTilt;
        tDelayRotation = (1 - this.#delayRotation);
        const {camera} = this
        tMTX0 = camera.modelMatrix;
        this.#currentPan += (this.#pan - this.#currentPan) * tDelayRotation;
        this.#currentTilt += (this.#tilt - this.#currentTilt) * tDelayRotation;
        if (this.#distance < camera.nearClipping) this.#distance = camera.nearClipping;
        this.#currentDistance += (this.#distance - this.#currentDistance) * (1 - this.#delayDistance);
        if (this.#currentDistance < camera.nearClipping) this.#currentDistance = camera.nearClipping;
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

export default ObitController
