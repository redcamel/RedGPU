export type TypedArrayConstructor = Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;
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

 */
declare class WGSLUniformTypes {
    static get i32(): TypeUniform;
    static get u32(): TypeUniform;
    static get f32(): TypeUniform;
    static get f16(): TypeUniform;
    static get vec2f32(): TypeUniform;
    static get vec2i32(): TypeUniform;
    static get vec2u32(): TypeUniform;
    static get vec2u16(): TypeUniform;
    static get vec3i32(): TypeUniform;
    static get vec3u32(): TypeUniform;
    static get vec3f32(): TypeUniform;
    static get vec3u16(): TypeUniform;
    static get vec4i32(): TypeUniform;
    static get vec4u32(): TypeUniform;
    static get vec4f32(): TypeUniform;
    static get vec4u16(): TypeUniform;
    static get mat2x2f32(): TypeUniform;
    static get mat2x2u16(): TypeUniform;
    static get mat3x2f32(): TypeUniform;
    static get mat3x2u16(): TypeUniform;
    static get mat3x3f32(): TypeUniform;
    static get mat4x2f32(): TypeUniform;
    static get mat4x2u16(): TypeUniform;
    static get mat2x3f32(): TypeUniform;
    static get mat2x3u16(): TypeUniform;
    static get mat4x4f32(): TypeUniform;
    static get mat4x4u16(): TypeUniform;
}
export default WGSLUniformTypes;
