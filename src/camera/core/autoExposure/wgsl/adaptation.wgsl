struct AutoExposureUniforms {
    deltaTime: f32,
    targetEV100Bias: f32,
    adjustmentSpeedUp: f32,
    adjustmentSpeedDown: f32,
    minPossibleEV100: f32,
    minEV100: f32,
    maxEV100: f32,
    ev100Range: f32,
    lowPercentile: f32,
    highPercentile: f32,
    invEv100Range: f32,
    width: f32,
    height: f32,
    currentPreExposure: f32,
    meteringMode: f32,
    pad0: f32 // 16-byte tail alignment
};

@group(0) @binding(0) var<storage, read_write> histogram : array<atomic<u32>, 256>;
@group(0) @binding(1) var<storage, read_write> adaptedEV100 : f32;
@group(0) @binding(2) var<uniform> uniforms : AutoExposureUniforms;

@compute @workgroup_size(1, 1, 1)
fn main() {
    var countBuffer: array<u32, 256>;
    var totalPixels: u32 = 0u;

    for (var i = 0u; i < 256u; i = i + 1u) {
        let val = atomicExchange(&histogram[i], 0u);
        countBuffer[i] = val;
        totalPixels += val;
    }

    if (totalPixels == 0u) { return; }

    let minPixel = u32(f32(totalPixels) * uniforms.lowPercentile);
    let maxPixel = u32(f32(totalPixels) * uniforms.highPercentile);

    var pixelCounter: u32 = 0u;
    var weightedEV100Sum: f32 = 0.0;
    var totalValidPixels: f32 = 0.0;

    const INV_255: f32 = 1.0 / 255.0;

    for (var i = 0u; i < 256u; i = i + 1u) {
        let nextCounter = pixelCounter + countBuffer[i];
        
        let validPixels = max(0.0, f32(min(nextCounter, maxPixel)) - f32(max(pixelCounter, minPixel)));
        if (validPixels > 0.0) {
            let ev100 = uniforms.minEV100 + (f32(i) * INV_255) * uniforms.ev100Range;
            weightedEV100Sum += ev100 * validPixels;
            totalValidPixels += validPixels;
        }
        pixelCounter = nextCounter;
    }

    let avgEV100 = weightedEV100Sum * (1.0 / max(totalValidPixels, 1.0));
    var targetEV100 = avgEV100 - uniforms.targetEV100Bias;
    targetEV100 = max(targetEV100, uniforms.minPossibleEV100);

    let prevEV100 = adaptedEV100;
    let diff = targetEV100 - prevEV100;
    let speed = select(uniforms.adjustmentSpeedDown, uniforms.adjustmentSpeedUp, diff > 0.0);
    let adaptationFactor = 1.0 - exp(-speed * uniforms.deltaTime);
    var nextEV100 = prevEV100 + diff * adaptationFactor;

    adaptedEV100 = clamp(nextEV100, uniforms.minEV100, uniforms.maxEV100);
}
