/**
 * [KO] 그림자(Shadow) 설정 구조체 정의입니다.
 * [EN] Definition of the Shadow configuration structure.
 */
struct Shadow {
    directionalShadowDepthTextureSize: u32,
    directionalShadowBias: f32,
    directionalShadowStrength: f32,
    padding: f32 // [KO] 16바이트 정렬을 위한 패딩 [EN] Padding for 16-byte alignment
};
