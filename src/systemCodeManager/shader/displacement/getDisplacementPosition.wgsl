/**
 * [KO] 디스플레이스먼트 텍스처를 바이큐빅 필터링으로 샘플링하여 변형된 정점 위치를 계산합니다.
 * [EN] Calculates the modified vertex position by sampling the displacement texture with bicubic filtering.
 *
 * @param input_position [KO] 입력 정점 위치 [EN] Input vertex position
 * @param input_vertexNormal [KO] 입력 정점 법선 [EN] Input vertex normal
 * @param displacementTexture [KO] 디스플레이스먼트 텍스처 [EN] Displacement texture
 * @param displacementTextureSampler [KO] 샘플러 [EN] Sampler
 * @param displacementScale [KO] 변위 강도 [EN] Displacement scale
 * @param input_uv [KO] 입력 UV 좌표 [EN] Input UV coordinates
 * @param mipLevel [KO] 밉맵 레벨 [EN] Mipmap level
 * @returns [KO] 변형된 정점 위치 [EN] Modified vertex position
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
    // [KO] 텍스처 크기는 베이스 해상도(Mip 0)를 기준으로 하여 변위의 연속성을 유지합니다.
    // [EN] Texture dimensions based on base resolution (Mip 0) to maintain displacement continuity.
    let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, 0));
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
