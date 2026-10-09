/**
 * [KO] 잔디 인스턴스 렌더링용 256바이트 정렬 슬롯 유니폼 구조체 (총 96바이트 / 24 floats 및 uints)
 * [EN] 256-byte aligned slot uniform structure for grass instance rendering (96 bytes total / 24 floats & uints)
 */
struct GrassParams {
    cullingDistance: f32,
    fadeStartDistance: f32,
    meshHeight: f32,
    minY: f32,
    shadowCullDistance: f32,
    shadowFadeStartDistance: f32,
    invMeshHeight: f32,
    invFadeRange: f32,
    groundBlendStrength: f32,
    alphaCutoff: f32,
    hasGroundTexture: u32,
    exposureBoost: f32,
    subsurfaceColor: vec3<f32>,
    subsurfaceStrength: f32,
    roughness: f32,
    shadowStrength: f32,
    receiveShadow: u32,
    farAlphaCutoff: f32,
    shadowCullDistanceSq: f32,
    shadowFadeStartSq: f32,
    invShadowFadeRange: f32,
    padding: u32,
};
