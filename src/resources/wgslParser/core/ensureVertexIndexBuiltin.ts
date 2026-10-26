/**
 * [KO] WGSL 셰이더 코드의 버텍스 진입점 함수에 `@builtin(vertex_index)` 인자가 포함되어 있는지 검사하고, 누락된 경우 자동으로 주입합니다.
 * [EN] Checks if the `@builtin(vertex_index)` argument is included in the WGSL shader's vertex entry function, and automatically injects it if missing.
 *
 * @param shaderSource -
 * [KO] 검사할 WGSL 셰이더 소스 코드
 * [EN] WGSL shader source code to check
 * @returns
 * [KO] `vertex_index`가 보장된 셰이더 소스 코드
 * [EN] Shader source code with guaranteed `vertex_index`
 * @deprecated
 * @category WGSL
 */
function ensureVertexIndexBuiltin(shaderSource: string): string {
    const builtinRegex = /@builtin\s*\(\s*vertex_index\s*\)/;
    if (builtinRegex.test(shaderSource)) {
        return shaderSource;
    }
    const vertexFnRegex = /(@vertex\s+fn\s+)([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)(\))/;
    const define = 'redgpu_auto_builtin_vertex_index: u32';
    const result = shaderSource.replace(
        vertexFnRegex,
        (_, prefix, fnName, args, suffix) => {
            const trimmedArgs = args.trim();
            const injectedArg = `@builtin(vertex_index) ${define}`;
            const newArgs = trimmedArgs.length === 0
                ? injectedArg
                : `${trimmedArgs}, ${injectedArg}`;
            return `${prefix}${fnName}(${newArgs}${suffix}`;
        }
    );
    return result;
}

export default ensureVertexIndexBuiltin;