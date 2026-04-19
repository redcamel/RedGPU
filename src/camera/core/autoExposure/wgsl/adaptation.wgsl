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
    maxExposureMultiplier: f32,
    meteringMode: f32
};

@group(0) @binding(0) var<storage, read_write> histogram : array<atomic<u32>, 256>;
@group(0) @binding(1) var<storage, read_write> adaptedEV100 : f32;
@group(0) @binding(2) var<uniform> uniforms : AutoExposureUniforms;

@compute @workgroup_size(1, 1, 1)
fn main() {
    var countBuffer: array<u32, 256>;
    var totalPixels: u32 = 0u;

    // [KO] 히스토그램 데이터 읽기 및 초기화 [EN] Read and clear histogram data
    for (var i = 0u; i < 256u; i = i + 1u) {
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
    var totalValidPixels: f32 = 0.0;

    for (var i = 0u; i < 256u; i = i + 1u) {
        let nextCounter = pixelCounter + countBuffer[i];
        
        let validPixels = max(0.0, f32(min(nextCounter, maxPixel)) - f32(max(pixelCounter, minPixel)));
        if (validPixels > 0.0) {
            let ev100 = uniforms.minEV100 + (f32(i) / 255.0) * uniforms.ev100Range;
            
            // [KO] 로그 공간(EV100)에서 직접 가중 평균 수행 (언리얼 방식의 Log-Luminance Average)
            // [EN] Perform weighted average directly in EV100 space (Unreal-style Log-Luminance Average)
            weightedEV100Sum += ev100 * validPixels;
            totalValidPixels += validPixels;
        }
        pixelCounter = nextCounter;
    }

    // [KO] 로그 공간에서의 평균 EV100 산출 [EN] Calculate average EV100 in log space
    let avgEV100 = weightedEV100Sum / max(totalValidPixels, 1.0);

    // [KO] 목표 휘도 및 사용자의 노출 보정(Compensation)을 반영한 목표 EV100 결정
    // [EN] Determine target EV100 reflecting target luminance and user's exposure compensation
    // [KO] UE5 표준 공식(1 / (1.2 * 2^EV100))에 따라, targetLuminance가 최종 결과물의 평균 휘도가 되도록 EV100을 계산합니다.
    // [EN] According to the UE5 standard formula (1 / (1.2 * 2^EV100)), calculate EV100 so that targetLuminance becomes the average luminance of the final result.
    // [KO] 기준점 계산: log2((1.2 * 100.0 * targetLuminance) / calibrationConstant)
    // [EN] Reference point calculation: log2((1.2 * 100.0 * targetLuminance) / calibrationConstant)
    var targetEV100 = avgEV100 - log2((120.0 * uniforms.targetLuminance) / uniforms.calibrationConstant) - uniforms.exposureCompensation;

    // [KO] 노출 배율 제한 적용 (너무 어두울 때 스페큘러가 타는 현상 방지)
    // [EN] Apply exposure multiplier limit (prevents specular blooming in very dark scenes)
    // [KO] EV100 공식 역산을 통해 최대 노출 배율에 해당하는 최소 EV100 결정 (CPU측 preExposure 공식과 일치시킴)
    // [EN] Determine minimum EV100 corresponding to the maximum exposure multiplier (consistent with CPU-side preExposure formula)
    let minPossibleEV100 = uniforms.exposureCompensation - log2(1.2 * uniforms.maxExposureMultiplier);
    targetEV100 = max(targetEV100, minPossibleEV100);

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
