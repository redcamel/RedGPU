#redgpu_include systemStruct.OutputShadowData;

/**
 * [KO] 비어있는 그림자 맵 버텍스 셰이더 엔트리 포인트입니다.
 * [EN] Empty vertex shader entry point for shadow map generation.
 *
 * @param inputData [KO] 버텍스 입력 데이터 [EN] Vertex input data
 * @returns [KO] 그림자 맵 출력 데이터 [EN] Shadow map output data
 */
@vertex
fn entryPointShadowVertex(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;
    return output;
}
