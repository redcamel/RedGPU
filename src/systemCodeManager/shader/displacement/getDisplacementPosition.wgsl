/**
 * [KO] 디스플레이스먼트 텍스처를 바이큐빅 필터링으로 샘플링하여 변형된 정점 위치를 계산합니다.
 */
fn getDisplacementPosition(
    input_position: vec3<f32>,
    input_vertexNormal: vec3<f32>,
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

    let uv = input_uv * textureDimensions;
    let iuv = floor(uv - 0.5);
    let fuv = fract(uv - 0.5);

    let w0 = (1.0 - fuv) * (1.0 - fuv) * (1.0 - fuv) / 6.0;
    let w1 = (4.0 - 6.0 * fuv * fuv + 3.0 * fuv * fuv * fuv) / 6.0;
    let w2 = (1.0 + 3.0 * fuv + 3.0 * fuv * fuv - 3.0 * fuv * fuv * fuv) / 6.0;
    let w3 = fuv * fuv * fuv / 6.0;

    let g0 = w0 + w1;
    let g1 = w2 + w3;
    let h0 = (w1 / g0) - 1.0 + iuv;
    let h1 = (w3 / g1) + 1.0 + iuv;

    let res0 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h0.x, h0.y) + 0.5) * invTexSize, mipLevel).r * g0.x * g0.y;
    let res1 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h1.x, h0.y) + 0.5) * invTexSize, mipLevel).r * g1.x * g0.y;
    let res2 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h0.x, h1.y) + 0.5) * invTexSize, mipLevel).r * g0.x * g1.y;
    let res3 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h1.x, h1.y) + 0.5) * invTexSize, mipLevel).r * g1.x * g1.y;

    let h_bicubic = res0 + res1 + res2 + res3;

    let scaledDisplacement = (h_bicubic - 0.5) * displacementScale;
    let displacedPosition = input_position + normalize(input_vertexNormal) * scaledDisplacement;

    return displacedPosition;
}
