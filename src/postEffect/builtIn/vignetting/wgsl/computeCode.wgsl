// [KO] 1. 원본 텍셀 로드 및 비활성/빈 배경 Early-out
// [EN] 1. Load source texel and early-out for zero intensity or empty background
let index = global_id.xy;
let color = textureLoad(sourceTexture, index, 0);

let intensity = uniforms.intensity;
if (intensity <= 0.0 || color.a == 0.0) {
    textureStore(outputTexture, index, color);
    return;
}

// [KO] 2. 언리얼 엔진 VignetteSpace 대각선 정규화 정원형(Circle) 제곱 반경 산출 (sqrt 불필요)
// [EN] 2. Unreal Engine VignetteSpace diagonal-normalized circular squared radius (zero sqrt)
let dimF = vec2<f32>(textureDimensions(sourceTexture));
let centeredPx = fma(vec2<f32>(index) + 0.5, vec2<f32>(2.0), -dimF);
let r2 = dot(centeredPx, centeredPx) * (2.0 / dot(dimF, dimF));

// [KO] 3. 언리얼 엔진 ComputeVignetteMask 물리 광학 cos^4(theta) 자연 감광 법칙
// [EN] 3. Unreal Engine ComputeVignetteMask physical optical cos^4(theta) natural falloff law
let tan2Angle = r2 * (intensity * intensity);
let invCos2 = 1.0 / (1.0 + tan2Angle);
let vignette = invCos2 * invCos2;

textureStore(outputTexture, index, vec4<f32>(color.rgb * vignette, color.a));
