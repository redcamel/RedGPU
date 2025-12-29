fn calculateMotionVector(
    currentClipPos: vec4<f32>,
    prevClipPos: vec4<f32>,
    resolution: vec2<f32>
) -> vec2<f32> {
    // W값의 최소치를 높여 perspective divide 안정성 확보
    let safeCurrentW = select(currentClipPos.w, 1.0, currentClipPos.w == 0.0);
    let safePrevW = select(prevClipPos.w, 1.0, prevClipPos.w == 0.0);

    let currentNDC = currentClipPos.xy / safeCurrentW;
    let prevNDC = prevClipPos.xy / safePrevW;

    var motionVector = currentNDC - prevNDC;

    // WebGPU 기준 Y축 반전 확인
    // 바닥면 삼각형이 깨진다면 이 반전 로직이 일관되지 않을 수 있습니다.
    motionVector.y = -motionVector.y;

    return motionVector * 0.5;
}
