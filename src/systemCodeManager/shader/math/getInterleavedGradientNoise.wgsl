// [KO] Jorge Jimenez의 Interleaved Gradient Noise를 생성합니다. (디더링 및 샘플 회전용 초고속 노이즈)
// [EN] Generates Interleaved Gradient Noise by Jorge Jimenez. (Ultra-fast noise for dithering and sample rotation)
fn getInterleavedGradientNoise(screenCoord: vec2<f32>) -> f32 {
    let magic = vec3<f32>(0.06711056, 0.00583715, 52.9829189);
    return fract(magic.z * fract(dot(screenCoord, magic.xy)));
}
