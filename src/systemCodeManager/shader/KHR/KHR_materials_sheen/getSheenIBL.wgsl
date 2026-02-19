#redgpu_include math.direction.getReflectionVectorFromViewDirection
#redgpu_include KHR.KHR_materials_sheen.getSheenCharlieDFG
#redgpu_include KHR.KHR_materials_sheen.getSheenCharlieE

struct SheenIBLResult {
    sheenIBLContribution: vec3<f32>,
    sheenAlbedoScaling: f32
}

/**
 * [KO] Charlie 모델 기반의 Sheen IBL 기여도를 통합 계산합니다.
 * [EN] Integrally calculates Sheen IBL contribution based on the Charlie model.
 *
 * @param N - [KO] 법선 벡터 [EN] Normal vector
 * @param V - [KO] 시선 방향 벡터 [EN] View direction vector
 * @param sheenColor - [KO] Sheen 색상 [EN] Sheen color
 * @param maxSheenColor - [KO] Sheen 색상의 최대 채널 값 [EN] Maximum channel value of sheen color
 * @param sheenRoughness - [KO] Sheen 거칠기 [EN] Sheen roughness
 * @param iblMipmapCount - [KO] IBL 텍스처의 밉맵 수 [EN] Mipmap count of IBL texture
 * @param irradianceTexture - [KO] IBL 환경 텍스처 [EN] IBL environment texture
 * @param textureSampler - [KO] 환경 텍스처 샘플러 [EN] Environment texture sampler
 * @returns [KO] Sheen IBL 계산 결과 (기여도 및 알베도 스케일링) [EN] Sheen IBL calculation result
 */
fn getSheenIBL(
    N: vec3<f32>,
    V: vec3<f32>,
    sheenColor: vec3<f32>,
    maxSheenColor: f32,
    sheenRoughness: f32,
    iblMipmapCount: f32,
    irradianceTexture: texture_cube<f32>,
    textureSampler: sampler
) -> SheenIBLResult {
    let NdotV = clamp(dot(N, V), 0.0001, 1.0);
    let R = getReflectionVectorFromViewDirection(V, N);

    let mipLevel = sheenRoughness * iblMipmapCount;
    let sheenRadiance = textureSampleLevel(irradianceTexture, textureSampler, R, mipLevel).rgb;

    let sheenDFG = getSheenCharlieDFG(NdotV, sheenRoughness);
    let contribution = sheenRadiance * sheenColor * sheenDFG;

    let E = getSheenCharlieE(NdotV, sheenRoughness);
    let albedoScaling = 1.0 - maxSheenColor * E;

    return SheenIBLResult(contribution, albedoScaling);
}
