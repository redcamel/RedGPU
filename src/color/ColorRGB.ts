import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../utils/consoleAndThrowError";
import convertHexToRgb from "../utils/convertColor/convertHexToRgb";
import convertRgbToHex from "../utils/convertColor/convertRgbToHex";

/**
 * RGB 색상을 나타내는 클래스입니다.
 *
 * 이 클래스는 RGB 색상 값을 생성, 조작, 변환하는 메서드를 제공합니다.
 * 색상 구성 요소의 유효성 검사 및 선택적 변경 알림을 지원합니다.
 *
 * @example
 * ```typescript
 * // 흰색 생성
 * const white = new RedGPU.ColorRGB();
 *
 * // 빨간색 생성
 * const red = new RedGPU.ColorRGB(255, 0, 0);
 *
 * // 변경 콜백과 함께 생성
 * const color = new RedGPU.ColorRGB(100, 150, 200, () => console.log('색상이 변경되었습니다'));
 *
 * // 16진수로 색상 설정
 * color.setColorByHEX('#FF5733');
 *
 * // 정규화된 값 가져오기
 * const normalized = color.rgbNormal; // [1, 0.34, 0.2]
 * ```
 */
class ColorRGB {
	/** @private 빨간색 구성 요소 (0-255) */
	#r: number
	/** @private 초록색 구성 요소 (0-255) */
	#g: number
	/** @private 파란색 구성 요소 (0-255) */
	#b: number
	/** @private 색상이 변경될 때 호출되는 선택적 콜백 함수 */
	readonly #onChange: Function;

	/**
	 * ColorRGB 클래스의 새 인스턴스를 생성합니다.
	 *
	 * @param r - RGB 색상의 빨간색 구성 요소. 0에서 255 사이의 값이어야 합니다.
	 * @param g - RGB 색상의 초록색 구성 요소. 0에서 255 사이의 값이어야 합니다.
	 * @param b - RGB 색상의 파란색 구성 요소. 0에서 255 사이의 값이어야 합니다.
	 * @param onChange - 색상이 변경될 때 호출되는 선택적 콜백 함수입니다.
	 *
	 * @throws {Error} RGB 값이 0-255 범위를 벗어나면 오류가 발생합니다.
	 *
	 * @example
	 * ```typescript
	 * const color = new RedGPU.ColorRGB(255, 128, 0); // 주황색
	 * ```
	 */
	constructor(r: number = 255, g: number = 255, b: number = 255, onChange: Function = undefined) {
		// console.log(r, g, b)
		this.#validateRGB(r, g, b)
		this.#setRGB(r, g, b)
		if (onChange) this.#onChange = onChange
	}

	/**
	 * 빨간색 구성 요소를 가져옵니다.
	 *
	 * @returns 0에서 255 사이의 빨간색 값
	 */
	get r(): number {
		return this.#r;
	}

	/**
	 * 빨간색 구성 요소를 설정합니다.
	 *
	 * @param value - 설정할 빨간색 값 (0-255)
	 * @throws {Error} 값이 0-255 범위를 벗어나면 오류가 발생합니다.
	 */
	set r(value: number) {
		validateUintRange(value, 0, 255)
		this.#r = value;
		this.#onChange?.()
	}

	/**
	 * 초록색 구성 요소를 가져옵니다.
	 *
	 * @returns 0에서 255 사이의 초록색 값
	 */
	get g(): number {
		return this.#g;
	}

	/**
	 * 초록색 구성 요소를 설정합니다.
	 *
	 * @param value - 설정할 초록색 값 (0-255)
	 * @throws {Error} 값이 0-255 범위를 벗어나면 오류가 발생합니다.
	 */
	set g(value: number) {
		validateUintRange(value, 0, 255)
		this.#g = value;
		this.#onChange?.()
	}

	/**
	 * 파란색 구성 요소를 가져옵니다.
	 *
	 * @returns 0에서 255 사이의 파란색 값
	 */
	get b(): number {
		return this.#b;
	}

	/**
	 * 파란색 구성 요소를 설정합니다.
	 *
	 * @param value - 설정할 파란색 값 (0-255)
	 * @throws {Error} 값이 0-255 범위를 벗어나면 오류가 발생합니다.
	 */
	set b(value: number) {
		validateUintRange(value, 0, 255)
		this.#b = value;
		this.#onChange?.()
	}

