#redgpu_include math.EPSILON

/**
 * [KO] 현재 프레임과 이전 프레임의 클립 공간 좌표를 비교하여 모션 벡터(UV 단위)를 계산합니다.
 * [EN] Calculates the motion vector (in UV units) by comparing current and previous clip space coordinates.
 *
 * @param currentClipPos -
 * [KO] 현재 프레임의 Clip Space 위치
 * [EN] Current frame's clip space position
 * @param prevClipPos -
 * [KO] 이전 프레임의 Clip Space 위치
 * [EN] Previous frame's clip space position
 * @returns
 * [KO] UV 공간 상의 모션 벡터 (vec2)
 * [EN] Motion vector in UV space (vec2)
 */
fn getMotionVector(
    currentClipPos: vec4<f32>,
    prevClipPos: vec4<f32>,
) -> vec2<f32> {
    // 1. Perspective Divide (NDC로 변환)
    // 0으로 나누기 방지를 위해 매우 작은 값(epsilon) 사용
    let currentNDC = currentClipPos.xy / max(currentClipPos.w, EPSILON);
    let prevNDC = prevClipPos.xy / max(prevClipPos.w, EPSILON);

    // 2. 모션 벡터 계산 (NDC 공간: -1 ~ 1 범위)
    // 현재 위치에서 이전 위치를 뺍니다.
    var motionVector = currentNDC - prevNDC;

    // 3. Y축 반전 보정 (중요)
    // WebGPU NDC의 Y축은 위가 +, 아래가 -이지만,
    // UV 좌표계(0~1)는 위가 0, 아래가 1이므로 방향을 맞춰줘야 합니다.
    motionVector.y = -motionVector.y;

    // 4. NDC(-2 ~ 2 범위의 차이)를 UV 단위(0 ~ 1 범위의 차이)로 변환
    // NDC 전체 너비가 2이므로 0.5를 곱해줍니다.
    let uvMotionVector = motionVector * 0.5;

    return uvMotionVector;
}
