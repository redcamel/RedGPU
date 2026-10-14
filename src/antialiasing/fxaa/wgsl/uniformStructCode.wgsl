struct Uniforms {
    subpix: f32,
    edgeThreshold: f32,
    edgeThresholdMin: f32,
    pad0: f32
};

#redgpu_include color.getLuminance

// [KO] FXAA 3.11 Quality (Preset 29) 가속 엣지 탐색 스텝 테이블
// [EN] FXAA 3.11 Quality (Preset 29) accelerated edge search step table
const FXAA_QUALITY_STEPS = array<f32, 10>(1.0, 1.5, 2.0, 2.0, 2.0, 2.0, 2.0, 4.0, 8.0, 8.0);

/**
 * [KO] 지정된 오프셋의 컬러를 안전하게 로드합니다. (경계 클램핑 포함)
 * [EN] Safely loads color at a specified offset. (Includes boundary clamping)
 */
fn fetchColor4(pos: vec2<i32>, dims: vec2<u32>) -> vec4<f32> {
    let p = clamp(pos, vec2<i32>(0), vec2<i32>(dims) - vec2<i32>(1));
    return textureLoad(sourceTexture, p, 0);
}

