struct AutoExposureUniforms {
    deltaTime: f32,
    speed: f32,
    adjustmentSpeedUp: f32,
    adjustmentSpeedDown: f32,
    targetLuminance: f32,
    minLuminance: f32,
    maxLuminance: f32,
    minLogLum: f32,
    logLumRange: f32,
    lowPercentile: f32,
    highPercentile: f32,
    invLogLumRange: f32,
    width: f32,
    height: f32
};

@group(0) @binding(0) var<storage, read_write> histogram : array<atomic<u32>, 64>;
@group(0) @binding(1) var<storage, read_write> adaptedLuminance : f32;
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

    // [KO] 언리얼 스타일의 퍼센타일 기반 필터링
    // [EN] Unreal-style percentile-based filtering
    let minPixel = u32(f32(totalPixels) * uniforms.lowPercentile);
    let maxPixel = u32(f32(totalPixels) * uniforms.highPercentile);

    var pixelCounter: u32 = 0u;
    var weightedLogLumSum: f32 = 0.0;
    var weightedPixelCount: f32 = 0.0;

    for (var i = 0u; i < 64u; i = i + 1u) {
        let nextCounter = pixelCounter + countBuffer[i];
        
        // [KO] 유효 범위(low ~ high percentile) 내의 픽셀들만 선별
        // [EN] Filter pixels within the valid percentile range
        let validPixels = max(0.0, f32(min(nextCounter, maxPixel)) - f32(max(pixelCounter, minPixel)));
        if (validPixels > 0.0) {
            let logLum = uniforms.minLogLum + (f32(i) / 63.0) * uniforms.logLumRange;
            weightedLogLumSum += logLum * validPixels;
            weightedPixelCount += validPixels;
        }
        pixelCounter = nextCounter;
    }

    // [KO] 기하 평균 휘도 산출 (Geometric Mean via Log2)
    // [EN] Calculate geometric mean luminance
    let avgLogLum = weightedLogLumSum / max(weightedPixelCount, 1.0);
    let currentLum = pow(2.0, avgLogLum);

    // [KO] 눈 적응 시뮬레이션 [EN] Eye adaptation simulation
    let prevLum = max(adaptedLuminance, 0.001);
    let diff = currentLum - prevLum;
    let speed = select(uniforms.adjustmentSpeedDown, uniforms.adjustmentSpeedUp, diff > 0.0);
    
    // [KO] 지수 감쇄 공식 (언리얼 방식) [EN] Exponential decay formula (Unreal style)
    let adaptationFactor = 1.0 - exp(-uniforms.speed * speed * uniforms.deltaTime);
    var nextLum = prevLum + diff * adaptationFactor;
    
    // [KO] 휘도 범위 제한 [EN] Limit luminance range
    adaptedLuminance = clamp(nextLum, uniforms.minLuminance, uniforms.maxLuminance);
}
