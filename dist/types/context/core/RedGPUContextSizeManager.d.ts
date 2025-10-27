import RedGPUContext from "../RedGPUContext";
type ParentRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * `RedGPUContextSizeManager` 클래스는 RedGPUContext의 캔버스 크기 및 렌더링 스케일을 관리합니다.
 * - width, height는 픽셀(px) 또는 백분율(%)로 설정할 수 있습니다.
 * - 렌더링 스케일(renderScale)은 렌더링 해상도를 조정하는 데 사용됩니다.
 * - 캔버스 크기 변경 시 관련 뷰(View3D)들의 크기도 자동으로 업데이트됩니다.
 */
declare class RedGPUContextSizeManager {
    #private;
    constructor(redGPUContext: RedGPUContext, width?: number | string, height?: number | string);
    /**
     * 렌더링 스케일 반환
     */
    get renderScale(): number;
    /**
     * Sets the rendering scale.
     *
     * @param {number} value - The rendering scale. If the value is less than or equal to 0, it will be converted to 0.01.
     */
    set renderScale(value: number);
    get width(): number | string;
    /**
     * width 설정
     * - positive number, px, % 만 허용
     * - %로 설정될경우 canvas의 부모 node 사이즈 기반으로 계산됨
     * - 계산된 결과는 pixelRect에 적용됨
     * @param value
     */
    set width(value: number | string);
    get height(): number | string;
    /**
     * height 설정
     * - positive number, px, % 만 허용
     * - %로 설정될경우 canvas의 부모 node 사이즈 기반으로 계산됨
     * - 계산된 결과는 pixelRect에 적용됨
     * @param value
     */
    set height(value: number | string);
    /**
     * 현재 width, height, renderScale 기반 렌더링될 실제 pixel(정수)단위의 Rect를 배열로 반환
     *
     */
    get pixelRectArray(): [number, number, number, number];
    /**
     * 현재 width, height, renderScale 기반 렌더링될 실제 pixel(정수)단위의 Rect를 객체로 반환
     */
    get pixelRectObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Retrieves the rectangular dimensions of the parent DOM element of the HTML canvas.
     *
     * @returns {DOMRect} The DOMRect object representing the dimensions of the parent element.
     */
    get parentDomRect(): DOMRect;
    get screenRectObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * 사이즈로 사용가능한 값인지 체크	 * positive number, px, % 만 허용
     * @param value
     */
    static validateSizeValue: (value: string | number) => void;
    /**
     * 포지션으로 사용가능한 값인지 체크	 *  number, px, % 만 허용
     * @param value
     */
    static validatePositionValue: (value: string | number) => void;
    static getPixelDimension(parentRect: ParentRect, key: string, value: string | number): number;
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
        x: number;
        y: number;
        width: number;
        height: number;
    }, key: string, value: string): number;
    /**
     * Sets the size of the element. If width and height are not provided,
     * the current width and height values are used.
     *
     * @param {string|number} [w] - The new width of the element.
     * @param {string|number} [h] - The new height of the element.
     */
    setSize(w?: string | number, h?: string | number): void;
}
export default RedGPUContextSizeManager;
