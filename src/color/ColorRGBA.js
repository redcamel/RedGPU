import validatePositiveNumberRange from "../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";
import ColorRGB from "./ColorRGB";
/**
 * 빨강, 초록, 파랑, 알파(투명도) 값을 가진 색상을 나타내는 클래스입니다.
 * ColorRGB 클래스를 상속받아 투명도 기능을 추가합니다.
 *
 * 이 클래스는 RGBA 색상 값을 생성, 조작, 변환하는 메서드를 제공하며,
 * 알파 채널을 통한 투명도 처리가 가능합니다.
 *
 * @example
 * ```typescript
 * // 불투명한 흰색 생성
 * const white = new RedGPU.ColorRGBA();
 *
 * // 반투명한 빨간색 생성
 * const semiTransparentRed = new RedGPU.ColorRGBA(255, 0, 0, 0.5);
 *
 * // 변경 콜백과 함께 생성
 * const color = new RedGPU.ColorRGBA(100, 150, 200, 0.8, () => console.log('색상이 변경되었습니다'));
 *
 * // RGBA 문자열로 색상 설정
 * color.setColorByRGBAString('rgba(255, 87, 51, 0.7)');
 *
 * // 정규화된 값 가져오기
 * const normalized = color.rgbaNormal; // [1, 0.34, 0.2, 0.7]
 * ```
 */
class ColorRGBA extends ColorRGB {
    /** @private 알파(투명도) 구성 요소 (0-1) */
    #a;
    /** @private 색상이 변경될 때 호출되는 선택적 콜백 함수 */
    #onChange;
    /**
     * ColorRGBA 클래스의 새 인스턴스를 생성합니다.
     *
     * @param r - RGB 색상의 빨간색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * @param g - RGB 색상의 초록색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * @param b - RGB 색상의 파란색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * @param a - 색상의 알파(투명도) 구성 요소. 0(완전 투명)에서 1(완전 불투명) 사이의 값이어야 합니다.
     * @param onChange - 색상이 변경될 때 호출되는 선택적 콜백 함수입니다.
     *
     * @throws {Error} RGB 값이 0-255 범위를 벗어나거나 알파 값이 0-1 범위를 벗어나면 오류가 발생합니다.
     *
     * @example
     * ```typescript
     * const color = new RedGPU.ColorRGBA(255, 128, 0, 0.75); // 75% 불투명도의 주황색
     * ```
     */
    constructor(r = 255, g = 255, b = 255, a = 1, onChange = undefined) {
        super(r, g, b, onChange);
        validatePositiveNumberRange(a, 0, 1);
        this.#a = a;
        if (onChange)
            this.#onChange = onChange;
    }
    /**
     * 알파(투명도) 구성 요소를 가져옵니다.
     *
     * @returns 0(완전 투명)에서 1(완전 불투명) 사이의 알파 값
     */
    get a() {
        return this.#a;
    }
    /**
     * 알파(투명도) 구성 요소를 설정합니다.
     *
     * @param value - 설정할 알파 값 (0-1)
     * @throws {Error} 값이 0-1 범위를 벗어나면 오류가 발생합니다.
     *
     * @example
     * ```typescript
     * const color = new RedGPU.ColorRGBA(255, 0, 0, 1);
     * color.a = 0.5; // 50% 투명도로 설정
     * ```
     */
    set a(value) {
        validatePositiveNumberRange(value, 0, 1);
        this.#a = value;
        this.#onChange?.();
    }
    /**
     * 색상의 RGBA 값을 포함하는 배열을 반환합니다.
     *
     * @returns [r, g, b, a] 형식의 RGBA 값을 나타내는 숫자 배열
     *
     * @example
     * ```typescript
     * const color = new RedGPU.ColorRGBA(255, 128, 0, 0.8);
     * console.log(color.rgba); // [255, 128, 0, 0.8]
     * ```
     */
    get rgba() {
        return [this.r, this.g, this.b, this.#a];
    }
    /**
     * 정규화된 RGBA 값을 배열로 반환합니다.
     * RGB 값은 0에서 1 사이로 정규화되고, 알파 값은 이미 정규화된 상태입니다.
     *
     * @returns 정규화된 RGBA 값을 포함하는 배열 [r/255, g/255, b/255, a]
     *
     * @example
     * ```typescript
     * const color = new RedGPU.ColorRGBA(255, 128, 0, 0.8);
     * console.log(color.rgbaNormal); // [1, 0.501, 0, 0.8]
     * ```
     */
    get rgbaNormal() {
        return [this.r / 255, this.g / 255, this.b / 255, this.#a];
    }
    /**
     * RGBA 값을 사용하여 객체의 색상을 설정합니다.
     *
     * @param r - 색상의 빨간색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * @param g - 색상의 초록색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * @param b - 색상의 파란색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * @param a - 색상의 알파(투명도) 구성 요소. 0에서 1 사이의 값이어야 합니다.
     *
     * @throws {Error} RGBA 색상 값이 유효하지 않으면 오류가 발생합니다.
     *
     * @example
     * ```typescript
     * const color = new RedGPU.ColorRGBA();
     * color.setColorByRGBA(255, 128, 0, 0.6); // 60% 불투명도의 주황색으로 설정
     * ```
     */
    setColorByRGBA(r, g, b, a) {
        this.#validateRGBA(r, g, b, a);
        this.r = r;
        this.g = g;
        this.b = b;
        this.#a = a;
        this.#onChange?.();
    }
    /**
     * RGBA 문자열을 사용하여 객체의 색상을 설정합니다.
     *
     * @param rgbaString - "rgba(r, g, b, a)" 형식의 RGBA 색상 값을 나타내는 문자열
     *
     * @throws {Error} 주어진 rgbaString이 유효한 RGBA 색상 값이 아닌 경우 오류가 발생합니다.
     *
     * @example
     * ```typescript
     * const color = new RedGPU.ColorRGBA();
     * color.setColorByRGBAString('rgba(255, 128, 0, 0.75)');
     * color.setColorByRGBAString('rgba( 255 , 128 , 0 , 0.75 )'); // 공백 허용
     * color.setColorByRGBAString('rgba(255, 128, 0, .5)'); // 소수점 앞의 0 생략 허용
     * ```
     */
    setColorByRGBAString(rgbaString) {
        const rgbaMatch = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*(?:\.\d+)?)\s*\)/.exec(rgbaString);
        if (!rgbaMatch)
            throw new Error(`유효하지 않은 rgba 색상 값입니다: ${rgbaString}`);
        const [, r, g, b, a] = rgbaMatch.map(Number);
        this.#validateRGBA(r, g, b, a);
        this.r = r;
        this.g = g;
        this.b = b;
        this.#a = a;
        this.#onChange?.();
    }
    /**
     * RGBA 색상 값의 유효성을 검사합니다.
     *
     * @private
     * @param r - 검사할 빨간색 값 (0에서 255)
     * @param g - 검사할 초록색 값 (0에서 255)
     * @param b - 검사할 파란색 값 (0에서 255)
     * @param a - 검사할 알파(투명도) 값 (0에서 1)
     *
     * @throws {Error} 색상 값 중 하나라도 유효한 범위를 벗어나면 오류가 발생합니다.
     * @throws {Error} 알파 값이 음수이거나 1보다 크면 오류가 발생합니다.
     */
    #validateRGBA(r, g, b, a) {
        validateUintRange(r, 0, 255);
        validateUintRange(g, 0, 255);
        validateUintRange(b, 0, 255);
        validatePositiveNumberRange(a, 0, 1);
    }
}
export default ColorRGBA;
