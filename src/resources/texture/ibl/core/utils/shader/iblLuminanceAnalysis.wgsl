#redgpu_include color.getLuminance

@group(0) @binding(0) var sourceTexture : texture_2d_array<f32>;
@group(0) @binding(1) var<storage, read_write> luminanceSum : atomic<u32>;

@compute @workgroup_size(16, 16, 1)
fn cs_main(
    @builtin(global_invocation_id) global_id : vec3<u32>,
) {
    // [KO] 128x128 고정 그리드 샘플링으로 오버플로우 방지 및 성능 최적화
    // [EN] Fixed 128x128 grid sampling to prevent overflow and optimize performance
    if (global_id.x >= 128u || global_id.y >= 128u) { return; }

    let size = vec2<f32>(textureDimensions(sourceTexture).xy);
    let step = size / 128.0;
    
    // [KO] 그리드 중앙 샘플링 좌표 계산
    // [EN] Calculate grid center sampling coordinates
    let texCoord = vec2<i32>(vec2<f32>(global_id.xy) * step + (step * 0.5));

    var totalLum: f32 = 0.0;
    for (var face = 0u; face < 6u; face = face + 1u) {
        let color = textureLoad(sourceTexture, texCoord, i32(face), 0).rgb;
        totalLum += getLuminance(color);
    }

    // [KO] u32 누적 (스케일 1.0)
    // [EN] u32 accumulation (scale 1.0)
    // [KO] 128*128*6 샘플이므로 평균 휘도가 40,000lx여도 약 39억으로 u32(42.9억) 범위 내 안전
    // [EN] 128*128*6 samples, so even if average luminance is 40,000lx, it's safe within u32 range
    let scaledLum = u32(totalLum);
    atomicAdd(&luminanceSum, scaledLum);
}