	/**
	 * 색상의 RGB 값을 포함하는 배열을 반환합니다.
	 *
	 * @returns [r, g, b] 형식의 RGB 값을 나타내는 숫자 배열
	 *
	 * @example
	 * ```typescript
	 * const color = new RedGPU.ColorRGB(255, 128, 0);
	 * console.log(color.rgb); // [255, 128, 0]
	 * ```
	 */
	get rgb(): number[] {
		return [this.#r, this.#g, this.#b];
	}

	/**
	 * 정규화된 RGB 값을 배열로 반환합니다.
	 * 각 값은 0에서 1 사이로 정규화됩니다.
	 *
	 * @returns 정규화된 RGB 값을 포함하는 배열 [r/255, g/255, b/255]
	 *
	 * @example
	 * ```typescript
	 * const color = new RedGPU.ColorRGB(255, 128, 0);
	 * console.log(color.rgbNormal); // [1, 0.501, 0]
	 * ```
	 */
	get rgbNormal(): number[] {
		return [this.#r / 255, this.#g / 255, this.#b / 255];
	}

	/**
	 * RGB 색상의 16진수 표현을 반환합니다.
	 *
	 * @returns 16진수 색상 값 (예: "#FF8000")
	 *
	 * @example
	 * ```typescript
	 * const color = new RedGPU.ColorRGB(255, 128, 0);
	 * console.log(color.hex); // "#FF8000"
	 * ```
	 */
	get hex(): string {
		return convertRgbToHex(this.#r, this.#g, this.#b);
	}

	/**
	 * 제공된 RGB 값을 기반으로 객체의 색상을 설정합니다.
	 *
	 * @param r - 0-255 범위의 빨간색 값
	 * @param g - 0-255 범위의 초록색 값
	 * @param b - 0-255 범위의 파란색 값
	 *
	 * @throws {Error} RGB 값이 0-255 범위를 벗어나면 오류가 발생합니다.
	 *
	 * @example
	 * ```typescript
	 * const color = new RedGPU.ColorRGB();
	 * color.setColorByRGB(255, 128, 0); // 주황색으로 설정
	 * ```
	 */
	setColorByRGB(r: number, g: number, b: number) {
		this.#validateRGB(r, g, b)
		this.#setRGB(r, g, b)
	}

	/**
	 * 16진수 색상 코드를 사용하여 객체의 색상을 설정합니다.
	 *
	 * @param hexColor - 색상을 설정할 16진수 색상 코드 (문자열 또는 숫자)
	 *
	 * @throws {Error} 유효하지 않은 16진수 색상 코드인 경우 오류가 발생합니다.
	 *
	 * @example
	 * ```typescript
	 * const color = new RedGPU.ColorRGB();
	 * color.setColorByHEX('#FF8000');
	 * color.setColorByHEX(0xFF8000);
	 * ```
	 */
	setColorByHEX(hexColor: string | number) {
		const {r, g, b} = convertHexToRgb(hexColor) //TODO 0x000000 되는지 확인해야함
		this.#setRGB(r, g, b)
	}

	/**
	 * RGB 색상 값을 나타내는 문자열을 파싱하여 객체의 색상을 설정합니다.
	 *
	 * @param rgbString - "rgb(r, g, b)" 형식의 RGB 색상 값을 나타내는 문자열
	 *
	 * @throws {Error} 주어진 rgbString이 유효한 RGB 색상 값이 아닌 경우 오류가 발생합니다.
	 *
	 * @example
	 * ```typescript
	 * const color = new RedGPU.ColorRGB();
	 * color.setColorByRGBString('rgb(255, 128, 0)');
	 * color.setColorByRGBString('rgb( 255 , 128 , 0 )'); // 공백 허용
	 * ```
	 */
	setColorByRGBString(rgbString: string) {
		const rgbMatch = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(rgbString);
		if (!rgbMatch) consoleAndThrowError(`유효하지 않은 rgb 색상 값입니다: ${rgbString}`);
		const [, r, g, b] = rgbMatch.map(Number);
		this.#validateRGB(r, g, b)
		this.#setRGB(r, g, b)
	}

	/**
	 * RGB 값을 내부적으로 설정하고 변경 콜백을 호출합니다.
	 *
	 * @private
	 * @param r - 빨간색 값
	 * @param g - 초록색 값
	 * @param b - 파란색 값
	 */
	#setRGB(r: number, g: number, b: number) {
		this.#r = r
		this.#g = g
		this.#b = b
		this.#onChange?.()
	}

	/**
	 * 주어진 RGB 값의 유효성을 검사합니다.
	 *
	 * @private
	 * @param r - 검사할 빨간색 값 (0에서 255)
	 * @param g - 검사할 초록색 값 (0에서 255)
	 * @param b - 검사할 파란색 값 (0에서 255)
	 *
	 * @throws {Error} RGB 값 중 하나라도 0에서 255 범위를 벗어나면 오류가 발생합니다.
	 */
	#validateRGB(r: number, g: number, b: number) {
		validateUintRange(r, 0, 255)
		validateUintRange(g, 0, 255)
		validateUintRange(b, 0, 255)
	}
}

Object.freeze(ColorRGB)
export default ColorRGB
