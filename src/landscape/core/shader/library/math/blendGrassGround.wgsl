/**
 * [KO] 잔디 셰이딩 공통 연산 모듈 (알파 림 필터링, 지면 색상 블렌딩, 상향 노멀, AO)
 * [EN] Common grass shading operation module (alpha rim filtering, ground color blending, upward normal, AO)
 */

const SSS_DISTORTION: f32 = 0.35;
const NORM_225: f32 = 0.44444445;

/**
 * [KO] 잔디 텍스처 가장자리의 어두운 텍셀 림 번짐을 필터링하고 거리 페이드 알파를 적용합니다.
 * [EN] Filters dark texel rim artifacts at grass texture edges and applies distance fade alpha.
 */
fn filterGrassAlpha(baseTex: vec4<f32>, alphaFade: f32) -> f32 {
    let rgbMax = max(baseTex.r, max(baseTex.g, baseTex.b));
    var sourceAlpha = baseTex.a;
    if (sourceAlpha > 0.85 && rgbMax < 0.15) {
        sourceAlpha = clamp((rgbMax - 0.02) / 0.10, 0.0, 1.0);
    }
    return sourceAlpha * alphaFade;
}

/**
 * [KO] 잔디 베이스 컬러에 노출 부스트 및 지형 가상 텍스처(VBT) 지면 색상을 블렌딩합니다.
 * [EN] Blends exposure boost and landscape virtual texture (VBT) ground color into grass base color.
 */
fn blendGrassGroundColor(
    baseColor: vec3<f32>,
    exposureBoost: f32,
    hasGroundTexture: u32,
    groundBlendStrength: f32,
    heightRatio: f32,
    groundColor: vec3<f32>
) -> vec3<f32> {
    let boost = max(0.1, exposureBoost);
    var albedo = baseColor * boost;
    if (hasGroundTexture != 0u && groundBlendStrength > 0.01) {
        let blendFactor = clamp((0.40 - heightRatio) * 2.5, 0.0, 1.0) * groundBlendStrength;
        albedo = mix(albedo, groundColor, blendFactor);
    }
    return albedo;
}

/**
 * [KO] 잔디가 부드러운 반구 라이팅을 받도록 상향(vec3(0, 1, 0)) 노멀로 블렌딩합니다.
 * [EN] Blends normal upward (vec3(0, 1, 0)) for soft hemisphere ambient lighting on grass blades.
 */
fn computeGrassUpwardNormal(vertexNormal: vec3<f32>, heightRatio: f32) -> vec3<f32> {
    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let upwardBlend = mix(0.55, 0.85, heightRatio);
    return normalize(mix(vertexNormal, upVec, upwardBlend));
}

/**
 * [KO] 잔디 정점 높이 비율에 따른 하늘 오클루전(Sky Occlusion) 계수를 계산합니다.
 * [EN] Computes sky occlusion factor based on grass blade height ratio.
 */
fn computeGrassSkyOcclusion(heightRatio: f32) -> f32 {
    return mix(0.65, 1.0, clamp(heightRatio * 1.43, 0.0, 1.0));
}

/**
 * [KO] 잔디 정점 높이 비율에 따른 지면 접촉 앰비언트 오클루전(Contact AO) 계수를 계산합니다.
 * [EN] Computes contact ambient occlusion factor based on grass blade height ratio.
 */
fn computeGrassContactAO(heightRatio: f32) -> f32 {
    return mix(0.40, 1.0, clamp(heightRatio * 4.0, 0.0, 1.0));
}
