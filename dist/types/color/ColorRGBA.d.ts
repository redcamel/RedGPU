import ColorRGB from "./ColorRGB";
/**
 * [KO] 빨강, 초록, 파랑, 알파(투명도) 값을 가진 색상을 나타내는 클래스입니다.
 * [EN] Class representing a color with red, green, blue, and alpha (transparency) values.
 *
 * [KO] ColorRGB 클래스를 상속받아 투명도 기능을 추가합니다. 이 클래스는 RGBA 색상 값을 생성, 조작, 변환하는 메서드를 제공하며, 알파 채널을 통한 투명도 처리가 가능합니다.
 * [EN] Inherits from the ColorRGB class and adds transparency functionality. This class provides methods to create, manipulate, and convert RGBA color values, allowing transparency handling via the alpha channel.
 * * ### Example
 * ```typescript
 * // [KO] 불투명한 흰색 생성
 * // [EN] Create opaque white
 * const white = new RedGPU.Color.ColorRGBA();
 *
 * // [KO] 반투명한 빨간색 생성
 * // [EN] Create semi-transparent red
 * const semiTransparentRed = new RedGPU.Color.ColorRGBA(255, 0, 0, 0.5);
 *
 * // [KO] 변경 콜백과 함께 생성
 * // [EN] Create with change callback
 * const color = new RedGPU.Color.ColorRGBA(100, 150, 200, 0.8, () => console.log('Color changed'));
 *
 * // [KO] RGBA 문자열로 색상 설정
 * // [EN] Set color by RGBA string
 * color.setColorByRGBAString('rgba(255, 87, 51, 0.7)');
 *
 * // [KO] 정규화된 값 가져오기
 * // [EN] Get normalized values
 * const normalized = color.rgbaNormal; // [1, 0.34, 0.2, 0.7]
 * ```
 * @category Color
 */
