fn calculateMotionVector(
    currentClipPos: vec4<f32>,
    prevClipPos: vec4<f32>,
    resolution: vec2<f32>
) -> vec2<f32> {
    let currentNDC = currentClipPos.xy / max(currentClipPos.w, 1e-5);
    let prevNDC = prevClipPos.xy / max(prevClipPos.w, 1e-5);

    // [오른손 좌표계 수정]
    // NDC Y=1(상단) -> UV Y=0 / NDC Y=-1(하단) -> UV Y=1 가 되어야 함
    // 따라서 Y축에 -0.5를 곱해 뒤집어줍니다.
    let currentUV = currentNDC * vec2<f32>(0.5, -0.5) + 0.5;
    let prevUV = prevNDC * vec2<f32>(0.5, -0.5) + 0.5;

    return currentUV - prevUV;
}
