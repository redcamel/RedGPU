import applyProperties from "../../core/applyProperties";
import defineProperty_SETTING from "../../core/defineProperty_SETTING";
import CubeTexture from "../../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../../resources/texture/DirectCubeTexture";
import updateTargetUniform from "../../core/updateTargetUniform";

/**
 * [KO] `defineCubeTexture` 함수에 전달할 속성 정의 옵션 인터페이스입니다.
 * [EN] Interface for property definition options passed to the `defineCubeTexture` function.
 *
 * @category DefineProperty
 */
export interface DefineCubeTextureInfo {
    /**
     * [KO] 대상 객체 프로토타입에 정의할 속성 키 이름
     * [EN] Property key name to define on the target object's prototype
     */
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

function defineCubeTexture_func(propertyInfo: DefineCubeTextureInfo) {
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
 * [KO] 지정된 대상의 프로토타입에 GPU 바인드 그룹 및 유니폼 버퍼와 연동되는 큐브 텍스처 속성을 정의합니다.
 * [EN] Defines cube texture properties on the target's prototype that synchronize with GPU bind groups and uniform buffers.
 *
 * [KO] 텍스처 변경 시 대상의 `updateTexture(prevTexture, texture)`를 호출하며, `use{Key}` 속성이 존재하면 불리언 상태와 유니폼 값(1 또는 0)을 자동 갱신합니다.
 * [EN] Invokes `updateTexture(prevTexture, texture)` on the target when changed, and automatically updates the boolean state and uniform value (1 or 0) if a corresponding `use{Key}` property exists.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 큐브 텍스처 속성 정의
 * // [EN] Define a single cube texture property
 * RedGPU.DefineGPUProperty.defineCubeTexture(MyMaterial, { key: 'envTexture' });
 *
 * // [KO] 다중 큐브 텍스처 속성 일괄 정의
 * // [EN] Define multiple cube texture properties at once
 * RedGPU.DefineGPUProperty.defineCubeTexture(MyMaterial, [
 *   { key: 'skyboxTexture' },
 *   { key: 'reflectionTexture' }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 속성을 정의할 대상 클래스 또는 프로토타입
 * [EN] Target class or prototype to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefineCubeTextureInfo` 설정 또는 설정 배열
 * [EN] Single `DefineCubeTextureInfo` configuration or an array of configurations
 * @category DefineProperty
 */
const defineCubeTexture = (target: any, defineInfo: DefineCubeTextureInfo | DefineCubeTextureInfo[]) => applyProperties(target, defineInfo, defineCubeTexture_func);

Object.freeze(defineCubeTexture);
export default defineCubeTexture;
