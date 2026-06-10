// [KO] 1. 인덱스 및 정규화된 UV 계산
// [EN] 1. Index and normalized UV calculation
let dimensions = textureDimensions(sourceTexture);
let dimF = vec2<f32>(dimensions);
let invSize = 1.0 / dimF;

let index = global_id.xy;
let uv = vec2<f32>(index) / dimF;

// [KO] 2. 중심(0.5)으로부터의 거리 기반 비네팅 계수 산출
// [EN] 2. Calculate vignette factor based on distance from center (0.5)
// [KO] 사용자 오프셋(DPR 반영)을 적용하여 동적 중심점 계산
// [EN] Calculate dynamic center point by applying user offset (DPR reflected)
let uvCenter = vec2<f32>(0.5) + vec2<f32>(uniforms.centerX, uniforms.centerY) * systemUniforms.devicePixelRatio * invSize;

let smoothness = uniforms.smoothness;
let size = uniforms.size;

var color: vec4<f32> = textureLoad(sourceTexture, index, 0);
var diff = size - distance(uv, uvCenter);

// [KO] smoothstep을 이용한 부드러운 감쇠 곡선 생성
// [EN] Create smooth falloff curve using smoothstep
let vignette = smoothstep(-smoothness, smoothness, diff);

// [KO] 3. 컬러 합성 및 최종 저장
// [EN] 3. Color composition and final storage
color = vec4<f32>(color.rgb * vignette, color.a);
textureStore(outputTexture, index, color);
