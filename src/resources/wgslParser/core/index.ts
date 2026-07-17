/**
 * [KO] WGSL 파서의 핵심 기능(전처리, 변형 생성, 타입 정의 등)을 제공합니다.
 * [EN] Provides core functionalities of the WGSL parser (preprocessing, variant generation, type definitions, etc.).
 * @packageDocumentation
 */
import ensureVertexIndexBuiltin from "./ensureVertexIndexBuiltin";
import ShaderVariantGenerator from "./ShaderVariantGenerator";
import WGSLUniformTypes, {TypedArrayConstructor, TypeUniform} from "./WGSLUniformTypes";

export {
    ensureVertexIndexBuiltin,
    ShaderVariantGenerator,
    WGSLUniformTypes,
    TypeUniform,
    TypedArrayConstructor
};
