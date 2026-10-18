import ColorRGBA from "../../../color/ColorRGBA";
import isHexColor from "../../../runtimeChecker/isFunc/isHexColor";
import convertHexToRgb from "../../../color/convertHexToRgb";
import applyProperties from "../../core/applyProperties";
import updateTargetUniform from "../../core/updateTargetUniform";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";

/**
 * [KO] `defineColorRGBA` 함수에 전달할 RGBA 색상 프로퍼티 정의 옵션 인터페이스입니다.
 * [EN] Interface defining RGBA color property options for the `defineColorRGBA` function.
 *
 * @category DefineProperty
 */
export interface DefineColorRGBAInfo {
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
    propertyInfo: DefineColorRGBAInfo
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
 * [KO] 대상 클래스의 프로토타입에 GPU 유니폼 버퍼와 연동되는 `ColorRGBA` 프로퍼티를 동적으로 정의합니다.
 * [EN] Dynamically defines `ColorRGBA` properties linked to the GPU uniform buffer on the target class prototype.
 *
 * [KO] Setter는 16진수 색상 문자열(예: `'#ff0000'`) 또는 `ColorRGBA` 인스턴스를 허용하며, 값 변경 시 정규화된 선형 RGBA 값(`rgbaNormalLinear`)을 유니폼 버퍼에 자동 기록합니다.
 * [EN] The setter accepts a hex color string (e.g., `'#ff0000'`) or a `ColorRGBA` instance, automatically writing normalized linear RGBA values (`rgbaNormalLinear`) to the uniform buffer on change.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 RGBA 색상 프로퍼티 정의
 * // [EN] Define a single RGBA color property
 * RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, { key: 'diffuseColor', value: '#ff0000' });
 *
 * // [KO] 다중 RGBA 색상 프로퍼티 일괄 정의
 * // [EN] Define multiple RGBA color properties at once
 * RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, [
 *     { key: 'ambientColor', value: '#111111' },
 *     { key: 'specularColor', value: '#ffffff' }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 프로퍼티를 정의할 대상 클래스 생성자
 * [EN] Target class constructor to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefineColorRGBAInfo` 설정 객체 또는 설정 배열
 * [EN] Single `DefineColorRGBAInfo` configuration object or array of configurations
 * @category DefineProperty
 */
const defineColorRGBA = (target: any, defineInfo: DefineColorRGBAInfo | DefineColorRGBAInfo[]) => applyProperties(target, defineInfo, defineColorRGBA_func);

Object.freeze(defineColorRGBA);
export default defineColorRGBA;
