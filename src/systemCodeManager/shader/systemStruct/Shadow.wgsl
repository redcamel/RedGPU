/**
 * [KO] CSM 및 PCSS(Percentage-Closer Soft Shadows) 설정 구조체 정의입니다.
 * [EN] Definition of the Cascaded Shadow Maps and PCSS configuration structure.
 */
struct Shadow {
    cascadeLightViewProjectionMatrices: array<mat4x4<f32>, 4>,
    cascadeSplitDepths: vec4<f32>,
    directionalShadowDepthTextureSize: u32,
    directionalShadowBias: f32,
    directionalShadowStrength: f32,
    pcssLightSize: f32,
    cascadeCount: u32,
    _pad0: f32,
    _pad1: f32,
    _pad2: f32,
};
