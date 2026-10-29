let minFocusDepth = max(systemUniforms.camera.nearClipping, 0.01);
let maxFocusDepth = min(max(systemUniforms.camera.farClipping, minFocusDepth + 1.0), 65000.0);

let manualDist = clamp(uniforms.focusDistance, minFocusDepth, maxFocusDepth);
if (uniforms.useAutoFocus == 0u) {
    textureStore(outputTexture, vec2<u32>(0u, 0u), vec4<f32>(manualDist, 1.0, manualDist, 1.0));
    return;
}

let prevState = textureLoad(prevFocusTexture, vec2<i32>(0, 0), 0);
let hasPrev = prevState.g > 0.5;
let prevFocusDist = select(manualDist, clamp(prevState.r, minFocusDepth, maxFocusDepth), hasPrev);
let prevAnchorDist = select(prevFocusDist, clamp(prevState.b, minFocusDepth, maxFocusDepth), hasPrev && (prevState.b > 0.0));

let fullDimsU = textureDimensions(depthTexture);
let fullDims = vec2<f32>(fullDimsU);
let invFullDims = 1.0 / max(fullDims, vec2<f32>(1.0));
let maxCoord = max(vec2<i32>(fullDimsU) - vec2<i32>(1), vec2<i32>(0));
let invProj = systemUniforms.projection.inverseProjectionMatrix;

// [KO] TAA 활성화 시 투영 행렬에 주입된 Halton 서브픽셀 지터 오프셋을 추출하여 깊이 버퍼 샘플링 좌표를 역보정
// [EN] Extract Halton sub-pixel jitter offset from projectionMatrix when TAA is active to compensate depth buffer sampling coordinates
let ndcJitter = systemUniforms.projection.projectionMatrix[2].xy - systemUniforms.projection.noneJitterProjectionMatrix[2].xy;
let jitterUV = vec2<f32>(-0.5 * ndcJitter.x, 0.5 * ndcJitter.y);

let aspect = fullDims.x / max(fullDims.y, 1.0);
let radiusUV = vec2<f32>(AF_ZONE_RADIUS / max(aspect, 0.01), AF_ZONE_RADIUS);

var sampleDepths: array<f32, 9>;
var sampleValid: array<bool, 9>;
var minValidDepth: f32 = maxFocusDepth;
var anyValid: bool = false;

// [KO] 9-Point Zone AF 다중 측거: TAA 지터 보정 및 2x2 서브픽셀 풋프린트 최단 깊이 추출로 Halton 지터에 의한 경계면 깊이 흔들림 원천 차단
// [EN] 9-Point Zone AF multi-point metering: apply TAA jitter compensation and 2x2 sub-pixel footprint closest-depth extraction to eliminate Halton jitter edge oscillation
for (var i = 0u; i < 9u; i = i + 1u) {
    let unjitteredUV = clamp(AF_CENTER_UV + AF_ZONE_OFFSETS[i] * radiusUV, vec2<f32>(0.0), vec2<f32>(1.0));
    let jitteredUV = clamp(unjitteredUV + jitterUV, vec2<f32>(0.0), vec2<f32>(1.0));
    let SubPixelCoord = jitteredUV * fullDims - vec2<f32>(0.5);
    let baseCoord = vec2<i32>(floor(SubPixelCoord));

    let c00 = clamp(baseCoord, vec2<i32>(0), maxCoord);
    let c10 = clamp(baseCoord + vec2<i32>(1, 0), vec2<i32>(0), maxCoord);
    let c01 = clamp(baseCoord + vec2<i32>(0, 1), vec2<i32>(0), maxCoord);
    let c11 = clamp(baseCoord + vec2<i32>(1, 1), vec2<i32>(0), maxCoord);

    let d00 = textureLoad(depthTexture, c00, 0);
    let d10 = textureLoad(depthTexture, c10, 0);
    let d01 = textureLoad(depthTexture, c01, 0);
    let d11 = textureLoad(depthTexture, c11, 0);
    let rawDepth = min(min(d00, d10), min(d01, d11));

    if (rawDepth < 0.9999) {
        let viewPos = getViewPositionFromDepth(jitteredUV, rawDepth, invProj);
        let viewDepth = clamp(-viewPos.z, minFocusDepth, maxFocusDepth);
        sampleDepths[i] = viewDepth;
        sampleValid[i] = true;
        minValidDepth = min(minValidDepth, viewDepth);
        anyValid = true;
    } else {
        sampleDepths[i] = maxFocusDepth;
        sampleValid[i] = false;
    }
}

var measuredDepth = prevAnchorDist;
if (anyValid) {
    // [KO] 전경 피사체 표면 클러스터(최단 깊이 대비 4% 두께)만 강하게 가중 평균하여 캐릭터 팔/다리 틈새로 새는 배경·바닥 깊이를 완벽 차단
    // [EN] Tightly weight only the foreground subject cluster (4% thickness of closest depth) to reject floor/background leakage through limb gaps
    let depthFalloffScale = max(minValidDepth * 0.04, minFocusDepth * 2.0);
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
        measuredDepth = clamp(weightedDepthSum / weightSum, minFocusDepth, maxFocusDepth);
    }
}

// [KO] AF-C 목표 앵커 히스테리시스(±6% Deadband): 애니메이션 캐릭터의 제자리 걸음·팔 흔들림 및 TAA 서브픽셀 지터에 의한 미세 떨림을 방지하고,
//         실질적 피사체 거리 변화 시에만 새 목표 앵커(nextAnchorDist)를 갱신
// [EN] AF-C Target Anchor Hysteresis (±6% Deadband): suppresses micro-jitter from in-place character animations and TAA sub-pixel jitter while locking onto genuine depth transitions
let anchorRelDiff = abs(measuredDepth - prevAnchorDist) / max(prevAnchorDist, 0.1);
let anchorShiftWeight = smoothstep(0.055, 0.12, anchorRelDiff);
let nextAnchorDist = select(
    measuredDepth,
    mix(prevAnchorDist, measuredDepth, anchorShiftWeight),
    hasPrev
);

// [KO] 프레임 레이트 독립적 지수 감쇠 보간(EMA) 및 f16 양자화 수렴 스냅(0.3% 이내 도달 시 고정)
// [EN] Frame-rate independent EMA damping and f16 quantization convergence snap (locks when within 0.3% of anchor)
let rawDt = systemUniforms.time.deltaTime;
let defaultFrameDt = 1.0 / 60.0;
let safeDt = select(defaultFrameDt, clamp(rawDt, 1.0 / 1000.0, 0.1), getIsFiniteScalar(rawDt) && rawDt > 0.0);
let alpha = clamp(1.0 - exp(-AF_MOTOR_SPEED * safeDt), 0.0, 1.0);
let distToAnchor = abs(nextAnchorDist - prevFocusDist);
let nextFocusDist = clamp(
    select(
        nextAnchorDist,
        mix(prevFocusDist, nextAnchorDist, alpha),
        hasPrev && (distToAnchor > prevFocusDist * 0.003)
    ),
    minFocusDepth,
    maxFocusDepth
);

textureStore(outputTexture, vec2<u32>(0u, 0u), vec4<f32>(nextFocusDist, 1.0, nextAnchorDist, 1.0));
