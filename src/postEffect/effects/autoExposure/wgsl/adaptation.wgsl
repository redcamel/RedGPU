struct AutoExposureUniforms {
    deltaTime: f32,
    targetLuminance: f32,
    adjustmentSpeedUp: f32,
    adjustmentSpeedDown: f32,
    exposureCompensation: f32,
    minEV100: f32,
    maxEV100: f32,
    calibrationConstant: f32,
    ev100Range: f32,
    lowPercentile: f32,
    highPercentile: f32,
    invEv100Range: f32,
    width: f32,
    height: f32,
    currentPreExposure: f32,
    _pad: f32
};

@group(0) @binding(0) var<storage, read_write> histogram : array<atomic<u32>, 64>;
@group(0) @binding(1) var<storage, read_write> adaptedEV100 : f32;
@group(0) @binding(2) var<uniform> uniforms : AutoExposureUniforms;

@compute @workgroup_size(1, 1, 1)
fn main() {
    var countBuffer: array<u32, 64>;
    var totalPixels: u32 = 0u;

    // [KO] 히스토그램 데이터 읽기 및 초기화 [EN] Read and clear histogram data
    for (var i = 0u; i < 64u; i = i + 1u) {
        let val = atomicExchange(&histogram[i], 0u);
        countBuffer[i] = val;
        totalPixels += val;
    }

    if (totalPixels == 0u) { return; }

    // [KO] 퍼센타일 기반 필터링 [EN] Percentile-based filtering
    let minPixel = u32(f32(totalPixels) * uniforms.lowPercentile);
    let maxPixel = u32(f32(totalPixels) * uniforms.highPercentile);

    var pixelCounter: u32 = 0u;
    var weightedEV100Sum: f32 = 0.0;
    var weightedPixelCount: f32 = 0.0;

    for (var i = 0u; i < 64u; i = i + 1u) {
        let nextCounter = pixelCounter + countBuffer[i];
        
        // [KO] 유효 범위(low ~ high percentile) 내의 픽셀들만 선별
        // [EN] Filter pixels within the valid percentile range
        let validPixels = max(0.0, f32(min(nextCounter, maxPixel)) - f32(max(pixelCounter, minPixel)));
        if (validPixels > 0.0) {
            let ev100 = uniforms.minEV100 + (f32(i) / 63.0) * uniforms.ev100Range;
            weightedEV100Sum += ev100 * validPixels;
            weightedPixelCount += validPixels;
        }
        pixelCounter = nextCounter;
    }

    // [KO] 평균 EV100 산출 [EN] Calculate average EV100
    let avgEV100 = weightedEV100Sum / max(weightedPixelCount, 1.0);

    // [KO] 목표 휘도 및 사용자의 노출 보정(Compensation)을 반영한 목표 EV100 결정
    // [EN] Determine target EV100 reflecting target luminance and user's exposure compensation
    // [KO] exposureCompensation을 차감함으로써 사용자가 밝기를 높이면 목표 EV가 낮아져(노출 증가) 의도가 유지됨
    let targetEV100 = avgEV100 - log2(uniforms.targetLuminance / 0.18) - uniforms.exposureCompensation;

    // [KO] 눈 적응 시뮬레이션 (EV100 공간에서 수행)
    // [EN] Eye adaptation simulation (performed in EV100 space)
    let prevEV100 = adaptedEV100;
    let diff = targetEV100 - prevEV100;
    
    // [KO] 밝아질 때와 어두워질 때의 속도 차이 적용
    // [EN] Apply different speeds for brightening and darkening
    let speed = select(uniforms.adjustmentSpeedDown, uniforms.adjustmentSpeedUp, diff > 0.0);
    
    // [KO] 지수 감쇄 공식 (언리얼 방식) [EN] Exponential decay formula (Unreal style)
    let adaptationFactor = 1.0 - exp(-speed * uniforms.deltaTime);
    var nextEV100 = prevEV100 + diff * adaptationFactor;
    
    // [KO] EV100 범위 제한 [EN] Limit EV100 range
    adaptedEV100 = clamp(nextEV100, uniforms.minEV100, uniforms.maxEV100);
}
