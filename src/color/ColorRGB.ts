import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../utils/consoleAndThrowError";
import convertHexToRgb from "../utils/convertColor/convertHexToRgb";
import convertRgbToHex from "../utils/convertColor/convertRgbToHex";

/**
 * [KO] RGB 색상을 나타내는 클래스입니다.
 * [EN] Class representing RGB color.
 *
 * [KO] 이 클래스는 RGB 색상 값을 생성, 조작, 변환하는 메서드를 제공합니다. 색상 구성 요소의 유효성 검사 및 선택적 변경 알림을 지원합니다.
 * [EN] This class provides methods to create, manipulate, and convert RGB color values. It supports validation of color components and optional change notifications.
 * * ### Example
 * ```typescript
 * // [KO] 흰색 생성
 * // [EN] Create white
 * const white = new RedGPU.Color.ColorRGB();
 *
 * // [KO] 빨간색 생성
 * // [EN] Create red
 * const red = new RedGPU.Color.ColorRGB(255, 0, 0);
 *
 * // [KO] 변경 콜백과 함께 생성
 * // [EN] Create with change callback
 * const color = new RedGPU.Color.ColorRGB(100, 150, 200, () => console.log('Color changed'));
 *
 * // [KO] 16진수로 색상 설정
 * // [EN] Set color by hex
 * color.setColorByHEX('#FF5733');
 *
 * // [KO] 정규화된 값 가져오기
 * // [EN] Get normalized values
 * const normalized = color.rgbNormal; // [1, 0.34, 0.2]
 * ```
 * @category Color
 */
class ColorRGB {
    #r: number
    #g: number
    #b: number
    readonly #onChange: Function;

    /**
     * [KO] ColorRGB 클래스의 새 인스턴스를 생성합니다.
     * [EN] Creates a new instance of the ColorRGB class.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGB(255, 128, 0);
     * ```
     *
     * @param r -
     * [KO] RGB 색상의 빨간색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * [EN] Red component of the RGB color. Must be a value between 0 and 255.
     * @param g -
     * [KO] RGB 색상의 초록색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * [EN] Green component of the RGB color. Must be a value between 0 and 255.
     * @param b -
     * [KO] RGB 색상의 파란색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * [EN] Blue component of the RGB color. Must be a value between 0 and 255.
     * @param onChange -
     * [KO] 색상이 변경될 때 호출되는 선택적 콜백 함수입니다.
     * [EN] Optional callback function called when the color changes.
     * @throws
     * [KO] RGB 값이 0-255 범위를 벗어나면 오류가 발생합니다.
     * [EN] Throws an error if RGB values are out of the 0-255 range.
     */
    constructor(r: number = 255, g: number = 255, b: number = 255, onChange: Function = undefined) {
        // console.log(r, g, b)
        this.#validateRGB(r, g, b)
        this.#setRGB(r, g, b)
        if (onChange) this.#onChange = onChange
    }

    /**
     * [KO] 빨간색 구성 요소를 가져옵니다.
     * [EN] Gets the red component.
     * * ### Example
     * ```typescript
     * const r = color.r;
     * ```
     * @returns
     * [KO] 0에서 255 사이의 빨간색 값
     * [EN] Red value between 0 and 255
     */
    get r(): number {
        return this.#r;
    }

    /**
     * [KO] 빨간색 구성 요소를 설정합니다.
     * [EN] Sets the red component.
     * * ### Example
     * ```typescript
     * color.r = 255;
     * ```
     * @param value -
     * [KO] 설정할 빨간색 값 (0-255)
     * [EN] Red value to set (0-255)
     * @throws
     * [KO] 값이 0-255 범위를 벗어나면 오류가 발생합니다.
     * [EN] Throws an error if the value is out of the 0-255 range.
     */
    set r(value: number) {
        validateUintRange(value, 0, 255)
        this.#r = value;
        this.#onChange?.()
    }

