/**
 * [KO] Phong 모델 기반의 조명 기여도를 계산합니다.
 * [EN] Calculates light contribution based on the Phong model.
 *
 * @param lightColor - [KO] 광색 [EN] Light color
 * @param lightIntensity - [KO] 광도 (그림자 및 감쇄가 포함된 최종 강도) [EN] Light intensity (final intensity including shadow and attenuation)
 * @param surfaceToLight - [KO] 픽셀에서 광원을 향하는 벡터 [EN] Vector from surface to light source
 * @param N - [KO] 표면 법선 벡터 [EN] Surface normal vector
 * @param V - [KO] 시선 방향 벡터 (Surface-to-Eye) [EN] View direction vector
 * @param shininess - [KO] 광택도 [EN] Shininess (specular power)
 * @param specularSamplerValue - [KO] 스펙큘러 텍스처 샘플링 값 [EN] Specular texture sampled value
 * @param diffuseColor - [KO] 표면의 디퓨즈 색상 [EN] Surface diffuse color
 * @param specularColor - [KO] 표면의 스펙큘러 색상 [EN] Surface specular color
 * @param specularStrength - [KO] 스펙큘러 강도 계수 [EN] Specular strength factor
 * @returns [KO] 계산된 조명 색상 (RGB) [EN] Calculated light color (RGB)
 */
fn getPhongLight(
    lightColor: vec3<f32>,
    lightIntensity: f32,
    surfaceToLight: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    shininess: f32,
    specularSamplerValue: f32,
    diffuseColor: vec3<f32>,
    specularColor: vec3<f32>,
    specularStrength: f32
) -> vec3<f32> {
    let L = normalize(surfaceToLight);
    let R = reflect(-L, N); // [KO] 입사광(-L)을 법선(N) 기준으로 반사 [EN] Reflect incident light (-L) based on normal (N)
    
    let NdotL = max(dot(N, L), 0.0);
    let lambertTerm = NdotL;
    
    // [KO] 스펙큘러 계산 (NdotL이 0보다 클 때만 하이라이트 발생)
    // [EN] Specular calculation (Highlight only occurs when NdotL > 0)
    let specularTerm = pow(max(dot(R, V), 0.0), shininess) * specularSamplerValue * step(0.0, lambertTerm);

    let finalLightColor = lightColor * lightIntensity;
    let diffuseContribution = diffuseColor * finalLightColor * lambertTerm;
    let specularContribution = (specularColor * specularStrength) * finalLightColor * specularTerm;

    return diffuseContribution + specularContribution;
}