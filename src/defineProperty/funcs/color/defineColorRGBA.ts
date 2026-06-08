import ColorRGBA from "../../../color/ColorRGBA";
import isHexColor from "../../../runtimeChecker/isFunc/isHexColor";
import convertHexToRgb from "../../../color/convertHexToRgb";
import applyProperties from "../../core/applyProperties";
import updateTargetUniform from "../../core/updateTargetUniform";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

/**
 * `defineColorRGBA` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.
 */
export interface IColorRGBA {
    /**
     * [KO] 속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.
     * [EN] Key name of the property. Defined on the target object's prototype under this name.
     */
    key: string;
    /**
     * [KO] 초기 16진수 색상 코드값 (예: `#ff0000`). 지정하지 않을 경우 기본값은 `#fff`입니다.
     * [EN] Initial hex color code (e.g., `#ff0000`). If not specified, defaults to `#fff`.
     */
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
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 RGBA 색상(ColorRGBA) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 해당 속성의 getter는 {@link ColorRGBA} 인스턴스를 반환합니다.
 * - setter는 16진수 문자열(예: `#ff0000`) 또는 {@link ColorRGBA} 인스턴스를 허용합니다.
 * - 값이 설정되거나 내부 RGBA(알파 포함) 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼에 정규화된 선형 RGBA 값(rgbaNormalLinear)을 업데이트합니다.
 *
 * **[EN]**
 * - The getter returns a {@link ColorRGBA} instance.
 * - The setter accepts a hex color string (e.g. `#ff0000`) or a {@link ColorRGBA} instance.
 * - When the value changes, it automatically normalizes and writes to the GPU uniform buffer as linear RGBA values (rgbaNormalLinear).
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link IColorRGBA} 설정 또는 그 배열 [EN] A single {@link IColorRGBA} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, { key: 'diffuseColor', value: '#ff0000' });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, [
 *   { key: 'ambientColor', value: '#111111' },
 *   { key: 'specularColor', value: '#ffffff' }
 * ]);
 * ```
 */
const defineColorRGBA = (target: any, defineInfo: IColorRGBA | IColorRGBA[]) => applyProperties(target, defineInfo, defineColorRGBA_func);

Object.freeze(defineColorRGBA);
export default defineColorRGBA;
