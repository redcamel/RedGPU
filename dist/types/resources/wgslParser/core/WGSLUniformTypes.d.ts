/**
 * [KO] TypedArray 생성자 함수 타입입니다.
 * [EN] Constructor function type for TypedArray.
 * @category WGSL
 */
export type TypedArrayConstructor = Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;
/**
 * [KO] WGSL 유니폼 타입의 메타데이터(요소 수, 정렬, 크기, 뷰 생성자 등)를 정의하는 타입입니다.
 * [EN] Type defining metadata (element count, alignment, size, view constructor, etc.) of a WGSL uniform type.
 * @category WGSL
 */
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
 * [KO] WGSL 셰이더 변수 및 유니폼 구조체의 타입 메타데이터(크기, 정렬, TypedArray 매핑 등)를 제공하는 정적 클래스입니다.
 * [EN] Static class providing type metadata (size, alignment, TypedArray mapping, etc.) for WGSL shader variables and uniform structs.
 *
 * @category WGSL
 */
declare class WGSLUniformTypes {
    /**
     * [KO] `i32` 스칼라 타입 메타데이터
     * [EN] `i32` scalar type metadata
     */
    static get i32(): TypeUniform;
    /**
     * [KO] `u32` 스칼라 타입 메타데이터
     * [EN] `u32` scalar type metadata
     */
    static get u32(): TypeUniform;
    /**
     * [KO] `f32` 스칼라 타입 메타데이터
     * [EN] `f32` scalar type metadata
     */
    static get f32(): TypeUniform;
    /**
     * [KO] `f16` 스칼라 타입 메타데이터
     * [EN] `f16` scalar type metadata
     */
    static get f16(): TypeUniform;
    /**
     * [KO] `vec2<f32>` 벡터 타입 메타데이터
     * [EN] `vec2<f32>` vector type metadata
     */
    static get vec2f32(): TypeUniform;
    /**
     * [KO] `vec2<i32>` 벡터 타입 메타데이터
     * [EN] `vec2<i32>` vector type metadata
     */
    static get vec2i32(): TypeUniform;
    /**
     * [KO] `vec2<u32>` 벡터 타입 메타데이터
     * [EN] `vec2<u32>` vector type metadata
     */
    static get vec2u32(): TypeUniform;
    /**
     * [KO] `vec2<u16>` 벡터 타입 메타데이터
     * [EN] `vec2<u16>` vector type metadata
     */
    static get vec2u16(): TypeUniform;
    /**
     * [KO] `vec3<i32>` 벡터 타입 메타데이터
     * [EN] `vec3<i32>` vector type metadata
     */
    static get vec3i32(): TypeUniform;
    /**
     * [KO] `vec3<u32>` 벡터 타입 메타데이터
     * [EN] `vec3<u32>` vector type metadata
     */
    static get vec3u32(): TypeUniform;
    /**
     * [KO] `vec3<f32>` 벡터 타입 메타데이터
     * [EN] `vec3<f32>` vector type metadata
     */
    static get vec3f32(): TypeUniform;
    /**
     * [KO] `vec3<u16>` 벡터 타입 메타데이터
     * [EN] `vec3<u16>` vector type metadata
     */
    static get vec3u16(): TypeUniform;
    /**
     * [KO] `vec4<i32>` 벡터 타입 메타데이터
     * [EN] `vec4<i32>` vector type metadata
     */
    static get vec4i32(): TypeUniform;
    /**
     * [KO] `vec4<u32>` 벡터 타입 메타데이터
     * [EN] `vec4<u32>` vector type metadata
     */
    static get vec4u32(): TypeUniform;
    /**
     * [KO] `vec4<f32>` 벡터 타입 메타데이터
     * [EN] `vec4<f32>` vector type metadata
     */
    static get vec4f32(): TypeUniform;
    /**
     * [KO] `vec4<u16>` 벡터 타입 메타데이터
     * [EN] `vec4<u16>` vector type metadata
     */
    static get vec4u16(): TypeUniform;
    /**
     * [KO] `mat2x2<f32>` 행렬 타입 메타데이터
     * [EN] `mat2x2<f32>` matrix type metadata
     */
    static get mat2x2f32(): TypeUniform;
    /**
     * [KO] `mat2x2<u16>` 행렬 타입 메타데이터
     * [EN] `mat2x2<u16>` matrix type metadata
     */
    static get mat2x2u16(): TypeUniform;
    /**
     * [KO] `mat3x2<f32>` 행렬 타입 메타데이터
     * [EN] `mat3x2<f32>` matrix type metadata
     */
    static get mat3x2f32(): TypeUniform;
    /**
     * [KO] `mat3x2<u16>` 행렬 타입 메타데이터
     * [EN] `mat3x2<u16>` matrix type metadata
     */
    static get mat3x2u16(): TypeUniform;
    /**
     * [KO] `mat3x3<f32>` 행렬 타입 메타데이터
     * [EN] `mat3x3<f32>` matrix type metadata
     */
    static get mat3x3f32(): TypeUniform;
    /**
     * [KO] `mat4x2<f32>` 행렬 타입 메타데이터
     * [EN] `mat4x2<f32>` matrix type metadata
     */
    static get mat4x2f32(): TypeUniform;
    /**
     * [KO] `mat4x2<u16>` 행렬 타입 메타데이터
     * [EN] `mat4x2<u16>` matrix type metadata
     */
    static get mat4x2u16(): TypeUniform;
    /**
     * [KO] `mat2x3<f32>` 행렬 타입 메타데이터
     * [EN] `mat2x3<f32>` matrix type metadata
     */
    static get mat2x3f32(): TypeUniform;
    /**
     * [KO] `mat2x3<u16>` 행렬 타입 메타데이터
     * [EN] `mat2x3<u16>` matrix type metadata
     */
    static get mat2x3u16(): TypeUniform;
    /**
     * [KO] `mat4x4<f32>` 행렬 타입 메타데이터
     * [EN] `mat4x4<f32>` matrix type metadata
     */
    static get mat4x4f32(): TypeUniform;
    /**
     * [KO] `mat4x4<u16>` 행렬 타입 메타데이터
     * [EN] `mat4x4<u16>` matrix type metadata
     */
    static get mat4x4u16(): TypeUniform;
}
export default WGSLUniformTypes;
