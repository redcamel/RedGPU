import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import RedGPUContext from "../RedGPUContext";
import RedGPUObject from "../../base/RedGPUObject";

/**
 * [KO] 사각형 영역의 위치(X, Y) 및 크기(Width, Height) 정보를 정의하는 인터페이스입니다.
 * [EN] Interface defining position (X, Y) and dimension (Width, Height) information of a rectangular area.
 *
 * @category Context
 */
export interface IRedGPURectObject {
    /**
     * [KO] X 좌표 (픽셀 단위)
     * [EN] X coordinate (in pixels)
     */
    x: number;
    /**
     * [KO] Y 좌표 (픽셀 단위)
     * [EN] Y coordinate (in pixels)
     */
    y: number;
    /**
     * [KO] 가로 크기 (픽셀 단위)
     * [EN] Width (in pixels)
     */
    width: number;
    /**
     * [KO] 세로 크기 (픽셀 단위)
     * [EN] Height (in pixels)
     */
    height: number;
}

/**
 * [KO] 리사이즈 이벤트 발생 시 전달되는 이벤트 객체 인터페이스입니다.
 * [EN] Event object interface passed when a resize event occurs.
 *
 * @category Context
 */
export interface RedResizeEvent<T = any> {
    /**
     * [KO] 리사이즈 이벤트가 발생한 대상 객체
     * [EN] Target object that triggered the resize event
     */
    target: T;
    /**
     * [KO] CSS 픽셀 단위의 화면 영역 정보
     * [EN] Screen area information in CSS pixels
     */
    screenRectObject: IRedGPURectObject;
    /**
     * [KO] 물리 픽셀 단위의 렌더링 영역 정보
     * [EN] Rendering area information in physical pixels
     */
    pixelRectObject: IRedGPURectObject;
}

type ParentRect = {
    x: number,
    y: number,
    width: number;
    height: number;
}

/**
 * [KO] 픽셀(`px`) 또는 백분율(`%`) 단위로 캔버스 크기를 제어하고 렌더링 해상도 배율(`renderScale`)을 관리하는 클래스입니다.
 * [EN] Class that controls canvas dimensions in pixels (`px`) or percentages (`%`) and manages the rendering resolution scale (`renderScale`).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const sizeManager = redGPUContext.sizeManager;
 * sizeManager.renderScale = 0.5;
 * sizeManager.setSize('100%', '100%');
 * ```
 *
 * @category Context
 */
class RedGPUContextSizeManager extends RedGPUObject {
    #width: number | string
    #height: number | string
    #pixelRectArray: [number, number, number, number] = [0, 0, 0, 0]
    #htmlCanvas: HTMLCanvasElement
    #renderScale: number = 1

    /**
     * [KO] RedGPUContextSizeManager 인스턴스를 생성합니다.
     * [EN] Creates a RedGPUContextSizeManager instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 초기 가로 크기 (기본값: `'100%'`)
     * [EN] Initial width (default: `'100%'`)
     * @param height -
     * [KO] 초기 세로 크기 (기본값: `'100%'`)
     * [EN] Initial height (default: `'100%'`)
     */
    constructor(redGPUContext: RedGPUContext, width: number | string = '100%', height: number | string = '100%') {
        super(redGPUContext);
        this.#htmlCanvas = redGPUContext.htmlCanvas
        this.#htmlCanvas.style.boxSizing = 'border-box'
        this.#htmlCanvas.style.verticalAlign = 'top'
        this.#width = width
        this.#height = height
    }

    /**
     * [KO] 렌더링 해상도 배율을 반환하거나 설정합니다. (0 이하 입력 시 `0.01`로 보정)
     * [EN] Gets or sets the rendering resolution scale factor (clamped to `0.01` if less than or equal to 0).
     *
     * @returns
     * [KO] 현재 렌더링 스케일 배율
     * [EN] Current rendering scale factor
     */
    get renderScale(): number {
        return this.#renderScale;
    }

    set renderScale(value: number) {
        validateNumber(value)
        if (value <= 0) value = 0.01
        this.#renderScale = value;
        this.setSize()
    }

    /**
     * [KO] 설정된 가로 크기 값(숫자 또는 `px`/`%` 문자열)을 반환하거나 설정합니다.
     * [EN] Gets or sets the configured width value (number or `px`/`%` string).
     *
     * @returns
     * [KO] 설정된 가로 크기 값
     * [EN] Configured width value
     */
    get width() {
        return this.#width;
    }

