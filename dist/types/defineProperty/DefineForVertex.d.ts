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
declare const DefineForVertex: {
    defineBoolean: (classObject: Object, keyList: Array<any>) => void;
    defineUint: (classObject: Object, keyList: Array<any>) => void;
    definePositiveNumber: (classObject: Object, keyList: Array<any>) => void;
    defineVec4: (classObject: Object, keyList: Array<any>) => void;
    defineVec3: (classObject: Object, keyList: Array<any>) => void;
    defineVec2: (classObject: Object, keyList: Array<any>) => void;
    PRESET_BOOLEAN: {
        USE_BILLBOARD: string;
        RECEIVE_SHADOW: string;
    };
    PRESET_POSITIVE_NUMBER: {};
    PRESET_UINT: {};
    PRESET_SAMPLER: {};
    PRESET_TEXTURE: {};
    PRESET_CUBE_TEXTURE: {};
    PRESET_VEC2: {};
    PRESET_VEC3: {};
    PRESET_VEC4: {};
    PRESET_COLOR_RGB: {};
    defineByPreset: (classObject: Object, keyList: any) => void;
};
export default DefineForVertex;
