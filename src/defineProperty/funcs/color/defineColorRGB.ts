import ColorRGB from "../../../color/ColorRGB";
import isHexColor from "../../../runtimeChecker/isFunc/isHexColor";
import convertHexToRgb from "../../../color/convertHexToRgb";
import applyProperties from "../../core/applyProperties";
import updateTargetUniform from "../../core/updateTargetUniform";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

/**
 * [KO] `defineColorRGB` 함수에 전달할 RGB 색상 프로퍼티 정의 옵션 인터페이스입니다.
 * [EN] Interface defining RGB color property options for the `defineColorRGB` function.
 *
 * @category DefineProperty
 */
export interface DefineColorRGBInfo {
    /**
     * [KO] 대상 프로토타입에 정의할 프로퍼티 키 이름입니다.
     * [EN] Property key name to define on the target prototype.
     */
    key: string;
    /**
     * [KO] 초기 16진수 색상 코드 문자열(예: `'#ff0000'`)입니다. 기본값은 `'#fff'`입니다.
     * [EN] Initial hex color code string (e.g., `'#ff0000'`). Default is `'#fff'`.
     */
    value?: string;
}

function createColorRGB(instance: any, propertyKey: string, symbol: symbol, hexValue: string) {
    let r = 255, g = 255, b = 255;
    if (isHexColor(hexValue)) {
        const t0 = convertHexToRgb(hexValue);
        r = t0.r;
        g = t0.g;
        b = t0.b;
    }
    return new ColorRGB(r, g, b, () => {
        updateTargetUniform(instance, propertyKey, instance[symbol].rgbNormalLinear);
    });
}

function defineColorRGB_func(
    propertyInfo: DefineColorRGBInfo
) {
    const key = propertyInfo.key;
    const value = propertyInfo.value ?? '#fff';
    const symbol = Symbol(key);

    return {
        get: function (): ColorRGB {
            if (this[symbol] === undefined) {
                this[symbol] = createColorRGB(this, key, symbol, value);
            }
            return this[symbol];
        },
        set: function (newValue: string | ColorRGB) {
            if (typeof newValue === 'string' && isHexColor(newValue)) {
                const {r, g, b} = convertHexToRgb(newValue);
                if (this[symbol]) {
                    this[symbol].r = r;
                    this[symbol].g = g;
                    this[symbol].b = b;
                } else {
                    this[symbol] = createColorRGB(this, key, symbol, newValue);
                }
            } else if (newValue instanceof ColorRGB) {
                this[symbol] = newValue;
                updateTargetUniform(this, key, newValue.rgbNormalLinear);
            }
        },
        ...defineProperty_SETTING,
    };
}

/**
 * [KO] 대상 클래스의 프로토타입에 GPU 유니폼 버퍼와 연동되는 `ColorRGB` 프로퍼티를 동적으로 정의합니다.
 * [EN] Dynamically defines `ColorRGB` properties linked to the GPU uniform buffer on the target class prototype.
 *
 * [KO] Setter는 16진수 색상 문자열(예: `'#ff0000'`) 또는 `ColorRGB` 인스턴스를 허용하며, 값 변경 시 정규화된 선형 RGB 값(`rgbNormalLinear`)을 유니폼 버퍼에 자동 기록합니다.
 * [EN] The setter accepts a hex color string (e.g., `'#ff0000'`) or a `ColorRGB` instance, automatically writing normalized linear RGB values (`rgbNormalLinear`) to the uniform buffer on change.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 RGB 색상 프로퍼티 정의
 * // [EN] Define a single RGB color property
 * RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, { key: 'albedoColor', value: '#ff0000' });
 *
 * // [KO] 다중 RGB 색상 프로퍼티 일괄 정의
 * // [EN] Define multiple RGB color properties at once
 * RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, [
 *     { key: 'emissiveColor', value: '#000000' },
 *     { key: 'specularColor', value: '#ffffff' }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 프로퍼티를 정의할 대상 클래스 생성자
 * [EN] Target class constructor to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefineColorRGBInfo` 설정 객체 또는 설정 배열
 * [EN] Single `DefineColorRGBInfo` configuration object or array of configurations
 * @category DefineProperty
 */
const defineColorRGB = (target: any, defineInfo: DefineColorRGBInfo | DefineColorRGBInfo[]) => applyProperties(target, defineInfo, defineColorRGB_func);

Object.freeze(defineColorRGB);
export default defineColorRGB;
