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
    // [KO] 디스플레이스먼트 텍스처에서 높이 값 샘플링 (R 채널 사용)
    // [EN] Sample the height value from the displacement texture (using the R channel)
    let displacementSample = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv, mipLevel).r;

    // [KO] 0.5를 기준으로 높이를 스케일링 (0.5는 변위 없음, 1.0은 확장, 0.0은 수축)
    // [EN] Scale the height based on 0.5 (0.5 means no displacement, 1.0 expansion, 0.0 contraction)
    let scaledDisplacement = (displacementSample - 0.5) * displacementScale;

    // [KO] 정점 법선 방향으로 위치 이동
    // [EN] Move the position in the direction of the vertex normal
    let displacedPosition = input_position + normalize(input_vertexNormal) * scaledDisplacement;

    return displacedPosition;
}
