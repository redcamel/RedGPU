/**
 * [KO] 디스플레이스먼트 텍스처를 기반으로 변형된 법선 벡터를 계산합니다. (안정적인 Sobel 방식)
 * [EN] Calculates the modified normal vector based on the displacement texture. (Stable Sobel method)
 *
 * @param displacementTexture - [KO] 디스플레이스먼트 텍스처 [EN] Displacement texture
 * @param displacementTextureSampler - [KO] 디스플레이스먼트 텍스처 샘플러 [EN] Displacement texture sampler
 * @param displacementScale - [KO] 디스플레이스먼트 강도 [EN] Displacement scale
 * @param input_uv - [KO] UV 좌표 [EN] UV coordinates
 * @param mipLevel - [KO] 샘플링할 MIP 레벨 [EN] MIP level to sample
 * @returns [KO] 탄젠트 공간의 변형된 법선 벡터 [EN] Modified normal vector in tangent space
 */
fn getDisplacementNormal(
    displacementTexture: texture_2d<f32>,
    displacementTextureSampler: sampler,
    displacementScale: f32,
    input_uv: vec2<f32>,
    mipLevel: f32
) -> vec3<f32> {
    let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, 0));
    let texelSize = vec2<f32>(1.0) / textureDimensions;
    
    // [KO] 1.5~2.0 픽셀 정도의 부드러운 오프셋 사용
    let step = texelSize * 2.0;

    // [KO] 주변 8개 지점 샘플링 (Bilinear Filtering 활용)
    let h00 = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(-step.x, -step.y), mipLevel).r;
    let h10 = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>( 0.0,    -step.y), mipLevel).r;
    let h20 = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>( step.x, -step.y), mipLevel).r;
    let h01 = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(-step.x,  0.0),    mipLevel).r;
    let h21 = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>( step.x,  0.0),    mipLevel).r;
    let h02 = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(-step.x,  step.y), mipLevel).r;
    let h12 = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>( 0.0,     step.y), mipLevel).r;
    let h22 = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>( step.x,  step.y), mipLevel).r;

    // [KO] 수치 안정성을 위해 해상도로 나누지 않고 가중 평균 기울기만 도출 (Unreal 스타일)
    // [KO] 과도한 노멀 꺾임과 8비트 계단 현상을 방지합니다.
    // [EN] Derives weighted average gradient without dividing by resolution for numerical stability (Unreal style).
    // [EN] Prevents excessive normal bending and 8-bit stepping artifacts.
    let ddu = ((h20 + 2.0 * h21 + h22) - (h00 + 2.0 * h01 + h02)) * displacementScale * 0.125;
    let ddv = ((h02 + 2.0 * h12 + h22) - (h00 + 2.0 * h10 + h20)) * displacementScale * 0.125;

    // [KO] 탄젠트 공간 법선 반환 (Z=1.0 기준의 안정적인 섭동)
    return normalize(vec3<f32>(-ddu, -ddv, 1.0));
}
