struct EyeAdaptationState {
    adaptedEV100: f32,
    effectiveEV100: f32,
    preExposure: f32,
    preExposureRatio: f32,
    sceneAvgEV100: f32,
    targetEV100: f32,
    initialized: u32,
    maxBinCount: u32,
};

struct AutoExposureUniforms {
    deltaTime: f32,
    calibrationOffset: f32,
    exposureCompensation: f32,
    minPossibleEV100: f32,
    minEV100: f32,
    maxEV100: f32,
    ev100Range: f32,
    invEv100Range: f32,
    lowPercentile: f32,
    highPercentile: f32,
    adjustmentSpeedUp: f32,
    adjustmentSpeedDown: f32,
    width: f32,
    height: f32,
    invWidth: f32,
    invHeight: f32,
    spotRadiusSqInv: f32,
    skyMeteringWeight: f32,
    maxHistogramLuminance: f32,
    lowKeyBias: f32,
    lowKeyEV100: f32,
    highKeyBias: f32,
    highKeyEV100: f32,
    highlightProtection: f32,
    meteringMode: u32,
    forceReset: u32,
    isLockedRange: u32,
    pad0: u32, // 16-byte tail alignment (112B total)
};

@group(0) @binding(0) var<storage, read_write> histogram : array<u32, 256>;
@group(0) @binding(1) var<storage, read_write> debugHistogram : array<u32, 256>;
@group(0) @binding(2) var<storage, read_write> state : EyeAdaptationState;
@group(0) @binding(3) var<uniform> uniforms : AutoExposureUniforms;

var<workgroup> countBuffer: array<u32, 256>;

const INV_256: f32 = 1.0 / 256.0;
const SLEW_KNEE_EV: f32 = 1.5;
const HIGHLIGHT_LOW_PERCENTILE: f32 = 0.85;
const HIGHLIGHT_HIGH_PERCENTILE: f32 = 0.98;
const HIGHLIGHT_HEADROOM_EV: f32 = 1.45;

