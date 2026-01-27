/**
 * [KO] WGSL 셰이더 코드에 `vertex_index` 빌트인 인자가 포함되어 있는지 확인하고, 없으면 자동으로 주입합니다.
 * [EN] Checks if the `vertex_index` builtin argument is included in the WGSL shader code, and automatically injects it if not.
 *
 * [KO] Vertex 셰이더 함수에서 `vertex_index`가 필요한 경우를 대비해 자동으로 인자를 추가해 주는 유틸리티입니다.
 * [EN] This utility automatically adds the argument in case `vertex_index` is needed in the vertex shader function.
 *
 * @param shaderSource -
 * [KO] 검사할 WGSL 셰이더 소스 코드
 * [EN] WGSL shader source code to check
 * @returns
 * [KO] `vertex_index`가 보장된 셰이더 소스 코드
 * [EN] Shader source code with guaranteed `vertex_index`
 * @category WGSL
 */
declare function ensureVertexIndexBuiltin(shaderSource: string): string;
export default ensureVertexIndexBuiltin;
