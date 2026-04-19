#redgpu_include color.getLuminance

@group(0) @binding(0) var sourceTexture : texture_2d<f32>;
@group(1) @binding(0) var<storage, read_write> histogram : array<atomic<u32>, 256>;

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
@group(1) @binding(1) var<uniform> uniforms : AutoExposureUniforms;

// [KO] 공유 메모리를 사용하여 전역 원자적 연산 병목 해소
// [EN] Use shared memory to resolve global atomic operation bottlenecks
var<workgroup> localHistogram: array<atomic<u32>, 256>;

@compute @workgroup_size(16, 16, 1)
fn main(
    @builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(local_invocation_index) local_index : u32
) {
    // [KO] 로컬 히스토그램 초기화 [EN] Initialize local histogram
    if (local_index < 256u) {
        atomicStore(&localHistogram[local_index], 0u);
    }
    workgroupBarrier();

    if (f32(global_id.x) < uniforms.width && f32(global_id.y) < uniforms.height) {
        // [KO] 성능을 위해 2x2 간격으로 샘플링 [EN] Sample at 2x2 intervals for performance
        if (global_id.x % 2u == 0u && global_id.y % 2u == 0u) {
            let color = textureLoad(sourceTexture, vec2<i32>(i32(global_id.x), i32(global_id.y)), 0).rgb;
            
            // [KO] 색채 에너지를 보존하기 위해 단순 휘도(Luminance) 대신 각 채널의 최대값(Max Component)을 사용하여 밝기를 판단합니다.
            // [EN] Use the maximum color component (Max Component) instead of simple luminance to judge brightness and preserve color energy.
            // [KO] 이를 통해 순수 빨강, 순수 파랑 등 채도가 높은 색상이 "어둡다"고 오판되어 노출이 과하게 튀는 현상을 방지합니다.
            // [EN] This prevents over-exposure when highly saturated colors like pure red or blue are misjudged as "dark".
            let brightness = max(color.r, max(color.g, color.b));
            let lum = brightness / max(uniforms.currentPreExposure, 0.0001);

            // [KO] 배경 제외: 휘도가 0.0001보다 작거나 Alpha가 0인 픽셀은 히스토그램에서 제외합니다.
            // [EN] Exclude background: pixels with luminance less than 0.0001 or alpha 0 are excluded from the histogram.
            // [KO] 이를 통해 빈 공간(Void)에 의해 전체 노출 평균이 왜곡되는 것을 방지합니다.
            // [EN] This prevents the overall exposure average from being distorted by empty space (Void).
            let texel = textureLoad(sourceTexture, vec2<i32>(i32(global_id.x), i32(global_id.y)), 0);
            if (lum > 0.0001 && texel.a > 0.0) {
                // [KO] 휘도를 EV100으로 변환: EV100 = log2(L * 100 / K)
                // [EN] Convert luminance to EV100: EV100 = log2(L * 100 / K)
                let ev100 = log2(lum * 100.0 / uniforms.calibrationConstant);
                
                let normalizedEV100 = clamp((ev100 - uniforms.minEV100) * uniforms.invEv100Range, 0.0, 1.0);
                let binIndex = u32(normalizedEV100 * 255.0);

                // [KO] 측광 가중치 계산 [EN] Calculate metering weight
                var weight = 1.0;
                let uv = vec2<f32>(f32(global_id.x) / uniforms.width, f32(global_id.y) / uniforms.height);
                let dist = distance(uv, vec2<f32>(0.5, 0.5));

                if (uniforms.meteringMode == 1.0) {
                    // [KO] 중앙 중점 측광 (Center-weighted) [EN] Center-weighted
                    weight = clamp(1.0 - dist * 1.0, 0.0, 1.0);
                    weight = weight * weight; // [KO] 부드러운 감쇄 [EN] Smooth falloff
                } else if (uniforms.meteringMode == 2.0) {
                    // [KO] 스포트 측광 (Spot) [EN] Spot
                    weight = clamp(1.0 - dist * 4.0, 0.0, 1.0);
                    weight = weight * weight * weight * weight; // [KO] 중앙 집중 [EN] Highly concentrated
                }

                // [KO] 가중치를 반영하여 로컬 히스토그램에 누적 (0~255 스케일링)
                // [EN] Accumulate into local histogram with weight (scaled 0-255)
                atomicAdd(&localHistogram[binIndex], u32(weight * 255.0));
            }
        }
    }

    // [KO] 모든 스레드가 로컬 히스토그램 작성을 마칠 때까지 대기
    // [EN] Wait for all threads to finish writing to the local histogram
    workgroupBarrier();

    // [KO] 로컬 히스토그램을 전역 히스토그램으로 병합
    // [EN] Merge local histogram into global histogram
    if (local_index < 256u) {
        let localCount = atomicLoad(&localHistogram[local_index]);
        if (localCount > 0u) {
            atomicAdd(&histogram[local_index], localCount);
        }
    }
}
