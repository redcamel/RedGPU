import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import RedGPUContext from "../RedGPUContext";

type ParentRect = {
    x: number,
    y: number,
    width: number;
    height: number;
}

/**
 * The RedGPUContextSizeManager class manages the size and scale of the RedGPUContext.
 */
class RedGPUContextSizeManager {
    #width: number | string
    #height: number | string
    #redGPUContext: RedGPUContext
    #pixelRectArray: [number, number, number, number] = [0, 0, 0, 0]
    readonly #htmlCanvas: HTMLCanvasElement
    #renderScale: number = 1

    constructor(redGPUContext: RedGPUContext, width: number | string = '100%', height: number | string = '100%') {
        this.#redGPUContext = redGPUContext
        this.#htmlCanvas = redGPUContext.htmlCanvas
        this.#htmlCanvas.style.boxSizing = 'border-box'
        this.#width = width
        this.#height = height
    }

    /**
     * 렌더링 스케일 반환
     */
    get renderScale(): number {
        return this.#renderScale;
    }

    /**
     * Sets the rendering scale.
     *
     * @param {number} value - The rendering scale. If the value is less than or equal to 0, it will be converted to 0.01.
     */
    set renderScale(value: number) {
        validateNumber(value)
        if (value <= 0) value = 0.01
        this.#renderScale = value;
        this.setSize()
    }

    get width() {
        return this.#width;
    }

