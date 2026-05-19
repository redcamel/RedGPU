import ColorRGB from "../../color/ColorRGB";
import isHexColor from "../../runtimeChecker/isFunc/isHexColor";
import convertHexToRgb from "../../color/convertHexToRgb";
import applyProperties from "../core/applyProperties";
import updateTargetUniform from "../core/updateTargetUniform";
import defineProperty_SETTING from "../core/defineProperty_SETTING";

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
    propertyKey: string | IColorRGB,
    initValue: string = '#fff'
) {
    const key = typeof propertyKey === 'object' ? propertyKey.key : propertyKey;
    const value = typeof propertyKey === 'object' ? (propertyKey.value ?? '#fff') : initValue;
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
 * [KO] 지정된 클래스에 ColorRGB 속성들을 정의합니다.
 * [EN] Defines ColorRGB properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 키, 키 배열 또는 설정 배열 [EN] Property keys, array of keys, or configuration array
 *
 * @example
 * ```typescript
 * // 단일 키 정의
 * DefineUniformProperty.defineColorRGB(MyMaterial, 'color');
 * // 초기값과 함께 정의 (배열 방식)
 * DefineUniformProperty.defineColorRGB(MyMaterial, [['color', '#ff0000']]);
 * // 설정 객체 방식 (IColorRGB)
 * DefineUniformProperty.defineColorRGB(MyMaterial, [{ key: 'color', value: '#00ff00' }]);
 * ```
 */
const defineColorRGB = (target: any, keys: string | (string | IColorRGB | [string, string?])[]) => applyProperties(target, keys, defineColorRGB_func);

Object.freeze(defineColorRGB);
export default defineColorRGB;
