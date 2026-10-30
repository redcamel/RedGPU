let minFocusDepth = max(systemUniforms.camera.nearClipping, 0.01);
let maxFocusDepth = min(max(systemUniforms.camera.farClipping, minFocusDepth + 1.0), 65000.0);
let manualDist = clamp(uniforms.focusDistance, minFocusDepth, maxFocusDepth);

var hasPrev: bool = false;
var prevFocusDist: f32 = manualDist;
var prevAnchorDist: f32 = manualDist;
var prevMeasuredDist: f32 = manualDist;

if (uniforms.historyMode == 1u) {
    let prevState = textureLoad(prevFocusTexture, vec2<i32>(0, 0), 0);
    if (prevState.g > 0.5) {
        hasPrev = true;
        prevFocusDist = clamp(prevState.r, minFocusDepth, maxFocusDepth);
        prevAnchorDist = select(prevFocusDist, clamp(prevState.b, minFocusDepth, maxFocusDepth), prevState.b > 0.0);
        prevMeasuredDist = select(prevAnchorDist, clamp(prevState.a, minFocusDepth, maxFocusDepth), prevState.a > 0.0);
    }
} else if (uniforms.historyMode == 2u) {
    hasPrev = true;
}

let fullDimsU = textureDimensions(depthTexture);
let fullDims = vec2<f32>(fullDimsU);
let maxCoord = max(vec2<i32>(fullDimsU) - vec2<i32>(1), vec2<i32>(0));
let invProjZW = extractInvProjZW(systemUniforms.projection.inverseProjectionMatrix);

let aspect = fullDims.x / max(fullDims.y, 1.0);
let radiusUV = vec2<f32>(AF_ZONE_RADIUS / max(aspect, 0.01), AF_ZONE_RADIUS);

var sampleDepths: array<f32, 9>;
var sampleValid: array<bool, 9>;
var minValidDepth: f32 = maxFocusDepth;
var anyValid: bool = false;

