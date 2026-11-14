#redgpu_include color.getLuminance

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

@group(0) @binding(0) var sourceTexture : texture_2d<f32>;

@group(1) @binding(0) var<storage, read_write> histogram : array<atomic<u32>, 256>;
@group(1) @binding(1) var<storage, read> state : EyeAdaptationState;
@group(1) @binding(2) var<uniform> uniforms : AutoExposureUniforms;

const MIN_LUMINANCE: f32 = 0.0000001;

var<workgroup> localHistogram: array<atomic<u32>, 256>;

@compute @workgroup_size(16, 16, 1)
fn main(
    @builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(local_invocation_index) local_index : u32
) {
    atomicStore(&localHistogram[local_index], 0u);
    workgroupBarrier();

    let coords = global_id.xy * 4u;
    if (coords.x < u32(uniforms.width) && coords.y < u32(uniforms.height)) {
        let texel = textureLoad(sourceTexture, vec2<i32>(coords), 0);

        if (texel.a > 0.0) {
            let invPreExposure = 1.0 / max(state.preExposure, MIN_LUMINANCE);
            let lum = getLuminance(texel.rgb) * invPreExposure;

            if (lum > MIN_LUMINANCE) {
                // ISO 2720 표준 반사식 노출계 공식: EV100 = log2(L * 100 / 12.5) = log2(L) + 3.0
                let ev100 = log2(lum) + 3.0;
                let normalizedEV100 = saturate((ev100 - uniforms.minEV100) * uniforms.invEv100Range);
                let binIndex = min(255u, u32(normalizedEV100 * 256.0));

                var weight = 1.0;
                if (uniforms.meteringMode > 0u) {
                    let center = vec2<f32>(uniforms.width, uniforms.height) * 0.5;
                    let delta = (vec2<f32>(coords) - center) * uniforms.invHeight;
                    let dist = sqrt(dot(delta, delta));

                    if (uniforms.meteringMode == 1u) {
                        let w = saturate(1.0 - dist);
                        weight = w * w;
                    } else {
                        let w = saturate(1.0 - dist * 4.0);
                        let w2 = w * w;
                        weight = w2 * w2;
                    }
                }

                let fixedWeight = u32(weight * 100.0);
                if (fixedWeight > 0u) {
                    atomicAdd(&localHistogram[binIndex], fixedWeight);
                }
            }
        }
    }

    workgroupBarrier();

    let localCount = atomicLoad(&localHistogram[local_index]);
    if (localCount > 0u) {
        atomicAdd(&histogram[local_index], localCount);
    }
}