@compute @workgroup_size(256, 1, 1)
fn main(@builtin(local_invocation_index) local_index: u32) {
    // 1. 256개 스레드가 병렬 코어레싱으로 히스토그램을 공유 메모리 및 디버그 스냅샷 버퍼에 적재 후 초기화
    let binCount = histogram[local_index];
    countBuffer[local_index] = binCount;
    debugHistogram[local_index] = binCount;
    histogram[local_index] = 0u;
    workgroupBarrier();

    // 2. 대표 스레드가 정규화 확률 밀도(PDF) 기반 백분위 적분 및 2-Stage 명암순응 수행
    if (local_index == 0u) {
        var totalPixels: u32 = 0u;
        var maxBin: u32 = 0u;
        for (var i = 0u; i < 256u; i = i + 1u) {
            let c = countBuffer[i];
            totalPixels += c;
            maxBin = max(maxBin, c);
        }
        state.maxBinCount = maxBin;

        let prevPreExposure = max(state.preExposure, 0.0000001);

        // minEV100 == maxEV100 노출 잠금(Lock) 모드 처리 (0 나눗셈 및 NaN 원천 차단)
        if (uniforms.isLockedRange == 1u) {
            let lockedEV100 = uniforms.minEV100;
            let effectiveEV100 = lockedEV100 - uniforms.exposureCompensation;
            let nextPreExposure = 1.0 / (1.2 * exp2(effectiveEV100));
            state.adaptedEV100 = lockedEV100;
            state.effectiveEV100 = effectiveEV100;
            state.preExposure = nextPreExposure;
            state.preExposureRatio = clamp(nextPreExposure / prevPreExposure, 0.0625, 16.0);
            state.sceneAvgEV100 = lockedEV100;
            state.targetEV100 = lockedEV100;
            state.initialized = 1u;
            return;
        }

        // 빈 씬(유효 픽셀 0개) 방어: 노출 보정(exposureCompensation) 변경만 즉시 반영하고 비율은 1.0 유지
        if (totalPixels == 0u) {
            if (uniforms.forceReset == 1u) {
                state.initialized = 0u;
            }
            let currentEV100 = clamp(state.adaptedEV100, uniforms.minEV100, uniforms.maxEV100);
            let effectiveEV100 = currentEV100 - uniforms.exposureCompensation;
            let nextPreExposure = 1.0 / (1.2 * exp2(effectiveEV100));
            state.adaptedEV100 = currentEV100;
            state.effectiveEV100 = effectiveEV100;
            state.preExposure = nextPreExposure;
            state.preExposureRatio = clamp(nextPreExposure / prevPreExposure, 0.0625, 16.0);
            return;
        }

        let invTotal = 1.0 / f32(totalPixels);
        var sceneAvgEV100: f32 = 0.0;

        if (uniforms.meteringMode == 3u) {
            // BASIC 고속 모드: 백분위 절삭 없는 가중 로그 휘도 평균
            for (var i = 0u; i < 256u; i = i + 1u) {
                let pdf = f32(countBuffer[i]) * invTotal;
                let binEV100 = uniforms.minEV100 + ((f32(i) + 0.5) * INV_256) * uniforms.ev100Range;
                sceneAvgEV100 += binEV100 * pdf;
            }
        } else {
            // 히스토그램 백분위 절삭 평균 + 상위 백분위 하이라이트 헤드룸 이중 앵커 적분
            let lowP = uniforms.lowPercentile;
            let highP = uniforms.highPercentile;
            var cdf: f32 = 0.0;
            var weightedEV100Sum: f32 = 0.0;
            var validPdfSum: f32 = 0.0;
            var highlightEV100Sum: f32 = 0.0;
            var highlightPdfSum: f32 = 0.0;

            for (var i = 0u; i < 256u; i = i + 1u) {
                let pdf = f32(countBuffer[i]) * invTotal;
                let nextCdf = cdf + pdf;
                let binEV100 = uniforms.minEV100 + ((f32(i) + 0.5) * INV_256) * uniforms.ev100Range;

                let validSlice = max(0.0, min(nextCdf, highP) - max(cdf, lowP));
                if (validSlice > 0.0) {
                    weightedEV100Sum += binEV100 * validSlice;
                    validPdfSum += validSlice;
                }

                let highlightSlice = max(0.0, min(nextCdf, HIGHLIGHT_HIGH_PERCENTILE) - max(cdf, HIGHLIGHT_LOW_PERCENTILE));
                if (highlightSlice > 0.0) {
                    highlightEV100Sum += binEV100 * highlightSlice;
                    highlightPdfSum += highlightSlice;
                }

                cdf = nextCdf;
            }

            let midAvgEV100 = weightedEV100Sum / max(validPdfSum, 0.00001);
            let highlightAvgEV100 = highlightEV100Sum / max(highlightPdfSum, 0.00001);
            let highlightFloorEV100 = highlightAvgEV100 - HIGHLIGHT_HEADROOM_EV;
            let protectedEV100 = max(midAvgEV100, highlightFloorEV100);
            sceneAvgEV100 = mix(midAvgEV100, protectedEV100, uniforms.highlightProtection);
        }

        // 3-Zone Dynamic EV100 Bias Curve (야간 Low-Key 암부 깊이 및 주간 High-Key 하이라이트 보존)
        let midEV = 0.5 * (uniforms.lowKeyEV100 + uniforms.highKeyEV100);
        let lowEdge1 = max(min(uniforms.lowKeyEV100 + 3.0, midEV), uniforms.lowKeyEV100 + 0.01);
        let highEdge0 = min(max(uniforms.highKeyEV100 - 3.0, midEV), uniforms.highKeyEV100 - 0.01);
        let lowWeight = 1.0 - smoothstep(uniforms.lowKeyEV100, lowEdge1, sceneAvgEV100);
        let highWeight = smoothstep(highEdge0, uniforms.highKeyEV100, sceneAvgEV100);
        let dynamicCurveBias = uniforms.lowKeyBias * lowWeight + uniforms.highKeyBias * highWeight;

        var targetEV100 = max(sceneAvgEV100 - dynamicCurveBias, uniforms.minPossibleEV100);
        targetEV100 = clamp(targetEV100, uniforms.minEV100, uniforms.maxEV100);

        // 첫 유효 프레임 및 Camera Cut(forceReset) 시 0ms 즉시 수렴, 이후 C1 연속 2-Stage 적응
        var nextEV100: f32;
        if (state.initialized == 0u || uniforms.forceReset == 1u) {
            nextEV100 = targetEV100;
        } else {
            let prevEV100 = state.adaptedEV100;
            let diff = targetEV100 - prevEV100;
            let absDiff = abs(diff);
            let speed = select(uniforms.adjustmentSpeedDown, uniforms.adjustmentSpeedUp, diff > 0.0);
            let dt = clamp(uniforms.deltaTime, 0.0, 0.1);

            var stepEV: f32;
            if (absDiff > SLEW_KNEE_EV) {
                stepEV = min(speed * SLEW_KNEE_EV * dt, absDiff);
            } else {
                stepEV = absDiff * (1.0 - exp(-speed * dt));
            }
            nextEV100 = prevEV100 + sign(diff) * stepEV;
        }

        nextEV100 = clamp(nextEV100, uniforms.minEV100, uniforms.maxEV100);

        // exposureCompensation은 최종 유효 EV100 산출 시 단 1회만 적용 (이중 증폭 버그 완전 제거)
        let effectiveEV100 = nextEV100 - uniforms.exposureCompensation;
        let nextPreExposure = 1.0 / (1.2 * exp2(effectiveEV100));
        let nextRatio = clamp(nextPreExposure / prevPreExposure, 0.0625, 16.0);

        state.adaptedEV100 = nextEV100;
        state.effectiveEV100 = effectiveEV100;
        state.preExposure = nextPreExposure;
        state.preExposureRatio = nextRatio;
        state.sceneAvgEV100 = sceneAvgEV100;
        state.targetEV100 = targetEV100;
        state.initialized = 1u;
    }
}
