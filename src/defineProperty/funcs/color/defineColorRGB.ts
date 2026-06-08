import ColorRGB from "../../../color/ColorRGB";
import isHexColor from "../../../runtimeChecker/isFunc/isHexColor";
import convertHexToRgb from "../../../color/convertHexToRgb";
import applyProperties from "../../core/applyProperties";
import updateTargetUniform from "../../core/updateTargetUniform";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

export interface IColorRGB {
    key: string;
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
    propertyInfo: IColorRGB
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
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 RGB 색상(ColorRGB) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 해당 속성의 getter는 {@link ColorRGB} 인스턴스를 반환합니다.
 * - setter는 16진수 문자열(예: `#ff0000`) 또는 {@link ColorRGB} 인스턴스를 허용합니다.
 * - 값이 설정되거나 내부 RGB 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼에 정규화된 선형 RGB 값(rgbNormalLinear)을 업데이트합니다.
 *
 * **[EN]**
 * - The getter returns a {@link ColorRGB} instance.
 * - The setter accepts a hex color string (e.g. `#ff0000`) or a {@link ColorRGB} instance.
 * - When the value changes, it automatically normalizes and writes to the GPU uniform buffer as linear RGB values (rgbNormalLinear).
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link IColorRGB} 설정 또는 그 배열 [EN] A single {@link IColorRGB} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, { key: 'albedoColor', value: '#ff0000' });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, [
 *   { key: 'emissiveColor', value: '#000000' },
 *   { key: 'specularColor', value: '#ffffff' }
 * ]);
 * ```
 */
const defineColorRGB = (target: any, defineInfo: IColorRGB | IColorRGB[]) => applyProperties(target, defineInfo, defineColorRGB_func);

Object.freeze(defineColorRGB);
export default defineColorRGB;