// [KO] 9-Point Zone AF 다중 측거: 각 포인트별 5-Tap 선형 뷰 깊이의 절삭 평균(최소/최대 이상치 제거)으로 TAA 서브픽셀 경계 지터 원천 차단
// [EN] 9-Point Zone AF multi-point metering: use trimmed mean (dropping min/max outliers) of 5-Tap linear view depths per point to eliminate TAA sub-pixel edge jitter
for (var i = 0u; i < 9u; i = i + 1u) {
    let tapUV = saturate(AF_CENTER_UV + AF_ZONE_OFFSETS[i] * radiusUV);
    let centerCoord = clamp(vec2<i32>(floor(tapUV * fullDims)), vec2<i32>(0), maxCoord);

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
        let dC = min(reconstructViewDepthFromRaw(min(rC, 0.9999), invProjZW, minFocusDepth), maxFocusDepth);
        let dL = min(reconstructViewDepthFromRaw(min(rL, 0.9999), invProjZW, minFocusDepth), maxFocusDepth);
        let dR = min(reconstructViewDepthFromRaw(min(rR, 0.9999), invProjZW, minFocusDepth), maxFocusDepth);
        let dU = min(reconstructViewDepthFromRaw(min(rU, 0.9999), invProjZW, minFocusDepth), maxFocusDepth);
        let dD = min(reconstructViewDepthFromRaw(min(rD, 0.9999), invProjZW, minFocusDepth), maxFocusDepth);

        let minTapD = min(dC, min(min(dL, dR), min(dU, dD)));
        let maxTapD = max(dC, max(max(dL, dR), max(dU, dD)));
        var viewDepth = select(minTapD, (dC + dL + dR + dU + dD - minTapD - maxTapD) / 3.0, maxRaw < 0.9999);

        let prevRaw = textureLoad(prevDepthTexture, centerCoord, 0);
        if (prevRaw > 0.0 && prevRaw < 0.9999) {
            let prevD = min(reconstructViewDepthFromRaw(prevRaw, invProjZW, minFocusDepth), maxFocusDepth);
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
    // [KO] 중앙 십자(0..4번) 측거점에 유효 피사체가 존재하면 해당 최단 표면을 기준 깊이로 삼아 외곽 코너(5..8번)의 전경 스침 간섭을 방지하고,
    //      최단 표면 대비 2.5%(최소 5cm) 전면 표면 클러스터만 집중 가중 평균하여 곡면 피사체 측면이나 후방 모뉴먼트로 초점이 밀리는 현상을 원천 차단
    // [EN] Anchor reference depth to the inner cross (points 0..4) when valid to prevent outer corner (5..8) grazing interference,
    //      and tightly weight the front-most surface cluster (2.5% of depth, min 5cm) so focus locks onto the front visor/face rather than receding sides or backdrop monuments
    var innerMinDepth: f32 = maxFocusDepth;
    var hasInnerValid: bool = false;
    for (var k = 0u; k < 5u; k = k + 1u) {
        if (sampleValid[k]) {
            innerMinDepth = min(innerMinDepth, sampleDepths[k]);
            hasInnerValid = true;
        }
    }
    let referenceSurfaceDepth = select(minValidDepth, innerMinDepth, hasInnerValid);
    let depthFalloffScale = max(referenceSurfaceDepth * 0.025, 0.05);
    var weightedDepthSum: f32 = 0.0;
    var weightSum: f32 = 0.0;
    for (var i = 0u; i < 9u; i = i + 1u) {
        if (sampleValid[i]) {
            let distFromFront = abs(sampleDepths[i] - referenceSurfaceDepth);
            let proximityWeight = exp(-distFromFront / depthFalloffScale);
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

// [KO] AF-C 슈미트 트리거(Schmidt-Trigger) 앵커 갱신: 미세 지터 구간(±0.8% 이내, CoC < 0.16px)에서는 앵커를 완전 고정하고,
//      이를 초과하는 피사체 거리 변화 시에는 보간 정체(Deadband Creep Trap) 없이 실제 측정 표면 깊이(rawMeasuredDepth)로 앵커를 즉시 갱신
// [EN] AF-C Schmidt-Trigger anchor update: locks the anchor within the micro-jitter deadband (±0.8%, CoC < 0.16px),
//      and updates directly to rawMeasuredDepth without deadband creep trap whenever subject depth changes beyond 0.8%
let anchorRelDiff = abs(rawMeasuredDepth - prevAnchorDist) / max(prevAnchorDist, 0.1);
let nextAnchorDist = select(
    rawMeasuredDepth,
    select(prevAnchorDist, rawMeasuredDepth, anchorRelDiff > 0.008),
    hasPrev
);

// [KO] 광학 디옵터(Diopter = 1 / S1, 단위: m^-1) 공간에서의 프레임 레이트 독립적 지수 감쇠 보간(EMA) 및 수렴 스냅(0.15% 이내 도달 시 목표 앵커에 완전 일치)
// [EN] Frame-rate independent EMA damping in optical Diopter space (Diopter = 1 / S1, unit: m^-1) and convergence snap (snaps to exact target anchor within 0.15%)
let alpha = saturate(1.0 - exp(-AF_MOTOR_SPEED * safeDt));
let distToAnchor = abs(nextAnchorDist - prevFocusDist);
let prevDiopter = 1.0 / max(prevFocusDist, minFocusDepth);
let targetDiopter = 1.0 / max(nextAnchorDist, minFocusDepth);
let interpDiopter = mix(prevDiopter, targetDiopter, alpha);
let diopterFocusDist = 1.0 / max(interpDiopter, 1e-6);
let nextFocusDist = clamp(
    select(
        nextAnchorDist,
        diopterFocusDist,
        hasPrev && (distToAnchor > prevFocusDist * 0.0015)
    ),
    minFocusDepth,
    maxFocusDepth
);

textureStore(outputTexture, vec2<u32>(0u, 0u), vec4<f32>(nextFocusDist, 1.0, nextAnchorDist, rawMeasuredDepth));
