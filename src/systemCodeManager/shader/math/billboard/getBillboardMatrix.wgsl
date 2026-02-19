/**
 * [KO] 빌보드 행렬을 계산합니다.
 * [EN] Calculates the billboard matrix.
 * @param cameraMatrix - [KO] 카메라 행렬 [EN] Camera matrix
 * @param modelMatrix - [KO] 모델 행렬 [EN] Model matrix
 * @param useStandardScale - [KO] 1u: 표준 (정확한 스케일 추출), 0u: 빠른 스케일 (대각 성분 사용)
 *                           [EN] 1u: Standard (accurate scale extraction), 0u: Fast scale (uses diagonal elements)
 */
fn getBillboardMatrix(cameraMatrix: mat4x4<f32>, modelMatrix: mat4x4<f32>, useStandardScale: u32) -> mat4x4<f32> {
    var resultMatrix = cameraMatrix * modelMatrix;
    
    if (useStandardScale == 1u) {
        // [표준 모드] 회전이 포함된 행렬에서도 정확한 스케일 추출 (length 연산 포함)
        let scaleX = length(modelMatrix[0].xyz);
        let scaleY = length(modelMatrix[1].xyz);
        let scaleZ = length(modelMatrix[2].xyz);
        
        resultMatrix[0] = vec4<f32>(scaleX, 0.0, 0.0, resultMatrix[0].w);
        resultMatrix[1] = vec4<f32>(0.0, scaleY, 0.0, resultMatrix[1].w);
        resultMatrix[2] = vec4<f32>(0.0, 0.0, scaleZ, resultMatrix[2].w);
    } else {
        // [빠른 모드] 대각 성분을 직접 사용하여 회전 제거 (파티클 등 최적화용)
        resultMatrix[0] = vec4<f32>(modelMatrix[0][0], 0.0, 0.0, resultMatrix[0].w);
        resultMatrix[1] = vec4<f32>(0.0, modelMatrix[1][1], 0.0, resultMatrix[1].w);
        resultMatrix[2] = vec4<f32>(0.0, 0.0, modelMatrix[2][2], resultMatrix[2].w);
    }
    
    return resultMatrix;
}
