import {createDefineByPreset, defineProperties} from "./core/createDefineByPreset";
import defineBoolean from "./funcs/defineBoolean";

function defineProperty_boolean(propertyKey: string, initValue: boolean = false) {
    return defineBoolean(propertyKey, initValue, false)
}


const PRESET_BOOLEAN = {
    USE_BILLBOARD: 'useBillboard',
    RECEIVE_SHADOW: 'receiveShadow',
};
/**
 * [KO] 버텍스 쉐이더(Vertex Shader)에서 사용되는 속성들을 정의하는 네임스페이스입니다.
 * [EN] Namespace that defines properties used in Vertex Shaders.
 *
 * [KO] 빌보드 설정, 그림자 수신 여부 등 버텍스 단계의 기하학적 연산에 필요한 속성 정의 기능을 제공합니다.
 * [EN] Provides property definition features required for vertex-stage geometric operations, such as billboard settings and shadow reception.
 *
 * * ### Example
 * ```typescript
 * const material = new RedGPU.Material.BaseMaterial(redGPUContext);
 * RedGPU.DefineForVertex.USE_BILLBOARD('useBillboard', true);
 * ```
 * @namespace DefineForVertex
 */
const DefineForVertex = {
    ...createDefineByPreset(
        {
            defineBoolean: [defineProperty_boolean, PRESET_BOOLEAN],
        }
    ),
    //
    defineBoolean: defineProperties(defineProperty_boolean),

    //
    PRESET_BOOLEAN,
}
Object.freeze(DefineForVertex)
export default DefineForVertex
