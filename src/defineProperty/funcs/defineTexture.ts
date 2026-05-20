import applyProperties from "../core/applyProperties";
import defineProperty_SETTING from "../core/defineProperty_SETTING";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import ANoiseTexture from "../../resources/texture/noiseTexture/core/ANoiseTexture";
import HDRTexture from "../../resources/texture/hdr/HDRTexture";
import updateTargetUniform from "../core/updateTargetUniform";

export interface IDefineTexture {
    key: string;
    value?: BitmapTexture | ANoiseTexture | HDRTexture;
}

function createSetter(propertyKey: string, symbol: symbol) {
    const useKey = `use${propertyKey.charAt(0).toUpperCase()}${propertyKey.substring(1)}`;
    return function (texture: BitmapTexture | ANoiseTexture | HDRTexture) {
        const prevTexture: BitmapTexture | ANoiseTexture | HDRTexture = this[symbol];
        this[symbol] = texture;
        this.updateTexture(prevTexture, texture);

        if (useKey in this) {
            this[useKey] = !!texture;
        }
        updateTargetUniform(this, useKey, texture ? 1 : 0);
    };
}

function defineTexture_func(propertyKey: IDefineTexture) {
    const {key, value} = propertyKey;
    const symbol = Symbol(key);
    return {
        get: function (): BitmapTexture | ANoiseTexture | HDRTexture {
            if (this[symbol] === undefined && value !== undefined) {
                this[symbol] = value;
            }
            return this[symbol];
        },
        set: createSetter(key, symbol),
        ...defineProperty_SETTING,
    };
}

/**
 * [KO] 지정된 클래스에 Texture 속성들을 정의합니다.
 * [EN] Defines Texture properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 설정(IDefineTexture) 또는 설정 배열 [EN] Configuration (IDefineTexture) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IDefineTexture)
 * DefineUniformProperty.defineTexture(MyMaterial, { key: 'diffuseTexture' });
 * DefineUniformProperty.defineTexture(MyMaterial, [{ key: 'diffuseTexture' }]);
 * ```
 */
const defineTexture = (target: any, keys: IDefineTexture | IDefineTexture[]) => applyProperties(target, keys, defineTexture_func);

Object.freeze(defineTexture);
export default defineTexture;
