import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import RedGPUContext from "../RedGPUContext";

/**
 * [KO] 사각형 영역 정보를 나타내는 인터페이스입니다.
 * [EN] Interface representing rectangular area information.
 */
export interface IRedGPURectObject {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * [KO] 리사이즈 이벤트 객체 인터페이스
 * [EN] Resize event object interface
 */
export interface RedResizeEvent<T = any> {
    target: T;
    screenRect: IRedGPURectObject;
    pixelRect: IRedGPURectObject;
}

type ParentRect = {
    x: number,
    y: number,
    width: number;
    height: number;
}

/**
 * [KO] 캔버스 크기 및 렌더링 스케일을 관리하는 클래스입니다.
 * [EN] Class that manages canvas size and rendering scale.
 *
 * [KO] 픽셀(px) 또는 백분율(%) 단위로 크기를 설정할 수 있으며, 렌더링 해상도 조절 기능을 제공합니다.
 * [EN] You can set the size in pixels (px) or percentages (%), and it provides rendering resolution adjustment functions.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * const sizeManager = redGPUContext.sizeManager;
 * sizeManager.renderScale = 0.5; // Reduce resolution to 50%
 * sizeManager.setSize('100%', '100%');
 * ```
 *
 * @category Context
 */
class RedGPUContextSizeManager {
    #width: number | string
    #height: number | string
    #redGPUContext: RedGPUContext
    #pixelRectArray: [number, number, number, number] = [0, 0, 0, 0]
    readonly #htmlCanvas: HTMLCanvasElement
    #renderScale: number = 1

    /**
     * [KO] RedGPUContextSizeManager 생성자
     * [EN] RedGPUContextSizeManager constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 초기 너비 (기본값: '100%')
     * [EN] Initial width (default: '100%')
     * @param height -
     * [KO] 초기 높이 (기본값: '100%')
     * [EN] Initial height (default: '100%')
     */
    constructor(redGPUContext: RedGPUContext, width: number | string = '100%', height: number | string = '100%') {
        this.#redGPUContext = redGPUContext
        this.#htmlCanvas = redGPUContext.htmlCanvas
        this.#htmlCanvas.style.boxSizing = 'border-box'
        this.#width = width
        this.#height = height
    }

    /**
     * [KO] 렌더링 스케일을 반환합니다.
     * [EN] Returns the rendering scale.
     */
    get renderScale(): number {
        return this.#renderScale;
    }

    /**
     * [KO] 렌더링 스케일을 설정합니다.
     * [EN] Sets the rendering scale.
     * @param value -
     * [KO] 렌더 스케일 값 (0.01 이상)
     * [EN] Render scale value (0.01 or more)
     */
    set renderScale(value: number) {
        validateNumber(value)
        if (value <= 0) value = 0.01
        this.#renderScale = value;
        this.setSize()
    }

    /**
     * [KO] 설정된 너비 값을 반환합니다.
     * [EN] Returns the set width value.
     */
    get width() {
        return this.#width;
    }

