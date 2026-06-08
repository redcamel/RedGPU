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
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 큐브 텍스처(CubeTexture) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 해당 속성의 getter/setter는 {@link CubeTexture} 또는 {@link DirectCubeTexture} 인스턴스를 처리합니다.
 * - 텍스처가 설정되면 자동으로 바인드 그룹을 업데이트하기 위해 대상 인스턴스의 `updateTexture(prevTexture, texture)` 메서드가 호출됩니다.
 * - 만약 대상 인스턴스에 `use{Key}` 패턴의 속성(예: `useEnvMap` 등)이 존재할 경우, 해당 텍스처의 유무에 맞춰 불리언 값 및 GPU 유니폼 버퍼에 1/0 상태를 동기화합니다.
 *
 * **[EN]**
 * - Handles {@link CubeTexture} or {@link DirectCubeTexture} instances.
 * - When a texture is set, it invokes `updateTexture(prevTexture, texture)` on the target instance to update bind groups.
 * - If a corresponding `use{Key}` property (e.g. `useEnvMap`) exists on the target, it automatically synchronizes its boolean state and GPU uniform value (1 or 0) based on texture presence.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link IDefineCubeTexture} 설정 또는 그 배열 [EN] A single {@link IDefineCubeTexture} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineCubeTexture(MyMaterial, { key: 'envTexture' });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineCubeTexture(MyMaterial, [
 *   { key: 'skyboxTexture' },
 *   { key: 'reflectionTexture' }
 * ]);
 * ```
 */
const defineCubeTexture = (target: any, defineInfo: IDefineCubeTexture | IDefineCubeTexture[]) => applyProperties(target, defineInfo, defineCubeTexture_func);

Object.freeze(defineCubeTexture);
export default defineCubeTexture;
