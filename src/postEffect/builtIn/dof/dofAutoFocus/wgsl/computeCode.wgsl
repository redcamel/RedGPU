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
        let viewDepth = select(minTapD, (dC + dL + dR + dU + dD - minTapD - maxTapD) / 3.0, maxRaw < 0.9999);

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
    // [KO] 광학 디옵터(Diopter = 1 / S, 단위: m^-1) 공간에서의 9-Point Zone 가중 클러스터 합의(Consensus):
    //      단일 최단점(1-Point Min)에 의존하지 않고 9개 측거점 중 가장 높은 공간·광학 밀도를 가진 주 피사체 표면 클러스터를 선별하여
    //      외곽 전경 스침(Grazing Outlier)과 후방 배경 누수를 동시에 배제
    // [EN] 9-Point Zone weighted cluster consensus in optical Diopter space (Diopter = 1 / S, unit: m^-1):
    //      Selects the dominant subject surface cluster with highest spatial/optical density rather than a single minimum point,
    //      rejecting both grazing foreground outliers and background leakage
    var bestClusterScore: f32 = -1.0;
    var bestClusterDiopter: f32 = 1.0 / max(minValidDepth, minFocusDepth);

    for (var i = 0u; i < 9u; i = i + 1u) {
        if (sampleValid[i]) {
            let candidateDiopter = 1.0 / max(sampleDepths[i], minFocusDepth);
            let clusterBandwidth = max(candidateDiopter * 0.08, 0.02);
            var affinitySum: f32 = 0.0;
            for (var j = 0u; j < 9u; j = j + 1u) {
                if (sampleValid[j]) {
                    let neighborDiopter = 1.0 / max(sampleDepths[j], minFocusDepth);
                    let normDiff = (neighborDiopter - candidateDiopter) / clusterBandwidth;
                    affinitySum += AF_ZONE_WEIGHTS[j] * exp(-0.5 * normDiff * normDiff);
                }
            }
            // [KO] 동등한 면적의 클러스터 간에는 카메라에 더 가까운(디옵터가 큰) 주 피사체 표면을 우선 선택
            // [EN] Among clusters of comparable area, prioritize the closer subject surface (higher diopter)
            let foregroundPreference = pow(candidateDiopter / max(1.0 / max(minValidDepth, minFocusDepth), 1e-5), 0.35);
            let score = affinitySum * foregroundPreference;
            if (score > bestClusterScore) {
                bestClusterScore = score;
                bestClusterDiopter = candidateDiopter;
            }
        }
    }

    let refineBandwidth = max(bestClusterDiopter * 0.06, 0.015);
    var weightedDiopterSum: f32 = 0.0;
    var weightSum: f32 = 0.0;
    for (var i = 0u; i < 9u; i = i + 1u) {
        if (sampleValid[i]) {
            let sampleDiopter = 1.0 / max(sampleDepths[i], minFocusDepth);
            let normDiff = (sampleDiopter - bestClusterDiopter) / refineBandwidth;
            let w = AF_ZONE_WEIGHTS[i] * exp(-0.5 * normDiff * normDiff);
            weightedDiopterSum += sampleDiopter * w;
            weightSum += w;
        }
    }
    if (weightSum > 1e-5) {
        let consensusDiopter = weightedDiopterSum / weightSum;
        rawMeasuredDepth = clamp(1.0 / max(consensusDiopter, 1e-6), minFocusDepth, maxFocusDepth);
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
