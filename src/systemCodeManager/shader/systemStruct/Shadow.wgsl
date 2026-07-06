/**
 * [KO] 그림자(Shadow) 설정 구조체 정의입니다.
 * [EN] Definition of the Shadow configuration structure.
 */
struct Shadow {
    directionalShadowDepthTextureSize: u32,
    directionalShadowBias: f32,
    directionalShadowStrength: f32,
    directionalShadowFilterScale: f32
};
