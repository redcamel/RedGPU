struct Shadow {
    directionalShadowDepthTextureSize: u32,
    directionalShadowBias: f32,
    padding: vec2<f32> // [KO] 16바이트 정렬을 위한 패딩 [EN] Padding for 16-byte alignment
};