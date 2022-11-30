import RedGPUContext from "../../context/RedGPUContext";
import throwError from "../../util/errorFunc/throwError";
import {mat4} from "../../util/gl-matrix";
import RedGPUContextBase from "../../context/RedGPUContextBase";
import ViewDebugger from "./ViewDebugger";
import redGPUContext from "../../context/RedGPUContext";

class ViewBase extends RedGPUContextBase {
    #dirtyViewRect: boolean = true

    #x: number | string = 0;
    get x(): number | string {
        return this.#x;
    }

    set x(value: number | string) {
        switch (typeof value) {
            case 'number' :
                this.#x = value;
                break
            case 'string' :
                if (value.includes('%')) {
                    this.#x = value;
                    break
                }
            default :
                throwError('x : ', '숫자나 %모델만 허용됩니다.')

        }
        this.calcPixelViewRect()
    }

    #y: number | string = 0;
    get y(): number | string {
        return this.#y;
    }

    set y(value: number | string) {
        switch (typeof value) {
            case 'number' :
                this.#y = value;
                break
            case 'string' :
                if (value.includes('%')) {
                    this.#y = value;
                    break
                }
            default :
                throwError('y : ', '숫자 or %모델 만 허용됩니다.')
        }
        this.calcPixelViewRect()
    }

    #width: number | string = '100%';
    get width(): number | string {
        return this.#width;
    }

    set width(value: number | string) {
        const msg = 'width : 음수가 아닌 숫자 or %모델 만 허용됩니다.'
        switch (typeof value) {
            case 'number' :
                if (value >= 0) {
                    this.#width = value;
                    break
                }
                throwError(msg)
                break
            case 'string' :
                if (value.includes('%')) {
                    if (+value.replace('%', '') >= 0) {
                        this.#width = value;
                        break
                    }
                }
            default :
                throwError(msg)
        }
        this.calcPixelViewRect()
    }

    #height: number | string = '100%';
    get height(): number | string {
        return this.#height;
    }

    set height(value: number | string) {
        const msg = 'width : 음수가 아닌 숫자 or %모델 만 허용됩니다.'
        switch (typeof value) {
            case 'number' :
                if (value >= 0) {
                    this.#height = value;
                    break
                }
                throwError(msg)
                break
            case 'string' :
                if (value.includes('%')) {
                    if (+value.replace('%', '') >= 0) {
                        this.#height = value;
                        break
                    }
                }
            default :
                throwError(msg)
        }
        this.calcPixelViewRect()
    }

    #pixelViewRect = [0, 0, 0, 0]
    get pixelViewRect(): number[] {
        return this.#pixelViewRect;
    }


    calcPixelViewRect() {
        const parentPixelSize = this.redGPUContext.pixelSize
        const {renderScale} = this.redGPUContext
        this.#pixelViewRect = [
            ((typeof this.#x === 'number' ? this.#x : parentPixelSize.width * parseFloat(this.#x) / 100) ),
            ((typeof this.#y === 'number' ? this.#y : parentPixelSize.height * parseFloat(this.#y) / 100) ),
            ((typeof this.#width === 'number' ? this.#width : parentPixelSize.width * parseFloat(this.#width) / 100) ),
            ((typeof this.#height === 'number' ? this.#height : parentPixelSize.height * parseFloat(this.#height) / 100) ),
        ]

        this.#dirtyViewRect = true
    }

    setSize(w = this.#width, h = this.#height) {
        this.width = w
        this.height = h
    }

    setLocation(x = this.#x, y = this.#y) {
        this.x = x
        this.y = y
    }

    #projectionMatrix = mat4.create()
    get projectionMatrix(): any {
        return this.#projectionMatrix;
    }

    get inverseProjectionMatrix(): any {
        return mat4.invert(mat4.create(), this.#projectionMatrix);
    }

    #viewDebugger: ViewDebugger = new ViewDebugger()
    get viewDebugger(): ViewDebugger {
        return this.#viewDebugger;
    }

    /**
     *
     * @param redGPUContext
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext)
    }

}

export default ViewBase
