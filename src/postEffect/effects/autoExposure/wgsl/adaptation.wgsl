struct AutoExposureUniforms {
    deltaTime: f32,
    speed: f32,
    adjustmentSpeedUp: f32,
    adjustmentSpeedDown: f32,
    targetLuminance: f32,
    minLuminance: f32,
    maxLuminance: f32
};

@group(0) @binding(0) var sourceTexture : texture_2d<f32>;
@group(1) @binding(0) var<storage, read_write> adaptedLuminance : f32;
@group(1) @binding(1) var<uniform> uniforms : AutoExposureUniforms;

var<workgroup> sharedLum: array<f32, 256>;
var<workgroup> sharedWeight: array<f32, 256>;

@compute @workgroup_size(16, 16, 1)
fn main(
    @builtin(local_invocation_index) local_index: u32,
    @builtin(global_invocation_id) global_id: vec3<u32>
) {
    let size = textureDimensions(sourceTexture);
    var lum: f32 = 0.0;
    var weight: f32 = 0.0;
    if (global_id.x < size.x && global_id.y < size.y) {
        let tex = textureLoad(sourceTexture, vec2<i32>(i32(global_id.x), i32(global_id.y)), 0);
        // tex.r: average log luminance of the block
        // tex.g: count of samples in the block
        lum = tex.r * tex.g;
        weight = tex.g;
    }

    sharedLum[local_index] = lum;
    sharedWeight[local_index] = weight;
    workgroupBarrier();

    // Simple reduction
    for (var i = 128u; i > 0u; i = i >> 1u) {
        if (local_index < i) {
            sharedLum[local_index] += sharedLum[local_index + i];
            sharedWeight[local_index] += sharedWeight[local_index + i];
        }
        workgroupBarrier();
    }

    if (local_index == 0u) {
        let totalWeight = max(sharedWeight[0], 1.0);
        let avgLogLum = sharedLum[0] / totalWeight;
        
        // [KO] 기하 평균 휘도 계산 (Geometric Mean)
        // [EN] Calculate Geometric Mean Luminance
        let currentLum = exp(avgLogLum);

        // [KO] 이전 적응 휘도값 (0 나누기 방지)
        // [EN] Previous adapted luminance value (prevent divide by zero)
        let prevLum = max(adaptedLuminance, 0.001);
        
        // [KO] 밝아질 때와 어두워질 때의 속도 차별화 (언리얼 방식)
        // [EN] Differentiate speeds for getting brighter vs darker (Unreal style)
        let diff = currentLum - prevLum;
        let speedMult = select(uniforms.adjustmentSpeedDown, uniforms.adjustmentSpeedUp, diff > 0.0);

        // [KO] 시간 변화량(deltaTime)을 고려하여 부드럽게 적응
        // [EN] Adapt smoothly considering deltaTime
        let adaptationFactor = 1.0 - exp(-uniforms.speed * speedMult * uniforms.deltaTime);
        var nextLum = prevLum + diff * adaptationFactor;

        // [KO] 휘도 범위를 제한하여 어두운 곳에서 너무 밝아지거나 밝은 곳에서 너무 어두워지는 것을 방지
        // [EN] Limit luminance range to prevent over-brightness in dark areas or over-darkness in bright areas
        adaptedLuminance = clamp(nextLum, uniforms.minLuminance, uniforms.maxLuminance);
    }
}