    /**
     * [KO] 초록색 구성 요소를 가져옵니다.
     * [EN] Gets the green component.
     * * ### Example
     * ```typescript
     * const g = color.g;
     * ```
     * @returns
     * [KO] 0에서 255 사이의 초록색 값
     * [EN] Green value between 0 and 255
     */
    get g(): number {
        return this.#g;
    }

    /**
     * [KO] 초록색 구성 요소를 설정합니다.
     * [EN] Sets the green component.
     * * ### Example
     * ```typescript
     * color.g = 255;
     * ```
     * @param value -
     * [KO] 설정할 초록색 값 (0-255)
     * [EN] Green value to set (0-255)
     * @throws
     * [KO] 값이 0-255 범위를 벗어나면 오류가 발생합니다.
     * [EN] Throws an error if the value is out of the 0-255 range.
     */
    set g(value: number) {
        validateUintRange(value, 0, 255)
        this.#g = value;
        this.#onChange?.()
    }

    /**
     * [KO] 파란색 구성 요소를 가져옵니다.
     * [EN] Gets the blue component.
     * * ### Example
     * ```typescript
     * const b = color.b;
     * ```
     * @returns
     * [KO] 0에서 255 사이의 파란색 값
     * [EN] Blue value between 0 and 255
     */
    get b(): number {
        return this.#b;
    }

    /**
     * [KO] 파란색 구성 요소를 설정합니다.
     * [EN] Sets the blue component.
     * * ### Example
     * ```typescript
     * color.b = 255;
     * ```
     * @param value -
     * [KO] 설정할 파란색 값 (0-255)
     * [EN] Blue value to set (0-255)
     * @throws
     * [KO] 값이 0-255 범위를 벗어나면 오류가 발생합니다.
     * [EN] Throws an error if the value is out of the 0-255 range.
     */
    set b(value: number) {
        validateUintRange(value, 0, 255)
        this.#b = value;
        this.#onChange?.()
    }

