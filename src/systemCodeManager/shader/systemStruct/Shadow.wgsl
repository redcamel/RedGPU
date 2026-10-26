/**
 * [KO] CSM(Cascaded Shadow Maps) 설정 구조체 정의입니다.
 * [EN] Definition of the Cascaded Shadow Maps (CSM) configuration structure.
 */
struct Shadow {
    cascadeLightViewProjectionMatrices: array<mat4x4<f32>, 4>,
    cascadeSplitDepths: vec4<f32>,
    directionalShadowDepthTextureSize: u32,
    directionalShadowBias: f32,
    directionalShadowStrength: f32,
    cascadeCount: u32,
    cascadeTexelSizes: vec4<f32>,
    casterBoundingCenter: vec3<f32>,
    casterBoundingRadiusSq: f32,
};
