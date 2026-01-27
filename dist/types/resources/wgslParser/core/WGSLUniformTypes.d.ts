export type TypedArrayConstructor = Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;
/** [KO] 유니폼 타입 정보를 담는 타입 [EN] Type representing uniform type information */
export type TypeUniform = {
    numElements: number;
    align: number;
    size: number;
    type: string;
    View: TypedArrayConstructor;
    pad?: number[];
    wgslType: string;
};
/**
 * [KO] WGSL 유니폼 타입을 정의하고 관련 정보를 제공하는 클래스입니다.
 * [EN] Class that defines WGSL uniform types and provides related information.
 *
 * [KO] 각 타입별로 요소 개수, 정렬(align), 크기(size), 그리고 대응되는 TypedArray 생성자(View) 정보를 포함합니다.
 * [EN] Includes element count, alignment, size, and corresponding TypedArray constructor (View) for each type.
 *
 * @category WGSL
 */
declare class WGSLUniformTypes {
    /** [KO] i32 타입 [EN] i32 type */
    static get i32(): TypeUniform;
    /** [KO] u32 타입 [EN] u32 type */
    static get u32(): TypeUniform;
    /** [KO] f32 타입 [EN] f32 type */
    static get f32(): TypeUniform;
    /** [KO] f16 타입 [EN] f16 type */
    static get f16(): TypeUniform;
    /** [KO] vec2<f32> 타입 [EN] vec2<f32> type */
    static get vec2f32(): TypeUniform;
    /** [KO] vec2<i32> 타입 [EN] vec2<i32> type */
    static get vec2i32(): TypeUniform;
    /** [KO] vec2<u32> 타입 [EN] vec2<u32> type */
    static get vec2u32(): TypeUniform;
    /** [KO] vec2<u16> 타입 [EN] vec2<u16> type */
    static get vec2u16(): TypeUniform;
    /** [KO] vec3<i32> 타입 [EN] vec3<i32> type */
    static get vec3i32(): TypeUniform;
    /** [KO] vec3<u32> 타입 [EN] vec3<u32> type */
    static get vec3u32(): TypeUniform;
    /** [KO] vec3<f32> 타입 [EN] vec3<f32> type */
    static get vec3f32(): TypeUniform;
    /** [KO] vec3<u16> 타입 [EN] vec3<u16> type */
    static get vec3u16(): TypeUniform;
    /** [KO] vec4<i32> 타입 [EN] vec4<i32> type */
    static get vec4i32(): TypeUniform;
    /** [KO] vec4<u32> 타입 [EN] vec4<u32> type */
    static get vec4u32(): TypeUniform;
    /** [KO] vec4<f32> 타입 [EN] vec4<f32> type */
    static get vec4f32(): TypeUniform;
    /** [KO] vec4<u16> 타입 [EN] vec4<u16> type */
    static get vec4u16(): TypeUniform;
    /** [KO] mat2x2<f32> 타입 [EN] mat2x2<f32> type */
    static get mat2x2f32(): TypeUniform;
    /** [KO] mat2x2<u16> 타입 [EN] mat2x2<u16> type */
    static get mat2x2u16(): TypeUniform;
    /** [KO] mat3x2<f32> 타입 [EN] mat3x2<f32> type */
    static get mat3x2f32(): TypeUniform;
    /** [KO] mat3x2<u16> 타입 [EN] mat3x2<u16> type */
    static get mat3x2u16(): TypeUniform;
    /** [KO] mat3x3<f32> 타입 [EN] mat3x3<f32> type */
    static get mat3x3f32(): TypeUniform;
    /** [KO] mat4x2<f32> 타입 [EN] mat4x2<f32> type */
    static get mat4x2f32(): TypeUniform;
    /** [KO] mat4x2<u16> 타입 [EN] mat4x2<u16> type */
    static get mat4x2u16(): TypeUniform;
    /** [KO] mat2x3<f32> 타입 [EN] mat2x3<f32> type */
    static get mat2x3f32(): TypeUniform;
    /** [KO] mat2x3<u16> 타입 [EN] mat2x3<u16> type */
    static get mat2x3u16(): TypeUniform;
    /** [KO] mat4x4<f32> 타입 [EN] mat4x4<f32> type */
    static get mat4x4f32(): TypeUniform;
    /** [KO] mat4x4<u16> 타입 [EN] mat4x4<u16> type */
    static get mat4x4u16(): TypeUniform;
}
export default WGSLUniformTypes;
