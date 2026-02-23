/**
 * [KO] 디스플레이스먼트 텍스처를 기반으로 변형된 법선 벡터를 계산합니다.
 * [EN] Calculates the modified normal vector based on the displacement texture.
 *
 * @param input_worldNormal - [KO] 월드 공간의 정점 법선 벡터 [EN] Vertex normal vector in world space
 * @param displacementTexture - [KO] 디스플레이스먼트 텍스처 [EN] Displacement texture
 * @param displacementTextureSampler - [KO] 디스플레이스먼트 텍스처 샘플러 [EN] Displacement texture sampler
 * @param displacementScale - [KO] 디스플레이스먼트 강도 [EN] Displacement scale
 * @param input_uv - [KO] UV 좌표 [EN] UV coordinates
 * @param mipLevel - [KO] 샘플링할 MIP 레벨 [EN] MIP level to sample
 * @returns [KO] 변형된 월드 공간 법선 벡터 [EN] Modified normal vector in world space
 */
fn getDisplacementNormal(
    input_worldNormal: vec3<f32>,
    displacementTexture: texture_2d<f32>,
    displacementTextureSampler: sampler,
    displacementScale: f32,
    input_uv: vec2<f32>,
    mipLevel: f32
) -> vec3<f32> {
    // [KO] 텍스처 해상도 기반 적응형 오프셋 계산
    // [EN] Calculate adaptive offset based on texture resolution
    let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, 0));
    let adaptiveOffset = vec2<f32>(1.0) / textureDimensions;

    // [KO] 중앙 차분법(Central Difference)을 위한 주변 픽셀 샘플링
    // [EN] Sampling surrounding pixels for Central Difference
    let left  = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv - vec2<f32>(adaptiveOffset.x, 0.0), mipLevel).r;
    let right = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(adaptiveOffset.x, 0.0), mipLevel).r;
    let up    = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv - vec2<f32>(0.0, adaptiveOffset.y), mipLevel).r;
    let down  = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(0.0, adaptiveOffset.y), mipLevel).r;

    // [KO] 높이 그라디언트 계산
    // [EN] Calculate height gradient
    // ddx: u 방향(X축) 증가에 따른 높이 변화
    // ddy: v 방향(Y축) 증가에 따른 높이 변화. WebGPU는 V가 아래로 증가하므로 down - up
    let ddx = (right - left) * displacementScale / (2.0 * adaptiveOffset.x);
    let ddy = (down - up) * displacementScale / (2.0 * adaptiveOffset.y);

    // [KO] 월드 공간 법선 섭동 (Perturbation)
    // [EN] World space normal perturbation
    // [KO] 탄젠트 정보를 명시적으로 받지 못하므로, 월드 노멀을 기준으로 직교 기저(Orthonormal Basis)를 임시 생성합니다.
    // [EN] Since tangent info is not explicitly provided, create a temporary orthonormal basis based on the world normal.
    let N = normalize(input_worldNormal);
    
    var T = vec3<f32>(1.0, 0.0, 0.0);
    if (abs(N.y) > 0.999) {
        T = vec3<f32>(0.0, 0.0, 1.0);
    }
    T = normalize(cross(T, N));
    let B = cross(N, T);

    // [KO] 최종 노멀 계산: N' = normalize(N - ddx*T - ddy*B)
    // [EN] Final normal calculation: N' = normalize(N - ddx*T - ddy*B)
    // [KO] 거리에 따른(MIP 레벨) 강도 감쇄 적용
    // [EN] Apply intensity attenuation based on distance (MIP level)
    let normalStrength = clamp(1.0 - mipLevel * 0.1, 0.0, 1.0);
    let perturbedNormal = normalize(N - (ddx * T + ddy * B) * (normalStrength * 0.1));

    return perturbedNormal;
}
