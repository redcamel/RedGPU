/**
 * [KO] 프래그먼트 쉐이더(Fragment Shader)에서 사용되는 속성들을 정의하는 네임스페이스입니다.
 * [EN] Namespace that defines properties used in Fragment Shaders.
 *
 * [KO] 텍스처, 샘플러, 색상 등 프래그먼트 단계의 렌더링에 필요한 다양한 속성 정의 기능을 제공합니다.
 * [EN] Provides various property definition features required for fragment-stage rendering, such as textures, samplers, and colors.
 *
 * * ### Example
 * ```typescript
 * const material = new RedGPU.Material.BaseMaterial(redGPUContext);
 * RedGPU.DefineForFragment.COLOR('color', [1, 0, 0]);
 * ```
 * @namespace DefineForFragment
 */
declare const DefineForFragment: {
    defineBoolean: (classObject: Object, keyList: Array<any>) => void;
    definePositiveNumber: (classObject: Object, keyList: Array<any>) => void;
    defineUint: (classObject: Object, keyList: Array<any>) => void;
    defineVec2: (classObject: Object, keyList: Array<any>) => void;
    defineVec3: (classObject: Object, keyList: Array<any>) => void;
    defineVec4: (classObject: Object, keyList: Array<any>) => void;
    defineColorRGB: (classObject: Object, keyList: Array<any>) => void;
    defineColorRGBA: (classObject: Object, keyList: Array<any>) => void;
    defineSampler: (classObject: Object, keyList: Array<any>) => void;
    defineTexture: (classObject: Object, keyList: Array<any>) => void;
    defineCubeTexture: (classObject: Object, keyList: Array<any>) => void;
    PRESET_BOOLEAN: {};
    PRESET_POSITIVE_NUMBER: {
        AO_STRENGTH: string;
        SPECULAR_STRENGTH: string;
        EMISSIVE_STRENGTH: string;
        OPACITY: string;
        SHININESS: string;
        NORMAL_SCALE: string;
    };
    PRESET_UINT: {};
    PRESET_SAMPLER: {
        ALPHA_TEXTURE_SAMPLER: string;
        AO_TEXTURE_SAMPLER: string;
        DIFFUSE_TEXTURE_SAMPLER: string;
        EMISSIVE_TEXTURE_SAMPLER: string;
        ENVIRONMENT_TEXTURE_SAMPLER: string;
        NORMAL_TEXTURE_SAMPLER: string;
        SPECULAR_TEXTURE_SAMPLER: string;
    };
    PRESET_TEXTURE: {
        ALPHA_TEXTURE: string;
        AO_TEXTURE: string;
        DIFFUSE_TEXTURE: string;
        EMISSIVE_TEXTURE: string;
        NORMAL_TEXTURE: string;
        SPECULAR_TEXTURE: string;
    };
    PRESET_CUBE_TEXTURE: {
        ENVIRONMENT_TEXTURE: string;
    };
    PRESET_VEC2: {};
    PRESET_VEC3: {};
    PRESET_VEC4: {};
    PRESET_COLOR_RGB: {
        COLOR: string;
        EMISSIVE_COLOR: string;
        SPECULAR_COLOR: string;
    };
    defineByPreset: (classObject: Object, keyList: any) => void;
};
export default DefineForFragment;
