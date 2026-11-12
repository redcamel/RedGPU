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
    targetEV100Bias: f32,
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
    invHeight: f32,
    meteringMode: u32,
    forceReset: u32,
    isLockedRange: u32,
    pad0: u32, // 16-byte tail alignment (80B total)
    pad1: u32, // 16-byte tail alignment (80B total)
};

@group(0) @binding(0) var<storage, read_write> histogram : array<u32, 256>;
@group(0) @binding(1) var<storage, read_write> debugHistogram : array<u32, 256>;
@group(0) @binding(2) var<storage, read_write> state : EyeAdaptationState;
@group(0) @binding(3) var<uniform> uniforms : AutoExposureUniforms;

var<workgroup> countBuffer: array<u32, 256>;

const INV_256: f32 = 1.0 / 256.0;

@compute @workgroup_size(256, 1, 1)
fn main(@builtin(local_invocation_index) local_index: u32) {
    // 1. 256개 스레드가 병렬 코어레싱으로 히스토그램을 공유 메모리 및 디버그 스냅샷 버퍼에 적재 후 초기화
    let binCount = histogram[local_index];
    countBuffer[local_index] = binCount;
    debugHistogram[local_index] = binCount;
    histogram[local_index] = 0u;
    workgroupBarrier();

    // 2. 대표 스레드가 정규화 확률 밀도(PDF) 기반 백분위 적분 및 지수 눈 적응 수행
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

        // 빈 씬(유효 픽셀 0개) 방어
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

        // 히스토그램 백분위 절삭 평균 (정규화 [0, 1] CDF 적분으로 4K/8K에서도 f32 정밀도 손실 0%)
        let invTotal = 1.0 / f32(totalPixels);
        let lowP = uniforms.lowPercentile;
        let highP = uniforms.highPercentile;
        var cdf: f32 = 0.0;
        var weightedEV100Sum: f32 = 0.0;
        var validPdfSum: f32 = 0.0;

        for (var i = 0u; i < 256u; i = i + 1u) {
            let pdf = f32(countBuffer[i]) * invTotal;
            let nextCdf = cdf + pdf;
            let validSlice = max(0.0, min(nextCdf, highP) - max(cdf, lowP));
            if (validSlice > 0.0) {
                let binEV100 = uniforms.minEV100 + ((f32(i) + 0.5) * INV_256) * uniforms.ev100Range;
                weightedEV100Sum += binEV100 * validSlice;
                validPdfSum += validSlice;
            }
            cdf = nextCdf;
        }

        let sceneAvgEV100 = weightedEV100Sum / max(validPdfSum, 0.00001);
        var targetEV100 = sceneAvgEV100 - uniforms.targetEV100Bias;
        targetEV100 = max(targetEV100, uniforms.minPossibleEV100);
        targetEV100 = clamp(targetEV100, uniforms.minEV100, uniforms.maxEV100);

        // 첫 유효 프레임 및 Camera Cut(forceReset) 시 즉시 수렴, 이후 순수 지수 감쇠 적응
        var nextEV100: f32;
        if (state.initialized == 0u || uniforms.forceReset == 1u) {
            nextEV100 = targetEV100;
        } else {
            let prevEV100 = state.adaptedEV100;
            let diff = targetEV100 - prevEV100;
            let speed = select(uniforms.adjustmentSpeedDown, uniforms.adjustmentSpeedUp, diff > 0.0);
            let dt = clamp(uniforms.deltaTime, 0.0, 0.1);
            let adaptationFactor = 1.0 - exp(-speed * dt);
            nextEV100 = prevEV100 + diff * adaptationFactor;
        }

        nextEV100 = clamp(nextEV100, uniforms.minEV100, uniforms.maxEV100);

        // exposureCompensation은 최종 유효 EV100 산출 시 단 1회만 적용
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
