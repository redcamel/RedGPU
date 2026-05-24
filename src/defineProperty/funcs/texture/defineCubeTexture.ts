import applyProperties from "../../core/applyProperties";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";
import CubeTexture from "../../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../../resources/texture/DirectCubeTexture";
import updateTargetUniform from "../../core/updateTargetUniform";

export interface IDefineCubeTexture {
    key: string;
}

function createSetter(propertyKey: string, symbol: symbol) {
    const useKey = `use${propertyKey.charAt(0).toUpperCase()}${propertyKey.substring(1)}`;
    return function (texture: CubeTexture | DirectCubeTexture) {
        const prevTexture: CubeTexture | DirectCubeTexture = this[symbol];
        this[symbol] = texture;
        this.updateTexture(prevTexture, texture);

        if (useKey in this) {
            this[useKey] = !!texture;
        }
        updateTargetUniform(this, useKey, texture ? 1 : 0);

    };
}

function defineCubeTexture_func(propertyInfo: IDefineCubeTexture) {
    const {key} = propertyInfo;
    const symbol = Symbol(key);
    return {
        get: function (): CubeTexture | DirectCubeTexture {
            return this[symbol];
        },
        set: createSetter(key, symbol),
        ...defineProperty_SETTING,
    };
}

/**
 * [KO] 지정된 클래스에 CubeTexture 속성들을 정의합니다.
 * [EN] Defines CubeTexture properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 정의할 속성 설정(IDefineCubeTexture) 또는 설정 배열 [EN] Configuration (IDefineCubeTexture) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IDefineCubeTexture)
 * DefineGPUProperty.defineCubeTexture(MyMaterial, { key: 'envTexture' });
 * DefineGPUProperty.defineCubeTexture(MyMaterial, [{ key: 'envTexture' }]);
 * ```
 */
const defineCubeTexture = (target: any, defineInfo: IDefineCubeTexture | IDefineCubeTexture[]) => applyProperties(target, defineInfo, defineCubeTexture_func);

Object.freeze(defineCubeTexture);
export default defineCubeTexture;
