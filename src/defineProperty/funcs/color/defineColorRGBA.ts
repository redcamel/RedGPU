import ColorRGBA from "../../../color/ColorRGBA";
import isHexColor from "../../../runtimeChecker/isFunc/isHexColor";
import convertHexToRgb from "../../../color/convertHexToRgb";
import applyProperties from "../../core/applyProperties";
import updateTargetUniform from "../../core/updateTargetUniform";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

export interface IColorRGBA {
    key: string;
    value?: string;
}

function createColorRGBA(instance: any, propertyKey: string, symbol: symbol, hexValue: string) {
    let r = 255, g = 255, b = 255, a = 1;
    if (isHexColor(hexValue)) {
        const t0 = convertHexToRgb(hexValue);
        r = t0.r;
        g = t0.g;
        b = t0.b;
    }
    return new ColorRGBA(r, g, b, a, () => {
        updateTargetUniform(instance, propertyKey, instance[symbol].rgbaNormalLinear);
    });
}

function defineColorRGBA_func(
    propertyInfo: IColorRGBA
) {
    const key = propertyInfo.key;
    const value = propertyInfo.value ?? '#fff';
    const symbol = Symbol(key);

    return {
        get: function (): ColorRGBA {
            if (this[symbol] === undefined) {
                this[symbol] = createColorRGBA(this, key, symbol, value);
            }
            return this[symbol];
        },
        set: function (newValue: string | ColorRGBA) {
            if (typeof newValue === 'string' && isHexColor(newValue)) {
                const {r, g, b} = convertHexToRgb(newValue);
                if (this[symbol]) {
                    this[symbol].r = r;
                    this[symbol].g = g;
                    this[symbol].b = b;
                } else {
                    this[symbol] = createColorRGBA(this, key, symbol, newValue);
                }
            } else if (newValue instanceof ColorRGBA) {
                this[symbol] = newValue;
                updateTargetUniform(this, key, newValue.rgbaNormalLinear);
            }
        },
        ...defineProperty_SETTING,
    };
}

/**
 * [KO] 지정된 클래스에 ColorRGBA 속성들을 정의합니다.
 * [EN] Defines ColorRGBA properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 정의할 속성 설정(IColorRGBA) 또는 설정 배열 [EN] Configuration (IColorRGBA) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IColorRGBA)
 * RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, { key: 'color', value: '#00ff00' });
 * RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, [{ key: 'color', value: '#00ff00' }]);
 * ```
 */
const defineColorRGBA = (target: any, defineInfo: IColorRGBA | IColorRGBA[]) => applyProperties(target, defineInfo, defineColorRGBA_func);

Object.freeze(defineColorRGBA);
export default defineColorRGBA;
