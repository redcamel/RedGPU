/**
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
        USE_BILLBOARD_PERSPECTIVE: string;
        USE_BILLBOARD: string;
        RECEIVE_SHADOW: string;
    };
    PRESET_POSITIVE_NUMBER: {
        BILLBOARD_FIXED_SCALE: string;
    };
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
