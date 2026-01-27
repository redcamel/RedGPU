import RedGPUContext from "../RedGPUContext";
type ParentRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * [KO] 캔버스 크기 및 렌더링 스케일을 관리하는 클래스입니다.
 * [EN] Class that manages canvas size and rendering scale.
 *
 * [KO] 픽셀(px) 또는 백분율(%) 단위로 크기를 설정할 수 있으며, 렌더링 해상도 조절 기능을 제공합니다.
 * [EN] You can set the size in pixels (px) or percentages (%), and it provides rendering resolution adjustment functions.
 * @category Context
 */
declare class RedGPUContextSizeManager {
    #private;
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
    constructor(redGPUContext: RedGPUContext, width?: number | string, height?: number | string);
    /**
     * [KO] 렌더링 스케일을 반환합니다.
     * [EN] Returns the rendering scale.
     */
    get renderScale(): number;
    /**
     * [KO] 렌더링 스케일을 설정합니다.
     * [EN] Sets the rendering scale.
     * @param value -
     * [KO] 렌더 스케일 값 (0.01 이상)
     * [EN] Render scale value (0.01 or more)
     */
    set renderScale(value: number);
    /**
     * [KO] 설정된 너비 값을 반환합니다.
     * [EN] Returns the set width value.
     */
    get width(): number | string;
    /**
     * [KO] 너비를 설정합니다. (px, % 또는 숫자)
     * [EN] Sets the width. (px, %, or number)
     * @param value -
     * [KO] 너비 값
     * [EN] Width value
     */
    set width(value: number | string);
    /**
     * [KO] 설정된 높이 값을 반환합니다.
     * [EN] Returns the set height value.
     */
    get height(): number | string;
    /**
     * [KO] 높이를 설정합니다. (px, % 또는 숫자)
     * [EN] Sets the height. (px, %, or number)
     * @param value -
     * [KO] 높이 값
     * [EN] Height value
     */
    set height(value: number | string);
    /**
     * [KO] 현재 렌더링될 실제 픽셀 단위 Rect를 배열로 반환합니다. [x, y, w, h]
     * [EN] Returns the actual pixel rect to be rendered as an array. [x, y, w, h]
     */
    get pixelRectArray(): [number, number, number, number];
    /**
     * [KO] 현재 렌더링될 실제 픽셀 단위 Rect를 객체로 반환합니다.
     * [EN] Returns the actual pixel rect to be rendered as an object.
     */
    get pixelRectObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * [KO] 캔버스의 부모 DOM 요소의 크기 정보를 반환합니다.
     * [EN] Returns the dimension information of the canvas's parent DOM element.
     */
    get parentDomRect(): DOMRect;
    get screenRectObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * [KO] 입력값이 유효한 사이즈 값인지 검증합니다. (양수, px, %)
     * [EN] Validates if the input value is a valid size value. (positive number, px, %)
     * @param value -
     * [KO] 검증할 값
     * [EN] Value to validate
     */
    static validateSizeValue: (value: string | number) => void;
    /**
     * [KO] 입력값이 유효한 위치 값인지 검증합니다. (숫자, px, %)
     * [EN] Validates if the input value is a valid position value. (number, px, %)
     * @param value -
     * [KO] 검증할 값
     * [EN] Value to validate
     */
    static validatePositionValue: (value: string | number) => void;
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
    static getPixelDimension(parentRect: ParentRect, key: string, value: string | number): number;
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
        x: number;
        y: number;
        width: number;
        height: number;
    }, key: string, value: string): number;
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
    setSize(w?: string | number, h?: string | number): void;
}
export default RedGPUContextSizeManager;
