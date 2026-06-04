/**
 * [KO] 디스플레이스먼트 텍스처를 기반으로 변형된 정점 위치를 계산합니다.
 * [EN] Calculates the modified vertex position based on the displacement texture.
 *
 * @param input_position - [KO] 정점의 로컬 위치 [EN] Local position of the vertex
 * @param input_vertexNormal - [KO] 정점의 로컬 법선 벡터 [EN] Local normal vector of the vertex
 * @param displacementTexture - [KO] 디스플레이스먼트 텍스처 [EN] Displacement texture
 * @param displacementTextureSampler - [KO] 디스플레이스먼트 텍스처 샘플러 [EN] Displacement texture sampler
 * @param displacementScale - [KO] 디스플레이스먼트 강도 [EN] Displacement scale
 * @param input_uv - [KO] UV 좌표 [EN] UV coordinates
 * @param mipLevel - [KO] 샘플링할 MIP 레벨 [EN] MIP level to sample
 * @returns [KO] 변형된 로컬 공간 정점 위치 [EN] Modified local space vertex position
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
    // [KO] 하드웨어의 Bilinear 필터링을 사용하여 높이 값을 부드럽게 샘플링합니다.
    // [EN] Smoothly sample the height value using hardware Bilinear filtering.
    let h = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv, mipLevel).r;

    // [KO] 0.5(미드레벨)를 기준으로 높이를 스케일링 (언리얼 표준 방식)
    let scaledDisplacement = (h - 0.5) * displacementScale;

    // [KO] 정점 법선 방향으로 위치 이동
    let displacedPosition = input_position + normalize(input_vertexNormal) * scaledDisplacement;

    return displacedPosition;
}
