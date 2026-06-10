/**
 * [KO] 바이큐빅 필터링 헬퍼 (B-Spline 기반 고정밀 버전)
 * [EN] Bicubic filtering helper (High-precision version based on B-Spline)
 *
 * @param uv [KO] 샘플링할 UV 좌표 [EN] UV coordinates to sample
 * @param tex [KO] 샘플링할 텍스처 [EN] Texture to sample
 * @param smp [KO] 샘플러 [EN] Sampler
 * @param dims [KO] 텍스처 크기 [EN] Texture dimensions
 * @param invSize [KO] 텍스처 크기의 역수 [EN] Inverse of texture dimensions
 * @param mip [KO] 밉맵 레벨 [EN] Mipmap level
 * @returns [KO] 샘플링된 값 [EN] Sampled value
 */
fn sampleBicubic(uv: vec2<f32>, tex: texture_2d<f32>, smp: sampler, dims: vec2<f32>, invSize: vec2<f32>, mip: f32) -> f32 {
    let res_uv = uv * dims;
    let i = floor(res_uv - 0.5);
    let f = fract(res_uv - 0.5);

    let w0 = (1.0 - f) * (1.0 - f) * (1.0 - f) / 6.0;
    let w1 = (4.0 - 6.0 * f * f + 3.0 * f * f * f) / 6.0;
    let w2 = (1.0 + 3.0 * f + 3.0 * f * f - 3.0 * f * f * f) / 6.0;
    let w3 = f * f * f / 6.0;

    let g0 = w0 + w1;
    let g1 = w2 + w3;
    let h0 = (w1 / g0) - 1.0 + i;
    let h1 = (w3 / g1) + 1.0 + i;

    let r0 = textureSampleLevel(tex, smp, (vec2<f32>(h0.x, h0.y) + 0.5) * invSize, mip).r * g0.x * g0.y;
    let r1 = textureSampleLevel(tex, smp, (vec2<f32>(h1.x, h0.y) + 0.5) * invSize, mip).r * g1.x * g0.y;
    let r2 = textureSampleLevel(tex, smp, (vec2<f32>(h0.x, h1.y) + 0.5) * invSize, mip).r * g0.x * g1.y;
    let r3 = textureSampleLevel(tex, smp, (vec2<f32>(h1.x, h1.y) + 0.5) * invSize, mip).r * g1.x * g1.y;

    return r0 + r1 + r2 + r3;
}

/**
 * [KO] 디스플레이스먼트 텍스처를 바이큐빅 필터링으로 샘플링하여 변형된 법선 벡터를 계산합니다.
 * [EN] Calculates the modified normal vector by sampling the displacement texture with bicubic filtering.
 *
 * @param displacementTexture [KO] 디스플레이스먼트 텍스처 [EN] Displacement texture
 * @param displacementTextureSampler [KO] 샘플러 [EN] Sampler
 * @param displacementScale [KO] 변위 강도 [EN] Displacement scale
 * @param input_uv [KO] 입력 UV 좌표 [EN] Input UV coordinates
 * @param mipLevel [KO] 밉맵 레벨 [EN] Mipmap level
 * @returns [KO] 변형된 법선 벡터 [EN] Modified normal vector
 */
fn getDisplacementNormal(
    displacementTexture: texture_2d<f32>,
    displacementTextureSampler: sampler,
    displacementScale: f32,
    input_uv: vec2<f32>,
    mipLevel: f32
) -> vec3<f32> {
    // [KO] 텍스처 크기는 베이스 해상도(Mip 0)를 기준으로 하여 노멀의 선명도를 유지합니다.
    // [EN] Texture dimensions based on base resolution (Mip 0) to maintain normal sharpness.
    let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, 0));
    let invTexSize = 1.0 / textureDimensions;
    
    // [KO] 노멀 계산을 위한 샘플링 간격 (밉레벨에 따라 조절)
    // [EN] Sampling interval for normal calculation (adjusted by mip level)
    let step = invTexSize * exp2(mipLevel);

    let h_u0 = sampleBicubic(input_uv + vec2<f32>(-step.x, 0.0), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_u1 = sampleBicubic(input_uv + vec2<f32>( step.x, 0.0), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_v0 = sampleBicubic(input_uv + vec2<f32>(0.0, -step.y), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_v1 = sampleBicubic(input_uv + vec2<f32>(0.0,  step.y), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);

    // [KO] UV 단위당 높이 변화율(Derivative) 계산
    let ddu = (h_u1 - h_u0) * displacementScale / (step.x * 2.0);
    let ddv = (h_v1 - h_v0) * displacementScale / (step.y * 2.0);

    return normalize(vec3<f32>(-ddu, -ddv, 1.0));
}
