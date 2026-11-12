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

@group(0) @binding(0) var sourceTexture : texture_2d<f32>;
@group(0) @binding(1) var depthTexture : texture_depth_2d;
@group(0) @binding(2) var linearSampler : sampler;

@group(1) @binding(0) var<storage, read_write> histogram : array<atomic<u32>, 256>;
@group(1) @binding(1) var<storage, read> state : EyeAdaptationState;
@group(1) @binding(2) var<uniform> uniforms : AutoExposureUniforms;

const MIN_LUMINANCE: f32 = 0.0000001;
const SKY_DEPTH_THRESHOLD: f32 = 0.99999;
const WEIGHT_FIXED_SCALE: f32 = 16.0;

var<workgroup> localHistogram: array<atomic<u32>, 256>;

@compute @workgroup_size(16, 16, 1)
fn main(
    @builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(local_invocation_index) local_index : u32
) {
    atomicStore(&localHistogram[local_index], 0u);
    workgroupBarrier();

    let baseCoords = global_id.xy * 4u;
    let widthU = u32(uniforms.width);
    let heightU = u32(uniforms.height);

    if (baseCoords.x < widthU && baseCoords.y < heightU) {
        let baseF = vec2<f32>(baseCoords);
        let maxCoord = vec2<f32>(max(uniforms.width - 1.0, 0.0), max(uniforms.height - 1.0, 0.0));
        let invDim = vec2<f32>(uniforms.invWidth, uniforms.invHeight);

        // 4-Tap 하드웨어 양선형 필터링으로 4x4(16픽셀) 타일 전체를 무손실 평균화
        let uv0 = min(baseF + vec2<f32>(1.0, 1.0), maxCoord) * invDim;
        let uv1 = min(baseF + vec2<f32>(3.0, 1.0), maxCoord) * invDim;
        let uv2 = min(baseF + vec2<f32>(1.0, 3.0), maxCoord) * invDim;
        let uv3 = min(baseF + vec2<f32>(3.0, 3.0), maxCoord) * invDim;

        let t0 = textureSampleLevel(sourceTexture, linearSampler, uv0, 0.0);
        let t1 = textureSampleLevel(sourceTexture, linearSampler, uv1, 0.0);
        let t2 = textureSampleLevel(sourceTexture, linearSampler, uv2, 0.0);
        let t3 = textureSampleLevel(sourceTexture, linearSampler, uv3, 0.0);

        let alphaSum = t0.a + t1.a + t2.a + t3.a;
        if (alphaSum > 0.001) {
            let invPreExposure = 1.0 / max(state.preExposure, MIN_LUMINANCE);
            let maxLum = uniforms.maxHistogramLuminance;

            let l0 = min(getLuminance(t0.rgb) * invPreExposure, maxLum);
            let l1 = min(getLuminance(t1.rgb) * invPreExposure, maxLum);
            let l2 = min(getLuminance(t2.rgb) * invPreExposure, maxLum);
            let l3 = min(getLuminance(t3.rgb) * invPreExposure, maxLum);

            // 암부 픽셀(lum == 0.0)도 버리지 않고 Bin 0에 보존하여 백분위 모수 왜곡 차단
            let avgLum = max((l0 + l1 + l2 + l3) / alphaSum, MIN_LUMINANCE);
            let ev100 = log2(avgLum) + uniforms.calibrationOffset;
            let normalizedEV100 = saturate((ev100 - uniforms.minEV100) * uniforms.invEv100Range);
            let binIndex = min(255u, u32(normalizedEV100 * 256.0));

            let centerCoord = vec2<i32>(
                min(i32(baseCoords.x + 2u), i32(widthU) - 1),
                min(i32(baseCoords.y + 2u), i32(heightU) - 1)
            );
            let depth = textureLoad(depthTexture, centerCoord, 0);
            let skyFactor = select(1.0, uniforms.skyMeteringWeight, depth >= SKY_DEPTH_THRESHOLD);

            var spatialWeight = 1.0;
            if (uniforms.meteringMode == 1u || uniforms.meteringMode == 2u) {
                let tileCenterUV = min(baseF + vec2<f32>(2.0, 2.0), maxCoord) * invDim;
                let normDelta = (tileCenterUV - vec2<f32>(0.5, 0.5)) * 2.0;
                let distSq = dot(normDelta, normDelta);

                if (uniforms.meteringMode == 1u) {
                    let w = saturate(1.0 - distSq * 0.75);
                    spatialWeight = 0.15 + 0.85 * (w * w);
                } else {
                    let w = saturate(1.0 - distSq * uniforms.spotRadiusSqInv);
                    let w2 = w * w;
                    spatialWeight = w2 * w2;
                }
            }

            let coverage = saturate(alphaSum * 0.25);
            let fixedWeight = u32(spatialWeight * skyFactor * coverage * WEIGHT_FIXED_SCALE + 0.5);
            if (fixedWeight > 0u) {
                atomicAdd(&localHistogram[binIndex], fixedWeight);
            }
        }
    }

    workgroupBarrier();

    let localCount = atomicLoad(&localHistogram[local_index]);
    if (localCount > 0u) {
        atomicAdd(&histogram[local_index], localCount);
    }
}