    /**
     * [KO] 너비를 설정합니다. (px, % 또는 숫자)
     * [EN] Sets the width. (px, %, or number)
     * @param value -
     * [KO] 너비 값
     * [EN] Width value
     */
    set width(value: number | string) {
        this.setSize(value, this.#height)
    }

    /**
     * [KO] 설정된 높이 값을 반환합니다.
     * [EN] Returns the set height value.
     */
    get height() {
        return this.#height;
    }

    /**
     * [KO] 높이를 설정합니다. (px, % 또는 숫자)
     * [EN] Sets the height. (px, %, or number)
     * @param value -
     * [KO] 높이 값
     * [EN] Height value
     */
    set height(value: number | string) {
        this.setSize(this.#width, value)
    }

    /**
     * [KO] 현재 렌더링될 실제 픽셀 단위 Rect를 배열로 반환합니다. [x, y, w, h]
     * [EN] Returns the actual pixel rect to be rendered as an array. [x, y, w, h]
     */
    get pixelRectArray() {
        return this.#pixelRectArray;
    }

    /**
     * [KO] 현재 렌더링될 실제 픽셀 단위 Rect를 객체로 반환합니다.
     * [EN] Returns the actual pixel rect to be rendered as an object.
     */
    get pixelRectObject(): IRedGPURectObject {
        return {
            x: this.#pixelRectArray[0],
            y: this.#pixelRectArray[1],
            width: this.#pixelRectArray[2],
            height: this.#pixelRectArray[3]
        };
    }

    /**
     * [KO] 캔버스의 부모 DOM 요소의 크기 정보를 반환합니다.
     * [EN] Returns the dimension information of the canvas's parent DOM element.
     */
    get parentDomRect(): DOMRect {
        return (this.#htmlCanvas.parentNode || document.body)['getBoundingClientRect']()
    }

    get screenRectObject(): IRedGPURectObject {
        return {
            x: this.#pixelRectArray[0] / devicePixelRatio,
            y: this.#pixelRectArray[1] / devicePixelRatio,
            width: this.#pixelRectArray[2] / devicePixelRatio,
            height: this.#pixelRectArray[3] / devicePixelRatio
        };
    }

    /**
     * [KO] 입력값이 유효한 사이즈 값인지 검증합니다. (양수, px, %)
     * [EN] Validates if the input value is a valid size value. (positive number, px, %)
     * @param value -
     * [KO] 검증할 값
     * [EN] Value to validate
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
     * [KO] 입력값이 유효한 위치 값인지 검증합니다. (숫자, px, %)
     * [EN] Validates if the input value is a valid position value. (number, px, %)
     * @param value -
     * [KO] 검증할 값
     * [EN] Value to validate
     */
    static validatePositionValue = (value: string | number) => {
        // console.log(typeof value,value)
        switch (typeof value) {
            case 'number':
                validateNumber(value)
                break;
            case 'string':
                const sizeModel = new RegExp(/^-?\d+(\.\d+)?(px|%)?$/);
                if (!sizeModel.test(value)) consoleAndThrowError(`allow number, %, px model  / input : ${value}`);
                break;
            default :
                consoleAndThrowError(`number, %, px model / input : ${value}`)
                break;
        }
    }

    /**
     * [KO] 부모 Rect를 기준으로 픽셀 크기를 계산하여 반환합니다.
     * [EN] Calculates and returns the pixel size based on the parent Rect.
     * @param parentRect -
     * [KO] 부모 Rect
     * [EN] Parent Rect
     * @param key -
     * [KO] 참조할 키 (width 또는 height)
     * [EN] Key to reference (width or height)
     * @param value -
     * [KO] 값 (숫자 또는 문자열)
     * [EN] Value (number or string)
     */
    static getPixelDimension(parentRect: ParentRect, key: string, value: string | number): number {
        return typeof value === 'number' ? value : RedGPUContextSizeManager.calculateSizeFromString(parentRect, key, value);
    }

    /**
     * [KO] 문자열 값(px, %)을 픽셀 단위 숫자로 변환합니다.
     * [EN] Converts string value (px, %) to pixel number.
     * @param rect -
     * [KO] 참조 Rect 객체
     * [EN] Reference Rect object
     * @param key -
     * [KO] 참조할 키
     * [EN] Key to reference
     * @param value -
     * [KO] 변환할 문자열 값
     * [EN] String value to convert
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
     * [KO] 요소의 크기를 설정하고 캔버스 스타일을 업데이트합니다.
     * [EN] Sets the size of the element and updates the canvas style.
     * @param w -
     * [KO] 너비 (기본값: 현재 width)
     * [EN] Width (default: current width)
     * @param h -
     * [KO] 높이 (기본값: 현재 height)
     * [EN] Height (default: current height)
     */
    setSize(w: string | number = this.#width, h: string | number = this.#height) {
        RedGPUContextSizeManager.validateSizeValue(w)
        RedGPUContextSizeManager.validateSizeValue(h)
        this.#width = w;
        this.#height = h;
        const tW = RedGPUContextSizeManager.getPixelDimension(this.parentDomRect, 'width', w)
        const tH = RedGPUContextSizeManager.getPixelDimension(this.parentDomRect, 'height', h)
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

    /**
     * [KO] 픽셀 Rect 정보를 업데이트합니다. (내부용)
     * [EN] Updates pixel Rect information. (Internal use)
     */
    #updatePixelRect(tW: number, tH: number) {
        this.#pixelRectArray[2] = Math.floor(tW * this.#renderScale * window.devicePixelRatio);
        this.#pixelRectArray[3] = Math.floor(tH * this.#renderScale * window.devicePixelRatio);
    }

    /**
     * [KO] 등록된 모든 View3D의 크기를 업데이트합니다. (내부용)
     * [EN] Updates the size of all registered View3Ds. (Internal use)
     */
    #updateViewsSize() {
        if (this.#redGPUContext.onResize) {
            this.#redGPUContext.onResize({
                target: this.#redGPUContext,
                screenRect: this.screenRectObject,
                pixelRect: this.pixelRectObject
            });
        }
        this.#redGPUContext.viewList.forEach((view: View3D) => {
            view.setSize()
            view.setPosition()
        });
    }

    /**
     * [KO] 캔버스 요소의 스타일을 변경합니다. (내부용)
     * [EN] Changes the style of the canvas element. (Internal use)
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