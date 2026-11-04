// [KO] 1. 텍셀 중심(+0.5) 정규화 UV 및 광축 정중앙(0.5) 기준 오프셋 산출 (DPR 비의존)
// [EN] 1. Calculate texel-center (+0.5) normalized UV and optical center (0.5) offset (DPI-independent)
let index = global_id.xy;
let distortion = uniforms.distortion;
let dimF = vec2<f32>(textureDimensions(sourceTexture));
let invSize = 1.0 / dimF;

let uv = (vec2<f32>(index) + 0.5) * invSize;
let offset = uv - vec2<f32>(0.5);

// [KO] 2. 화면 해상도 장축(max) 기준 정원형(Circle) 방사 반경 제곱 산출 (sqrt 불필요)
// [EN] 2. Calculate circular squared radial distance based on major axis (max) (zero sqrt)
let aspect = dimF / max(dimF.x, dimF.y);
let radialOffset = offset * aspect;
let distSq = dot(radialOffset, radialOffset);

// [KO] 3. 배럴 왜곡 시 외곽 검은 여백 방지를 위한 자동 오버스캔(Auto-Overscan) 스케일 정규화 및 선형 샘플링
// [EN] 3. Auto-overscan scale normalization to prevent black borders on barrel distortion and linear sampling
let r2Corner = 0.25 * dot(aspect, aspect);
let invOverscan = 1.0 / fma(max(distortion, 0.0), r2Corner, 1.0);
let distortionFactor = fma(distortion, distSq, 1.0) * invOverscan;
let distortedUV = clamp(fma(offset, vec2<f32>(distortionFactor), vec2<f32>(0.5)), vec2<f32>(0.0), vec2<f32>(1.0));

let sampledColor = textureSampleLevel(sourceTexture, basicSampler, distortedUV, 0.0);
textureStore(outputTexture, index, sampledColor);