    set width(value: number | string) {
        this.setSize(value, this.#height)
    }

    /**
     * [KO] 설정된 세로 크기 값(숫자 또는 `px`/`%` 문자열)을 반환하거나 설정합니다.
     * [EN] Gets or sets the configured height value (number or `px`/`%` string).
     *
     * @returns
     * [KO] 설정된 세로 크기 값
     * [EN] Configured height value
     */
    get height() {
        return this.#height;
    }

    set height(value: number | string) {
        this.setSize(this.#width, value)
    }

    /**
     * [KO] 물리 픽셀 단위의 렌더링 영역을 `[x, y, width, height]` 배열로 반환합니다.
     * [EN] Returns the rendering area in physical pixels as an `[x, y, width, height]` array.
     *
     * @returns
     * [KO] 물리 픽셀 영역 튜플 (`[number, number, number, number]`)
     * [EN] Physical pixel rect tuple (`[number, number, number, number]`)
     */
    get pixelRectArray() {
        return this.#pixelRectArray;
    }

    /**
     * [KO] 물리 픽셀 단위의 렌더링 영역을 객체로 반환합니다.
     * [EN] Returns the rendering area in physical pixels as an object.
     *
     * @returns
     * [KO] 물리 픽셀 영역 객체
     * [EN] Physical pixel rect object
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
     * [KO] 캔버스 부모 DOM 요소의 가용 크기 및 위치 정보를 반환합니다. 부모가 없거나 `body`/`html`인 경우 뷰포트 크기를 반환합니다.
     * [EN] Returns the available dimension and position of the canvas's parent DOM element. Returns viewport dimensions if the parent is missing or `body`/`html`.
     *
     * @returns
     * [KO] 부모 DOM 요소의 위치 및 크기 정보
     * [EN] Position and dimension information of the parent DOM element
     */
    get parentDomRect(): ParentRect {
        const parent = this.#htmlCanvas.parentElement;

        if (!parent || parent === document.body || parent === document.documentElement) {
            return {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }

        const rect = parent.getBoundingClientRect();
        return {
            x: rect.x,
            y: rect.y,
            width: parent.clientWidth || rect.width,
            height: parent.clientHeight || rect.height
        };
    }

    /**
     * [KO] CSS 논리 픽셀 단위의 화면 영역 정보를 객체로 반환합니다.
     * [EN] Returns the screen area information in CSS logical pixels as an object.
     *
     * @returns
     * [KO] CSS 픽셀 영역 객체
     * [EN] CSS pixel rect object
     */
    get screenRectObject(): IRedGPURectObject {
        return {
            x: this.#pixelRectArray[0] / devicePixelRatio,
            y: this.#pixelRectArray[1] / devicePixelRatio,
            width: this.#pixelRectArray[2] / devicePixelRatio,
            height: this.#pixelRectArray[3] / devicePixelRatio
        };
    }

    /**
     * [KO] 입력값이 유효한 크기 값(양수, `px`, `%`)인지 검증합니다.
     * [EN] Validates whether the input value is a valid size value (positive number, `px`, `%`).
     *
     * @param value -
     * [KO] 검증할 크기 값
     * [EN] Size value to validate
     * @throws
     * [KO] 양수 또는 유효한 `px`/`%` 형식이 아닐 경우 에러 발생
     * [EN] Throws an error if the value is not a positive number or valid `px`/`%` format
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
     * [KO] 입력값이 유효한 위치 값(숫자, `px`, `%`)인지 검증합니다.
     * [EN] Validates whether the input value is a valid position value (number, `px`, `%`).
     *
     * @param value -
     * [KO] 검증할 위치 값
     * [EN] Position value to validate
     * @throws
     * [KO] 숫자 또는 유효한 `px`/`%` 형식이 아닐 경우 에러 발생
     * [EN] Throws an error if the value is not a number or valid `px`/`%` format
     */
    static validatePositionValue = (value: string | number) => {
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
     * [KO] 부모 영역(`parentRect`)을 기준으로 숫자 또는 문자열(`px`, `%`) 값을 계산하여 픽셀 단위 수치로 반환합니다.
     * [EN] Calculates and returns the pixel dimension from a number or string (`px`, `%`) value based on `parentRect`.
     *
     * @param parentRect -
     * [KO] 기준이 되는 부모 영역 객체
     * [EN] Reference parent rect object
     * @param key -
     * [KO] 참조할 속성 키 (`'width'` 또는 `'height'`)
     * [EN] Property key to reference (`'width'` or `'height'`)
     * @param value -
     * [KO] 계산할 크기 또는 위치 값
     * [EN] Size or position value to calculate
     * @returns
     * [KO] 픽셀 단위로 환산된 숫자 값
     * [EN] Calculated value in pixels
     */
    static getPixelDimension(parentRect: ParentRect, key: string, value: string | number): number {
        return typeof value === 'number' ? value : RedGPUContextSizeManager.calculateSizeFromString(parentRect, key, value);
    }

    /**
     * [KO] 문자열(`px`, `%`) 값을 기준 영역 객체에 맞춰 픽셀 단위 숫자로 변환합니다.
     * [EN] Converts a string (`px`, `%`) value to a pixel number based on the reference rect object.
     *
     * @param rect -
     * [KO] 기준 영역 객체
     * [EN] Reference rect object
     * @param key -
     * [KO] 참조할 속성 키 (`'width'` 또는 `'height'`)
     * [EN] Property key to reference (`'width'` or `'height'`)
     * @param value -
     * [KO] 변환할 문자열 값
     * [EN] String value to convert
     * @returns
     * [KO] 변환된 픽셀 단위 숫자 값
     * [EN] Converted number value in pixels
     */
    static calculateSizeFromString(rect: {
        x: number,
        y: number,
        width: number,
        height: number
    }, key: string, value: string) {
        if (value.includes('%')) {
            return Math.round(rect[key] * (+value.replace('%', '')) / 100)
        } else {
            return +value.replace('px', '')
        }
    }

    /**
     * [KO] RedGPUContextSizeManager 인스턴스를 파기하고 캔버스 참조를 해제합니다.
     * [EN] Destroys the RedGPUContextSizeManager instance and releases the canvas reference.
     */
    destroy() {
        this.#htmlCanvas = null
    }

    /**
     * [KO] 캔버스의 크기를 설정하고 스타일 및 하위 `View3D` 크기를 갱신합니다.
     * [EN] Sets the canvas dimensions and updates styles and child `View3D` sizes.
     *
     * @param w -
     * [KO] 가로 크기 (기본값: 현재 설정된 `width`)
     * [EN] Width (default: currently configured `width`)
     * @param h -
     * [KO] 세로 크기 (기본값: 현재 설정된 `height`)
     * [EN] Height (default: currently configured `height`)
     */
    setSize(w: string | number = this.#width, h: string | number = this.#height) {
        RedGPUContextSizeManager.validateSizeValue(w)
        RedGPUContextSizeManager.validateSizeValue(h)
        this.#width = w;
        this.#height = h;

        const parentRect = this.parentDomRect;
        const tW = RedGPUContextSizeManager.getPixelDimension(parentRect, 'width', w)
        const tH = RedGPUContextSizeManager.getPixelDimension(parentRect, 'height', h)

        const dpr = window.devicePixelRatio;
        const targetPixelW = Math.max(1, Math.floor(tW * this.#renderScale * dpr));
        const targetPixelH = Math.max(1, Math.floor(tH * this.#renderScale * dpr));

        if (
            this.#pixelRectArray[2] === targetPixelW &&
            this.#pixelRectArray[3] === targetPixelH &&
            Math.abs(parseFloat(this.#htmlCanvas.style.width) - tW) < 0.1 &&
            Math.abs(parseFloat(this.#htmlCanvas.style.height) - tH) < 0.1
        ) return;

        this.#changeCanvasStyles(tW, tH);
        this.#updatePixelRect(tW, tH)
        this.#updateViewsSize()
    }

    #updatePixelRect(tW: number, tH: number) {
        this.#pixelRectArray[2] = Math.max(1, Math.floor(tW * this.#renderScale * window.devicePixelRatio));
        this.#pixelRectArray[3] = Math.max(1, Math.floor(tH * this.#renderScale * window.devicePixelRatio));
    }

    #updateViewsSize() {
        const {redGPUContext} = this
        if (redGPUContext.onResize) {
            redGPUContext.onResize({
                target: redGPUContext,
                screenRectObject: this.screenRectObject,
                pixelRectObject: this.pixelRectObject
            });
        }
        redGPUContext.viewList.forEach((view: View3D) => {
            view.setSize()
            view.setPosition()
        });
    }

    #changeCanvasStyles(width: number, height: number): void {
        const cvs = this.#htmlCanvas
        const {style} = cvs
        cvs.width = Math.max(1, width * this.#renderScale * window.devicePixelRatio);
        cvs.height = Math.max(1, height * this.#renderScale * window.devicePixelRatio);
        style.width = `${width}px`;
        style.height = `${height}px`;
    }
}

export default RedGPUContextSizeManager