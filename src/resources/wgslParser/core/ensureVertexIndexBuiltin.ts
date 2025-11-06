/**
 * ensureVertexIndexBuiltin
 * @param shaderSource
 */
function ensureVertexIndexBuiltin(shaderSource: string): string {
	// vertex_index builtin이 이미 선언되어 있는지 검사 (공백 허용)
	const builtinRegex = /@builtin\s*\(\s*vertex_index\s*\)/;
	if (builtinRegex.test(shaderSource)) {
		return shaderSource;
	}
	// vertex 셰이더 함수 정의 패턴: @vertex fn <함수명>(<인자>)
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
	// keepLog(result)
	return result;
}

export default ensureVertexIndexBuiltin;
