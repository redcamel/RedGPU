/**
 * [KO] WGSL 파서의 전처리, 셰이더 변형 생성, 유니폼 타입 메타데이터 등의 핵심 기능을 제공합니다.
 * [EN] Provides core functionality of the WGSL parser including preprocessing, shader variant generation, and uniform type metadata.
 * @packageDocumentation
 */
import ensureVertexIndexBuiltin from "./ensureVertexIndexBuiltin";
import ShaderVariantGenerator from "./ShaderVariantGenerator";
import WGSLUniformTypes, { TypedArrayConstructor, TypeUniform } from "./WGSLUniformTypes";
export { ensureVertexIndexBuiltin, ShaderVariantGenerator, WGSLUniformTypes, TypeUniform, TypedArrayConstructor };
