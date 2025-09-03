fn calculateMotionVector(
    currentClipPos: vec4<f32>,
    prevClipPos: vec4<f32>,
    resolution: vec2<f32>
) -> vec2<f32> {
    let currentW = max(currentClipPos.w, 0.000001);
    let prevW = max(prevClipPos.w, 0.000001);

    let currentNDC = currentClipPos.xy / currentW;
    let prevNDC = prevClipPos.xy / prevW;

    let motionVectorNDC = currentNDC - prevNDC;
    let screenMotionVector = motionVectorNDC * resolution * 0.5;

    let maxMotionPixels = 64.0;
    let motionMagnitude = length(screenMotionVector);
    let clampedMotionVector = screenMotionVector * min(1.0, maxMotionPixels / max(motionMagnitude, 0.000001));

    return clampedMotionVector / maxMotionPixels;
}
