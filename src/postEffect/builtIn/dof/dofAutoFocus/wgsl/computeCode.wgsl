let minFocusDepth = max(systemUniforms.camera.nearClipping, 0.01);
let maxFocusDepth = min(max(systemUniforms.camera.farClipping, minFocusDepth + 1.0), 65000.0);

let manualDist = clamp(uniforms.focusDistance, minFocusDepth, maxFocusDepth);
if (uniforms.useAutoFocus == 0u) {
    textureStore(outputTexture, vec2<u32>(0u, 0u), vec4<f32>(manualDist, 1.0, manualDist, manualDist));
    return;
}

let prevState = textureLoad(prevFocusTexture, vec2<i32>(0, 0), 0);
let hasPrev = prevState.g > 0.5;
let prevFocusDist = select(manualDist, clamp(prevState.r, minFocusDepth, maxFocusDepth), hasPrev);
let prevAnchorDist = select(prevFocusDist, clamp(prevState.b, minFocusDepth, maxFocusDepth), hasPrev && (prevState.b > 0.0));
let prevMeasuredDist = select(prevAnchorDist, clamp(prevState.a, minFocusDepth, maxFocusDepth), hasPrev && (prevState.a > 0.0));

let fullDimsU = textureDimensions(depthTexture);
let fullDims = vec2<f32>(fullDimsU);
let invFullDims = 1.0 / max(fullDims, vec2<f32>(1.0));
let maxCoord = max(vec2<i32>(fullDimsU) - vec2<i32>(1), vec2<i32>(0));
let invProj = systemUniforms.projection.inverseProjectionMatrix;

let aspect = fullDims.x / max(fullDims.y, 1.0);
let radiusUV = vec2<f32>(AF_ZONE_RADIUS / max(aspect, 0.01), AF_ZONE_RADIUS);

var sampleDepths: array<f32, 9>;
var sampleValid: array<bool, 9>;
var minValidDepth: f32 = maxFocusDepth;
var anyValid: bool = false;

// [KO] 9-Point Zone AF 다중 측거: 각 포인트별 5-Tap 선형 뷰 깊이의 절삭 평균(최소/최대 이상치 제거)으로 TAA 서브픽셀 경계 지터 원천 차단
// [EN] 9-Point Zone AF multi-point metering: use trimmed mean (dropping min/max outliers) of 5-Tap linear view depths per point to eliminate TAA sub-pixel edge jitter
for (var i = 0u; i < 9u; i = i + 1u) {
    let tapUV = clamp(AF_CENTER_UV + AF_ZONE_OFFSETS[i] * radiusUV, vec2<f32>(0.0), vec2<f32>(1.0));
    let centerCoord = clamp(vec2<i32>(floor(tapUV * fullDims)), vec2<i32>(0), maxCoord);
    let exactUV = (vec2<f32>(centerCoord) + 0.5) * invFullDims;

    let cL = clamp(centerCoord + vec2<i32>(-1, 0), vec2<i32>(0), maxCoord);
    let cR = clamp(centerCoord + vec2<i32>(1, 0), vec2<i32>(0), maxCoord);
    let cU = clamp(centerCoord + vec2<i32>(0, -1), vec2<i32>(0), maxCoord);
    let cD = clamp(centerCoord + vec2<i32>(0, 1), vec2<i32>(0), maxCoord);

    let rC = textureLoad(depthTexture, centerCoord, 0);
    let rL = textureLoad(depthTexture, cL, 0);
    let rR = textureLoad(depthTexture, cR, 0);
    let rU = textureLoad(depthTexture, cU, 0);
    let rD = textureLoad(depthTexture, cD, 0);

    let maxRaw = max(rC, max(max(rL, rR), max(rU, rD)));
    let minRaw = min(rC, min(min(rL, rR), min(rU, rD)));

    if (minRaw < 0.9999) {
        let dC = clamp(-getViewPositionFromDepth(exactUV, min(rC, 0.9999), invProj).z, minFocusDepth, maxFocusDepth);
        let dL = clamp(-getViewPositionFromDepth(exactUV, min(rL, 0.9999), invProj).z, minFocusDepth, maxFocusDepth);
        let dR = clamp(-getViewPositionFromDepth(exactUV, min(rR, 0.9999), invProj).z, minFocusDepth, maxFocusDepth);
        let dU = clamp(-getViewPositionFromDepth(exactUV, min(rU, 0.9999), invProj).z, minFocusDepth, maxFocusDepth);
        let dD = clamp(-getViewPositionFromDepth(exactUV, min(rD, 0.9999), invProj).z, minFocusDepth, maxFocusDepth);

        let minTapD = min(dC, min(min(dL, dR), min(dU, dD)));
        let maxTapD = max(dC, max(max(dL, dR), max(dU, dD)));
        var viewDepth = select(minTapD, (dC + dL + dR + dU + dD - minTapD - maxTapD) / 3.0, maxRaw < 0.9999);

        let prevRaw = textureLoad(prevDepthTexture, centerCoord, 0);
        if (prevRaw > 0.0 && prevRaw < 0.9999) {
            let prevD = clamp(-getViewPositionFromDepth(exactUV, prevRaw, invProj).z, minFocusDepth, maxFocusDepth);
            if (abs(viewDepth - prevD) < viewDepth * 0.05) {
                viewDepth = (viewDepth + prevD) * 0.5;
            }
        }

        sampleDepths[i] = viewDepth;
        sampleValid[i] = true;
        minValidDepth = min(minValidDepth, viewDepth);
        anyValid = true;
    } else {
        sampleDepths[i] = maxFocusDepth;
        sampleValid[i] = false;
    }
}

