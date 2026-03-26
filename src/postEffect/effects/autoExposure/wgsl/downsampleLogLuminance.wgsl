#redgpu_include color.getLuminance

@group(0) @binding(0) var sourceTexture : texture_2d<f32>;
@group(1) @binding(0) var<storage, read_write> histogram : array<atomic<u32>, 64>;

struct AutoExposureUniforms {
    deltaTime: f32,
    speed: f32,
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
    height: f32
};
@group(1) @binding(1) var<uniform> uniforms : AutoExposureUniforms;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    if (f32(global_id.x) >= uniforms.width || f32(global_id.y) >= uniforms.height) { return; }

    // [KO] 성능을 위해 2x2 간격으로 샘플링 [EN] Sample at 2x2 intervals for performance
    if (global_id.x % 2u != 0u || global_id.y % 2u != 0u) { return; }

    let color = textureLoad(sourceTexture, vec2<i32>(i32(global_id.x), i32(global_id.y)), 0).rgb;
    let lum = getLuminance(color);

    // [KO] 유효한 휘도 범위인 경우 히스토그램 빈에 추가
    // [EN] Add to histogram bin if within valid luminance range
    if (lum > 0.0001) {
        // [KO] 휘도를 EV100으로 변환: EV100 = log2(L * 100 / K)
        // [EN] Convert luminance to EV100: EV100 = log2(L * 100 / K)
        let ev100 = log2(lum * 100.0 / uniforms.calibrationConstant);
        
        let normalizedEV100 = clamp((ev100 - uniforms.minEV100) * uniforms.invEv100Range, 0.0, 1.0);
        let binIndex = u32(normalizedEV100 * 63.0);
        atomicAdd(&histogram[binIndex], 1u);
    }
}
