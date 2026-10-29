let manualDist = clamp(uniforms.focusDistance, 0.1, 10000.0);
if (uniforms.useAutoFocus == 0u) {
    textureStore(outputTexture, vec2<u32>(0u, 0u), vec4<f32>(manualDist, 1.0, manualDist, 1.0));
    return;
}

let prevState = textureLoad(prevFocusTexture, vec2<i32>(0, 0), 0);
let hasPrev = prevState.g > 0.5;
let prevFocusDist = select(manualDist, clamp(prevState.r, 0.1, 10000.0), hasPrev);

let fullDimsU = textureDimensions(depthTexture);
let fullDims = vec2<f32>(fullDimsU);
let invFullDims = 1.0 / max(fullDims, vec2<f32>(1.0));
let maxCoord = max(vec2<i32>(fullDimsU) - vec2<i32>(1), vec2<i32>(0));
let invProj = systemUniforms.projection.inverseProjectionMatrix;

let aspect = fullDims.x / max(fullDims.y, 1.0);
let radiusUV = vec2<f32>(AF_ZONE_RADIUS / max(aspect, 0.01), AF_ZONE_RADIUS);

var sampleDepths: array<f32, 9>;
var sampleValid: array<bool, 9>;
var minValidDepth: f32 = 1e9;
var anyValid: bool = false;

// [KO] 9-Point Zone AF 다중 측거: 스카이박스(rawDepth >= 0.9999)를 배제하고 유효 기하 표면 깊이를 복원
// [EN] 9-Point Zone AF multi-point metering: exclude skybox (rawDepth >= 0.9999) and reconstruct valid surface view depths
for (var i = 0u; i < 9u; i = i + 1u) {
    let tapUV = clamp(AF_CENTER_UV + AF_ZONE_OFFSETS[i] * radiusUV, vec2<f32>(0.0), vec2<f32>(1.0));
    let tapCoord = clamp(vec2<i32>(floor(tapUV * fullDims)), vec2<i32>(0), maxCoord);
    let rawDepth = textureLoad(depthTexture, tapCoord, 0);
    if (rawDepth < 0.9999) {
        let exactUV = (vec2<f32>(tapCoord) + 0.5) * invFullDims;
        let viewPos = getViewPositionFromDepth(exactUV, rawDepth, invProj);
        let viewDepth = clamp(-viewPos.z, 0.1, 10000.0);
        sampleDepths[i] = viewDepth;
        sampleValid[i] = true;
        minValidDepth = min(minValidDepth, viewDepth);
        anyValid = true;
    } else {
        sampleDepths[i] = 10000.0;
        sampleValid[i] = false;
    }
}

var targetFocusDist = prevFocusDist;
if (anyValid) {
    // [KO] 최단 거리 피사체 우선 가중 평균(Closest Subject Priority): 팔/다리 틈새로 먼 배경이 섞여도 전면 피사체에 안정적으로 초점 고정
    // [EN] Closest Subject Priority weighted average: keep focus locked on the foreground subject even when distant background is partially visible through gaps
    let depthFalloffScale = max(minValidDepth * 0.25, 0.5);
    var weightedDepthSum: f32 = 0.0;
    var weightSum: f32 = 0.0;
    for (var i = 0u; i < 9u; i = i + 1u) {
        if (sampleValid[i]) {
            let distFromClosest = max(0.0, sampleDepths[i] - minValidDepth);
            let proximityWeight = exp(-distFromClosest / depthFalloffScale);
            let w = AF_ZONE_WEIGHTS[i] * proximityWeight;
            weightedDepthSum += sampleDepths[i] * w;
            weightSum += w;
        }
    }
    if (weightSum > 1e-5) {
        targetFocusDist = clamp(weightedDepthSum / weightSum, 0.1, 10000.0);
    }
}

// [KO] 프레임 레이트 독립적 지수 감쇠 보간(Exponential Moving Average)으로 실제 렌즈 모터 Rack Focus 구현
// [EN] Frame-rate independent Exponential Moving Average damping for smooth physical lens motor Rack Focus
let safeDt = clamp(uniforms.deltaTime, 0.0005, 0.1);
let alpha = clamp(1.0 - exp(-AF_MOTOR_SPEED * safeDt), 0.0, 1.0);
let nextFocusDist = clamp(select(targetFocusDist, mix(prevFocusDist, targetFocusDist, alpha), hasPrev), 0.1, 10000.0);

textureStore(outputTexture, vec2<u32>(0u, 0u), vec4<f32>(nextFocusDist, 1.0, targetFocusDist, 1.0));
