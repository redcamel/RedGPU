fn calculateMotionVector(
    currentClipPos: vec4<f32>, // 지터가 없는 현재 프레임 Clip Space
    prevClipPos: vec4<f32>,     // 지터가 없는 이전 프레임 Clip Space
    resolution: vec2<f32>
) -> vec2<f32> {
    // 1. Perspective Divide
    // 0으로 나누기 방지를 위해 아주 작은 값을 더하거나 max를 사용합니다.
    let currentNDC = currentClipPos.xy / max(currentClipPos.w, 0.00001);
    let prevNDC = prevClipPos.xy / max(prevClipPos.w, 0.00001);

    // 2. NDC (-1 ~ 1)를 UV (0 ~ 1) 좌표계로 변환
    // WebGPU/Vulkan의 NDC Y는 위가 +1, UV Y는 아래가 +1이므로
    // y축에 -0.5를 곱해 반전과 스케일을 동시에 처리합니다.
    let currentUV = currentNDC * vec2<f32>(0.5, -0.5) + 0.5;
    let prevUV = prevNDC * vec2<f32>(0.5, -0.5) + 0.5;

    // 3. 모션 벡터 계산 (현재 UV - 이전 UV)
    // 결과값은 "현재 픽셀 위치에서 이전 위치를 찾기 위해 더해야 할 값"이 됩니다.
    // TAA 본문에서 historyUV = unjitteredUV - motionVector 로 사용하게 됩니다.
    return currentUV - prevUV;
}