    /**
     * width 설정
     * - positive number, px, % 만 허용
     * - %로 설정될경우 canvas의 부모 node 사이즈 기반으로 계산됨
     * - 계산된 결과는 pixelRect에 적용됨
     * @param value
     */
    set width(value: number | string) {
        this.setSize(value, this.#height)
    }

    get height() {
        return this.#height;
    }

    /**
     * height 설정
     * - positive number, px, % 만 허용
     * - %로 설정될경우 canvas의 부모 node 사이즈 기반으로 계산됨
     * - 계산된 결과는 pixelRect에 적용됨
     * @param value
     */
    set height(value: number | string) {
        this.setSize(this.#width, value)
    }

    /**
     * 현재 width, height, renderScale 기반 렌더링될 실제 pixel(정수)단위의 Rect를 배열로 반환
     *
     */
    get pixelRectArray() {
        return this.#pixelRectArray;
    }

    /**
     * 현재 width, height, renderScale 기반 렌더링될 실제 pixel(정수)단위의 Rect를 객체로 반환
     */
    get pixelRectObject() {
        return {
            x: this.#pixelRectArray[0],
            y: this.#pixelRectArray[1],
            width: this.#pixelRectArray[2],
            height: this.#pixelRectArray[3]
        };
    }

    /**
     * Retrieves the rectangular dimensions of the parent DOM element of the HTML canvas.
     *
     * @returns {DOMRect} The DOMRect object representing the dimensions of the parent element.
     */
    get parentDomRect(): DOMRect {
        return (this.#htmlCanvas.parentNode || document.body)['getBoundingClientRect']()
    }

    get screenRectObject() {
        return {
            x: this.#pixelRectArray[0] / devicePixelRatio,
            y: this.#pixelRectArray[1] / devicePixelRatio,
            width: this.#pixelRectArray[2] / devicePixelRatio,
            height: this.#pixelRectArray[3] / devicePixelRatio
        };
    }

    /**
     * 사이즈로 사용가능한 값인지 체크	 * positive number, px, % 만 허용
     * @param value
     */
    static validateSizeValue = (value: string | number) => {
        switch (typeof value) {
            case 'number':
                validatePositiveNumberRange(value)
                break;
            case 'string':
                const sizeModel = new RegExp(/^[+]?^[.]?(\d+)(\.\d+)?(?:px|%|$)/gm)
                if (!sizeModel.test(value)) consoleAndThrowError(`allow positive number, %, px model / input : ${value}`)
                break;
            default :
                consoleAndThrowError(`positive number, %, px model / input : ${value}`)
                break;
        }
    }

    /**
     * 포지션으로 사용가능한 값인지 체크	 *  number, px, % 만 허용
     * @param value
     */
    static validatePositionValue = (value: string | number) => {
        // console.log(typeof value,value)
        switch (typeof value) {
            case 'number':
                validateNumber(value)
                break;
            case 'string':
                //TODO - RedGPUContext 와 View에서 소수점 계산을 나눠야하나 체크해야함
                const sizeModel = new RegExp(/^-?\d+(\.\d+)?(px|%)?$/);
                if (!sizeModel.test(value)) consoleAndThrowError(`allow number, %, px model  / input : ${value}`);
                break;
            default :
                consoleAndThrowError(`number, %, px model / input : ${value}`)
                break;
        }
    }

    static getPixelDimension(parentRect: ParentRect, key: string, value: string | number): number {
        return typeof value === 'number' ? value : RedGPUContextSizeManager.calculateSizeFromString(parentRect, key, value);
    }

    /**
     * Calculates the size value based on the given `rect` object, `key`, and `value`.
     * If the `value` contains a percentage sign (%), the method returns the calculated size value.
     * If the `value` does not contain a percentage sign, the method returns the size value as is.
     *
     * @param {object} rect - The rectangle object containing `x`, `y`, `width`, and `height` properties.
     * @param {string} key - The key corresponding to the property of the `rect` object that should be used for calculations.
     * @param {string} value - The value to calculate the size from. Can be a percentage with a `%` suffix or pixel value with a `px` suffix.
     *
     * @return {number} - The calculated size value based on the given `value` and `rect` object.
     */
    static calculateSizeFromString(rect: {
        x: number,
        y: number,
        width: number,
        height: number
    }, key: string, value: string) {
        if (value.includes('%')) {
            return Math.floor(rect[key] * (+value.replace('%', '')) / 100)
        } else {
            return +value.replace('px', '')
        }
    }

    /**
     * Sets the size of the element. If width and height are not provided,
     * the current width and height values are used.
     *
     * @param {string|number} [w] - The new width of the element.
     * @param {string|number} [h] - The new height of the element.
     */
    setSize(w: string | number = this.#width, h: string | number = this.#height) {
        RedGPUContextSizeManager.validateSizeValue(w)
        RedGPUContextSizeManager.validateSizeValue(h)
        this.#width = w;
        this.#height = h;
        const tW =  RedGPUContextSizeManager.getPixelDimension(this.parentDomRect, 'width', w)
        const tH =  RedGPUContextSizeManager.getPixelDimension(this.parentDomRect, 'height', h)
        this.#changeCanvasStyles(tW, tH);
        this.#updatePixelRect(tW, tH)
        this.#updateViewsSize()
        // console.log(this.parentDomRect)
        console.log(
          `${this.constructor.name}.setSize - input : ${w},${h} | output : ${tW}, ${tH}`,
          {
              width: this.#width,
              height: this.#height,
              pixelRectArray: this.#pixelRectArray
          });

    }

    #updatePixelRect(tW: number, tH: number) {
        this.#pixelRectArray[2] = Math.floor(tW * this.#renderScale * window.devicePixelRatio);
        this.#pixelRectArray[3] = Math.floor(tH * this.#renderScale * window.devicePixelRatio);
    }

    /**
     * Updates the size of all views in the redGPUContext.viewList array.
     *
     */
    #updateViewsSize() {
        if (this.#redGPUContext.onResize) {
            this.#redGPUContext.onResize(this.screenRectObject.width, this.screenRectObject.height);
        }
        this.#redGPUContext.viewList.forEach((view: View3D) => {
            view.setSize()
            view.setPosition()
        });
    }

    /**
     * Change the width and height of the canvas element and update its styles.
     *
     * @param {number} width - The new width of the canvas.
     * @param {number} height - The new height of the canvas.
     * @return {void}
     */
    #changeCanvasStyles(width: number, height: number): void {
        const cvs = this.#htmlCanvas
        const {style} = cvs
        cvs.width = width * this.#renderScale * window.devicePixelRatio;
        cvs.height = height * this.#renderScale * window.devicePixelRatio;
        style.width = `${width}px`;
        style.height = `${height}px`;
    }
}

export default RedGPUContextSizeManager