var rawMeasuredDepth = prevMeasuredDist;
if (anyValid) {
    // [KO] 전경 피사체 클러스터(최단 깊이 대비 15% 두께)를 통합 가중 평균하여 캐릭터 팔/다리 움직임에 의한 깊이 출렁임과 배경 누수를 동시에 차단
    // [EN] Weight the foreground subject cluster (15% thickness of closest depth) to prevent both limb-swing depth hunting and background leakage
    let depthFalloffScale = max(minValidDepth * 0.15, 0.6);
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
        rawMeasuredDepth = clamp(weightedDepthSum / weightSum, minFocusDepth, maxFocusDepth);
    }
}

let rawDt = systemUniforms.time.deltaTime;
let defaultFrameDt = 1.0 / 60.0;
let safeDt = select(defaultFrameDt, clamp(rawDt, 1.0 / 1000.0, 0.1), getIsFiniteScalar(rawDt) && rawDt > 0.0);

let measureAlpha = clamp(1.0 - exp(-12.0 * safeDt), 0.0, 1.0);
let measuredDepth = select(rawMeasuredDepth, mix(prevMeasuredDist, rawMeasuredDepth, measureAlpha), hasPrev);

// [KO] AF-C 목표 앵커 히스테리시스(±12% Deadband): 피사체 애니메이션 및 TAA 지터 구간에서는 목표 앵커를 완전 고정(0.0)하고, 실질적 피사체 전환 시에만 갱신
// [EN] AF-C Target Anchor Hysteresis (±12% Deadband): completely locks the target anchor (0.0) during subject animation and TAA jitter, updating only on genuine subject transitions
let anchorRelDiff = abs(measuredDepth - prevAnchorDist) / max(prevAnchorDist, 0.1);
let anchorShiftWeight = smoothstep(0.12, 0.25, anchorRelDiff);
let nextAnchorDist = select(
    measuredDepth,
    mix(prevAnchorDist, measuredDepth, anchorShiftWeight),
    hasPrev
);

// [KO] 프레임 레이트 독립적 지수 감쇠 보간(EMA) 및 수렴 스냅(0.8% 이내 도달 시 목표 앵커에 완전 고정)
// [EN] Frame-rate independent EMA damping and convergence snap (locks onto target anchor when within 0.8%)
let alpha = clamp(1.0 - exp(-AF_MOTOR_SPEED * safeDt), 0.0, 1.0);
let distToAnchor = abs(nextAnchorDist - prevFocusDist);
let nextFocusDist = clamp(
    select(
        nextAnchorDist,
        mix(prevFocusDist, nextAnchorDist, alpha),
        hasPrev && (distToAnchor > prevFocusDist * 0.008)
    ),
    minFocusDepth,
    maxFocusDepth
);

textureStore(outputTexture, vec2<u32>(0u, 0u), vec4<f32>(nextFocusDist, 1.0, nextAnchorDist, measuredDepth));
