fn extractScaleAndTranslation(modelMatrix: mat4x4<f32>) -> mat4x4<f32> {
    // 상단 3x3 회전-스케일 부분 추출
    let scaleX = length(vec3<f32>(modelMatrix[0].xyz));
    let scaleY = length(vec3<f32>(modelMatrix[1].xyz));
    let scaleZ = length(vec3<f32>(modelMatrix[2].xyz));

    // 부모 모델 매트릭스의 스케일 계산 (스케일 부분만 유지)
    let scaleMatrix = mat4x4<f32>(
        vec4<f32>(scaleX, 0.0, 0.0, 0.0),
        vec4<f32>(0.0, scaleY, 0.0, 0.0),
        vec4<f32>(0.0, 0.0, scaleZ, 0.0),
        vec4<f32>(0.0, 0.0, 0.0, 1.0)
    );

    // 스케일 행렬과 이동(translation)만 유지: 부모의 회전 제거
    return mat4x4<f32>(
        scaleMatrix[0],
        scaleMatrix[1],
        scaleMatrix[2],
        modelMatrix[3] // 이동 성분은 그대로 유지
    );
}