declare class ColorRGBA extends ColorRGB {
    #private;
    /**
     * [KO] ColorRGBA 클래스의 새 인스턴스를 생성합니다.
     * [EN] Creates a new instance of the ColorRGBA class.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.75);
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
     * @param a -
     * [KO] 색상의 알파(투명도) 구성 요소. 0(완전 투명)에서 1(완전 불투명) 사이의 값이어야 합니다.
     * [EN] Alpha (transparency) component of the color. Must be a value between 0 (fully transparent) and 1 (fully opaque).
     * @param onChange -
     * [KO] 색상이 변경될 때 호출되는 선택적 콜백 함수입니다.
     * [EN] Optional callback function called when the color changes.
     * @throws
     * [KO] RGB 값이 0-255 범위를 벗어나거나 알파 값이 0-1 범위를 벗어나면 오류가 발생합니다.
     * [EN] Throws an error if RGB values are out of the 0-255 range or alpha value is out of the 0-1 range.
     */
    constructor(r?: number, g?: number, b?: number, a?: number, onChange?: Function);
    /**
     * [KO] 알파(투명도) 구성 요소를 가져옵니다.
     * [EN] Gets the alpha (transparency) component.
     * * ### Example
     * ```typescript
     * const a = color.a;
     * ```
     * @returns
     * [KO] 0(완전 투명)에서 1(완전 불투명) 사이의 알파 값
     * [EN] Alpha value between 0 (fully transparent) and 1 (fully opaque)
     */
    get a(): number;
    /**
     * [KO] 알파(투명도) 구성 요소를 설정합니다.
     * [EN] Sets the alpha (transparency) component.
     * * ### Example
     * ```typescript
     * color.a = 0.5;
     * ```
     * @param value -
     * [KO] 설정할 알파 값 (0-1)
     * [EN] Alpha value to set (0-1)
     * @throws
     * [KO] 값이 0-1 범위를 벗어나면 오류가 발생합니다.
     * [EN] Throws an error if the value is out of the 0-1 range.
     */
    set a(value: number);
    /**
     * [KO] 색상의 RGBA 값을 포함하는 배열을 반환합니다.
     * [EN] Returns an array containing the RGBA values of the color.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
     * console.log(color.rgba); // [255, 128, 0, 0.8]
     * ```
     * @returns
     * [KO] [r, g, b, a] 형식의 RGBA 값을 나타내는 숫자 배열
     * [EN] Array of numbers representing RGBA values in [r, g, b, a] format
     */
    get rgba(): number[];
    /**
     * [KO] 정규화된 RGBA 값을 배열로 반환합니다.
     * [EN] Returns normalized RGBA values as an array.
     *
     * [KO] RGB 값은 0에서 1 사이로 정규화되고, 알파 값은 이미 정규화된 상태입니다.
     * [EN] RGB values are normalized between 0 and 1, and the alpha value is already normalized.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
     * console.log(color.rgbaNormal); // [1, 0.501, 0, 0.8]
     * ```
     * @returns
     * [KO] 정규화된 RGBA 값을 포함하는 배열 [r/255, g/255, b/255, a]
     * [EN] Array containing normalized RGBA values [r/255, g/255, b/255, a]
     */
    get rgbaNormal(): number[];
    /**
     * [KO] 감마 보정된(Linear) 정규화된 RGBA 값을 배열로 반환합니다.
     * [EN] Returns gamma-corrected (Linear) normalized RGBA values as an array.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
     * console.log(color.rgbaNormalLinear);
     * ```
     * @returns
     * [KO] 감마 보정된(2.2) 정규화된 RGBA 값을 포함하는 배열
     * [EN] Array containing gamma-corrected (2.2) normalized RGBA values
     */
    get rgbaNormalLinear(): number[];
    /**
     * [KO] RGBA 값을 사용하여 객체의 색상을 설정합니다.
     * [EN] Sets the color of the object using RGBA values.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGBA();
     * color.setColorByRGBA(255, 128, 0, 0.6);
     * ```
     * @param r -
     * [KO] 색상의 빨간색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * [EN] Red component of the color. Must be a value between 0 and 255.
     * @param g -
     * [KO] 색상의 초록색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * [EN] Green component of the color. Must be a value between 0 and 255.
     * @param b -
     * [KO] 색상의 파란색 구성 요소. 0에서 255 사이의 값이어야 합니다.
     * [EN] Blue component of the color. Must be a value between 0 and 255.
     * @param a -
     * [KO] 색상의 알파(투명도) 구성 요소. 0에서 1 사이의 값이어야 합니다.
     * [EN] Alpha (transparency) component of the color. Must be a value between 0 and 1.
     * @throws
     * [KO] RGBA 색상 값이 유효하지 않으면 오류가 발생합니다.
     * [EN] Throws an error if RGBA color values are invalid.
     */
    setColorByRGBA(r: number, g: number, b: number, a: number): void;
    /**
     * [KO] RGBA 문자열을 사용하여 객체의 색상을 설정합니다.
     * [EN] Sets the color of the object using an RGBA string.
     * * ### Example
     * ```typescript
     * const color = new RedGPU.Color.ColorRGBA();
     * color.setColorByRGBAString('rgba(255, 128, 0, 0.75)');
     * color.setColorByRGBAString('rgba( 255 , 128 , 0 , 0.75 )');
     * color.setColorByRGBAString('rgba(255, 128, 0, .5)');
     * ```
     * @param rgbaString -
     * [KO] "rgba(r, g, b, a)" 형식의 RGBA 색상 값을 나타내는 문자열
     * [EN] String representing RGBA color values in "rgba(r, g, b, a)" format
     * @throws
     * [KO] 주어진 rgbaString이 유효한 RGBA 색상 값이 아닌 경우 오류가 발생합니다.
     * [EN] Throws an error if the provided rgbaString is not a valid RGBA color value.
     */
    setColorByRGBAString(rgbaString: string): void;
}
export default ColorRGBA;
