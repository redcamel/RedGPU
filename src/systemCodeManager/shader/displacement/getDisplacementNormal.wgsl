/**
 * [KO] 바이큐빅 필터링 헬퍼 (B-Spline 기반 고정밀 버전)
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
 */
fn getDisplacementNormal(
    displacementTexture: texture_2d<f32>,
    displacementTextureSampler: sampler,
    displacementScale: f32,
    input_uv: vec2<f32>,
    mipLevel: f32
) -> vec3<f32> {
    // [KO] 현재 밉레벨에 해당하는 텍스처 크기를 가져옵니다.
    // [EN] Get the texture size corresponding to the current mip level.
    let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, i32(mipLevel)));
    let invTexSize = 1.0 / textureDimensions;
    
    // [KO] 노멀 계산을 위한 샘플링 간격 (격자 현상 완화를 위해 1.5 ~ 2.0 텍셀 정도로 설정)
    // [EN] Sampling interval for normal calculation (set to about 1.5 to 2.0 texels to alleviate grid artifacts)
    let step = invTexSize * 1.5;

    let h_u0 = sampleBicubic(input_uv + vec2<f32>(-step.x, 0.0), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_u1 = sampleBicubic(input_uv + vec2<f32>( step.x, 0.0), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_v0 = sampleBicubic(input_uv + vec2<f32>(0.0, -step.y), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_v1 = sampleBicubic(input_uv + vec2<f32>(0.0,  step.y), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);

    // [KO] UV 단위당 높이 변화율(Derivative)을 계산합니다. (해상도 독립적 방식)
    // [EN] Calculate height derivatives per UV unit. (Resolution-independent method)
    let ddu = (h_u1 - h_u0) * displacementScale / (step.x * 2.0);
    let ddv = (h_v1 - h_v0) * displacementScale / (step.y * 2.0);

    // [KO] 탄젠트 공간 법선 벡터 반환
    // [EN] Return tangent space normal vector
    return normalize(vec3<f32>(-ddu, -ddv, 1.0));
}
