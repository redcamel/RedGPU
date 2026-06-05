// [KO] 1. 인덱스 및 정규화된 UV 좌표 계산
// [EN] 1. Index and normalized UV coordinate calculation
let index = global_id.xy;
let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

let uv = vec2<f32>(index) / vec2<f32>(dimW, dimH);
let invSize = 1.0 / vec2<f32>(dimensions);

// [KO] 화면 중앙(0.5)을 기준으로 픽셀 오프셋(DPR 반영)을 더해 최종 중심점 계산
// [EN] Calculate final center point by adding pixel offset (DPR reflected) to screen center (0.5)
let center = vec2<f32>(0.5) + vec2<f32>(uniforms.centerX, uniforms.centerY) * systemUniforms.devicePixelRatio * invSize;

// [KO] 2. 중심으로부터의 거리 및 왜곡량 계산
// [EN] 2. Calculate distance from center and distortion amount
let offset = uv - center;
let distance = length(offset);
let distortion = uniforms.strength * pow(distance, uniforms.falloff);

// [KO] 3. 각 채널별 오프셋 UV 산출
// [EN] 3. Calculate offset UV for each channel
let redOffset = uv + offset * distortion * vec2<f32>(-1.0, -1.0);
let greenOffset = uv;
let blueOffset = uv + offset * distortion * vec2<f32>(1.0, 1.0);

// [KO] 4. 하드웨어 선형 샘플링을 통한 부드러운 채널 합성
// [EN] 4. Smooth channel composition via hardware linear sampling
var finalColor: vec3<f32>;
finalColor.r = textureSampleLevel(sourceTexture, basicSampler, redOffset, 0.0).r;
finalColor.g = textureSampleLevel(sourceTexture, basicSampler, greenOffset, 0.0).g;
finalColor.b = textureSampleLevel(sourceTexture, basicSampler, blueOffset, 0.0).b;

// [KO] 5. 원본 알파 보존 및 최종 저장
// [EN] 5. Preserve original alpha and final storage
let originalAlpha = textureLoad(sourceTexture, index, 0).a;
textureStore(outputTexture, index, vec4<f32>(finalColor, originalAlpha));
