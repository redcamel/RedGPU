fn getBillboardMatrix(cameraMatrix: mat4x4<f32>, modelMatrix: mat4x4<f32>) -> mat4x4<f32> {
    // 스케일링 (모델 매트릭스에서 추출)
    let scaleX = length(vec3<f32>(modelMatrix[0].xyz));
    let scaleY = length(vec3<f32>(modelMatrix[1].xyz));
    let scaleZ = length(vec3<f32>(modelMatrix[2].xyz));

    // 스케일 행렬 생성
    let scaleMatrix = mat4x4<f32>(
        vec4<f32>(scaleX, 0.0, 0.0, 0.0),
        vec4<f32>(0.0, scaleY, 0.0, 0.0),
        vec4<f32>(0.0, 0.0, scaleZ, 0.0),
        vec4<f32>(0.0, 0.0, 0.0, 1.0)
    );

    // 회전 제거 (카메라 매트릭스와 모델 매트릭스 곱 적용)
    var resultMatrix = cameraMatrix * modelMatrix;
    resultMatrix[0][0] = 1.0; resultMatrix[0][1] = 0.0; resultMatrix[0][2] = 0.0;
    resultMatrix[1][0] = 0.0; resultMatrix[1][1] = 1.0; resultMatrix[1][2] = 0.0;
    resultMatrix[2][0] = 0.0; resultMatrix[2][1] = 0.0; resultMatrix[2][2] = 1.0;

    // 스케일 적용된 빌보드 매트릭스 반환
    return resultMatrix * scaleMatrix;
}
fn getBillboardMatrixNoScaleRatio( cameraMatrix:mat4x4<f32>,  modelMatrix:mat4x4<f32>)-> mat4x4<f32>{
   var resultMatrix = cameraMatrix * modelMatrix;
   resultMatrix[0][0] = modelMatrix[0][0]; resultMatrix[0][1] = 0.0; resultMatrix[0][2] = 0.0;
   resultMatrix[1][0] = 0.0; resultMatrix[1][1] = modelMatrix[1][1]; resultMatrix[1][2] = 0.0;
   resultMatrix[2][0] = 0.0; resultMatrix[2][1] = 0.0; resultMatrix[2][2] = modelMatrix[2][2];

   return resultMatrix;
}
