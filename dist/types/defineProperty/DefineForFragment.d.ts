/**
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
