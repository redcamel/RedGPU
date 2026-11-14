// [KO] 1. 중심 픽셀 Green/Alpha 통합 로드 및 빈 배경 Early-out (픽셀당 텍스처 조회 4회 -> 3회 절감)
// [EN] 1. Load center texel Green/Alpha once and early-out for empty background (4 -> 3 texture fetches)
let index = global_id.xy;
let centerTexel = textureLoad(sourceTexture, index, 0);

if (centerTexel.a == 0.0) {
    textureStore(outputTexture, index, centerTexel);
    return;
}

// [KO] 2. 텍셀 중심(+0.5) 정규화 UV 및 대각선(모서리 r=1.0) 기준 정원형(Circle) 반경 r 산출 (DPR 비의존)
// [EN] 2. Calculate texel-center (+0.5) normalized UV and diagonal (corner r=1.0) circular radius r (DPI-independent)
let dimF = vec2<f32>(textureDimensions(sourceTexture));
let invSize = 1.0 / dimF;
let texelPos = vec2<f32>(index) + 0.5;
let uv = texelPos * invSize;
let offset = uv - vec2<f32>(0.5);

let invDiag = 2.0 / length(dimF);
let coord = (texelPos - dimF * 0.5) * invDiag;
let r = length(coord);

// [KO] 3. 언리얼 엔진 StartOffset 보호 영역 검사 및 C1 연속(t^2) 색수차 오프셋 산출
// [EN] 3. Unreal Engine StartOffset protection check and C1 continuous (t^2) chromatic aberration offset
let startOffset = uniforms.startOffset;
if (r <= startOffset) {
    textureStore(outputTexture, index, centerTexel);
    return;
}

let intensity = uniforms.intensity;
let t = saturate((r - startOffset) / (1.0 - startOffset));
let mask = t * t;
let shift = offset * (mask * intensity * 0.05);

let redUV = clamp(uv - shift, vec2<f32>(0.0), vec2<f32>(1.0));
let blueUV = clamp(uv + shift, vec2<f32>(0.0), vec2<f32>(1.0));

// [KO] 4. 하드웨어 선형 샘플링(Red, Blue) 및 중심 Green/Alpha 합성
// [EN] 4. Hardware linear sampling (Red, Blue) and composition with center Green/Alpha
let rChannel = textureSampleLevel(sourceTexture, basicSampler, redUV, 0.0).r;
let bChannel = textureSampleLevel(sourceTexture, basicSampler, blueUV, 0.0).b;

textureStore(outputTexture, index, vec4<f32>(rChannel, centerTexel.g, bChannel, centerTexel.a));
