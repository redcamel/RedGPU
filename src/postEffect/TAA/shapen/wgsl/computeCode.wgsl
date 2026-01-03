let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);

if (any(index >= dimensions)) {
    return;
}

// 0 (mip level) 인자를 제거했습니다.
let center = textureLoad(sourceTexture, index).rgb;

// 인접 픽셀 샘플링 시에도 좌표값만 전달 (경계 범위 체크를 위해 clamp 권장)
let left   = textureLoad(sourceTexture, index - vec2<u32>(select(0u, 1u, index.x > 0u), 0u)).rgb;
let right  = textureLoad(sourceTexture, min(index + vec2<u32>(1u, 0u), dimensions - 1u)).rgb;
let up     = textureLoad(sourceTexture, index - vec2<u32>(0u, select(0u, 1u, index.y > 0u))).rgb;
let down   = textureLoad(sourceTexture, min(index + vec2<u32>(0u, 1u), dimensions - 1u)).rgb;

// 1. 밝기(Luma) 계산
let lumaWeight = vec3<f32>(0.299, 0.587, 0.114);
let lCenter = dot(center, lumaWeight);
let lLeft   = dot(left, lumaWeight);
let lRight  = dot(right, lumaWeight);
let lUp     = dot(up, lumaWeight);
let lDown   = dot(down, lumaWeight);

// 2. 주변 대비(Contrast) 분석
let minL = min(lCenter, min(min(lLeft, lRight), min(lUp, lDown)));
let maxL = max(lCenter, max(max(lLeft, lRight), max(lUp, lDown)));
let contrast = maxL - minL;

// 3. 적응형 샤프닝
var finalColor: vec3<f32>;
if (contrast > 0.001) {
    let edge = 4.0 * center - (left + right + up + down);
    let k = uniforms.sharpness * 0.2;
    finalColor = center + edge * k;
} else {
    finalColor = center;
}

textureStore(outputTexture, index, vec4<f32>(max(finalColor, vec3<f32>(0.0)), 1.0));