    /**
     * [KO] 색상의 RGB 값을 포함하는 배열을 반환합니다.
     * [EN] Returns an array containing the RGB values of the color.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGB(255, 128, 0);
     * console.log(color.rgb); // [255, 128, 0]
     * ```
     * @returns
     * [KO] [r, g, b] 형식의 RGB 값을 나타내는 숫자 배열
     * [EN] Array of numbers representing RGB values in [r, g, b] format
     */
    get rgb(): number[] {
        return [this.#r, this.#g, this.#b];
    }

    /**
     * [KO] 정규화된 RGB 값을 배열로 반환합니다. 각 값은 0에서 1 사이로 정규화됩니다.
     * [EN] Returns normalized RGB values as an array. Each value is normalized between 0 and 1.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGB(255, 128, 0);
     * console.log(color.rgbNormal); // [1, 0.501, 0]
     * ```
     * @returns
     * [KO] 정규화된 RGB 값을 포함하는 배열 [r/255, g/255, b/255]
     * [EN] Array containing normalized RGB values [r/255, g/255, b/255]
     */
    get rgbNormal(): number[] {
        return [this.#r / 255, this.#g / 255, this.#b / 255];
    }

    /**
     * [KO] 감마 보정된(Linear) 정규화된 RGB 값을 배열로 반환합니다.
     * [EN] Returns gamma-corrected (Linear) normalized RGB values as an array.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGB(255, 128, 0);
     * console.log(color.rgbNormalLinear);
     * ```
     * @returns
     * [KO] 감마 보정된(2.2) 정규화된 RGB 값을 포함하는 배열
     * [EN] Array containing gamma-corrected (2.2) normalized RGB values
     */
    get rgbNormalLinear(): number[] {
        return [
            Math.pow(this.#r / 255, 2.2),
            Math.pow(this.#g / 255, 2.2),
            Math.pow(this.#b / 255, 2.2)
        ];
    }

    /**
     * [KO] RGB 색상의 16진수 표현을 반환합니다.
     * [EN] Returns the hexadecimal representation of the RGB color.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGB(255, 128, 0);
     * console.log(color.hex); // "#FF8000"
     * ```
     * @returns
     * [KO] 16진수 색상 값 (예: "#FF8000")
     * [EN] Hexadecimal color value (e.g., "#FF8000")
     */
    get hex(): string {
        return convertRgbToHex(this.#r, this.#g, this.#b);
    }

    /**
     * [KO] 제공된 RGB 값을 기반으로 객체의 색상을 설정합니다.
     * [EN] Sets the color of the object based on the provided RGB values.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGB();
     * color.setColorByRGB(255, 128, 0);
     * ```
     * @param r -
     * [KO] 0-255 범위의 빨간색 값
     * [EN] Red value in the range of 0-255
     * @param g -
     * [KO] 0-255 범위의 초록색 값
     * [EN] Green value in the range of 0-255
     * @param b -
     * [KO] 0-255 범위의 파란색 값
     * [EN] Blue value in the range of 0-255
     * @throws
     * [KO] RGB 값이 0-255 범위를 벗어나면 오류가 발생합니다.
     * [EN] Throws an error if RGB values are out of the 0-255 range.
     */
    setColorByRGB(r: number, g: number, b: number) {
        this.#validateRGB(r, g, b)
        this.#setRGB(r, g, b)
    }

    /**
     * [KO] 16진수 색상 코드를 사용하여 객체의 색상을 설정합니다.
     * [EN] Sets the color of the object using a hexadecimal color code.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGB();
     * color.setColorByHEX('#FF8000');
     * color.setColorByHEX(0xFF8000);
     * ```
     * @param hexColor -
     * [KO] 색상을 설정할 16진수 색상 코드 (문자열 또는 숫자)
     * [EN] Hexadecimal color code to set the color (string or number)
     * @throws
     * [KO] 유효하지 않은 16진수 색상 코드인 경우 오류가 발생합니다.
     * [EN] Throws an error if the hexadecimal color code is invalid.
     */
    setColorByHEX(hexColor: string | number) {
        const {r, g, b} = convertHexToRgb(hexColor) //TODO 0x000000 되는지 확인해야함
        this.#setRGB(r, g, b)
    }

    /**
     * [KO] RGB 색상 값을 나타내는 문자열을 파싱하여 객체의 색상을 설정합니다.
     * [EN] Parses a string representing an RGB color value and sets the object's color.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGB();
     * color.setColorByRGBString('rgb(255, 128, 0)');
     * color.setColorByRGBString('rgb( 255 , 128 , 0 )');
     * ```
     * @param rgbString -
     * [KO] "rgb(r, g, b)" 형식의 RGB 색상 값을 나타내는 문자열
     * [EN] String representing RGB color values in "rgb(r, g, b)" format
     * @throws
     * [KO] 주어진 rgbString이 유효한 RGB 색상 값이 아닌 경우 오류가 발생합니다.
     * [EN] Throws an error if the provided rgbString is not a valid RGB color value.
     */
    setColorByRGBString(rgbString: string) {
        const rgbMatch = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(rgbString);
        if (!rgbMatch) consoleAndThrowError(`유효하지 않은 rgb 색상 값입니다: ${rgbString}`);
        const [, r, g, b] = rgbMatch.map(Number);
        this.#validateRGB(r, g, b)
        this.#setRGB(r, g, b)
    }

    #setRGB(r: number, g: number, b: number) {
        this.#r = r
        this.#g = g
        this.#b = b
        this.#onChange?.()
    }

    #validateRGB(r: number, g: number, b: number) {
        validateUintRange(r, 0, 255)
        validateUintRange(g, 0, 255)
        validateUintRange(b, 0, 255)
    }
}

Object.freeze(ColorRGB)
export default ColorRGB