// 기본 설정
let pixelCoord = vec2<f32>(global_id.xy) + vec2<f32>(0.5);
let textureSizeF = vec2<f32>(textureDimensions(sourceTexture));
let pixelIndex = vec2<u32>(global_id.xy);

if (any(pixelCoord >= textureSizeF)) { return; }

let currentFrameColor = textureLoad(sourceTexture, pixelIndex).rgb;

if (uniforms.frameIndex < 3.0) {
    textureStore(outputTexture, pixelIndex, vec4<f32>(currentFrameColor, 1.0));
    return;
}

// ==== Float 기반 정확한 이웃 샘플링 ====
let neighborOffsetsF = array<vec2<f32>, 5>(
    vec2<f32>(-1.0, 0.0),   // 왼쪽
    vec2<f32>( 1.0, 0.0),   // 오른쪽
    vec2<f32>( 0.0, -1.0),  // 위
    vec2<f32>( 0.0,  1.0),  // 아래
    vec2<f32>( 0.0,  0.0)   // 중심
);

var neighborColors: array<vec3<f32>, 5>;
var neighborLumas: array<f32, 5>;

for (var i = 0; i < 5; i++) {
    let neighborCoordF = pixelCoord + neighborOffsetsF[i];
    let clampedCoordF = clamp(neighborCoordF, vec2<f32>(0.5), textureSizeF - vec2<f32>(0.5));
    let neighborIdx = vec2<u32>(clampedCoordF - vec2<f32>(0.5));
    let neighborColor = textureLoad(sourceTexture, neighborIdx).rgb;
    neighborColors[i] = neighborColor;
    neighborLumas[i] = dot(neighborColor, vec3<f32>(0.299, 0.587, 0.114));
}

// ==== 정확한 에지 검출 ====
let centerLuma = neighborLumas[4];
let edgeStrength = (abs(neighborLumas[0] - centerLuma) +
                   abs(neighborLumas[1] - centerLuma) +
                   abs(neighborLumas[2] - centerLuma) +
                   abs(neighborLumas[3] - centerLuma)) * 0.25;

let horizontalGradient = abs(neighborLumas[1] - neighborLumas[0]) * 0.5;
let verticalGradient = abs(neighborLumas[3] - neighborLumas[2]) * 0.5;
let gradientStrength = sqrt(horizontalGradient * horizontalGradient + verticalGradient * verticalGradient);

let combinedEdgeStrength = max(edgeStrength, gradientStrength);
let isEdge = combinedEdgeStrength > 0.08;

// ==== 모션 벡터 및 바이리니어 샘플링 ====
let motionVector = textureLoad(motionVectorTexture, pixelIndex, 0).xy;
let motionMagnitude = length(motionVector);

let previousPixelCoordF = pixelCoord - motionVector * textureSizeF;
let texBounds = textureSizeF - vec2<f32>(0.5);
let clampedPrevCoordF = clamp(previousPixelCoordF, vec2<f32>(0.5), texBounds);

let baseCoordF = floor(clampedPrevCoordF - vec2<f32>(0.5));
let fractionalPart = clampedPrevCoordF - (baseCoordF + vec2<f32>(0.5));

let maxIndexF = textureSizeF - vec2<f32>(1.0);
let coord00F = clamp(baseCoordF, vec2<f32>(0.0), maxIndexF);
let coord10F = clamp(baseCoordF + vec2<f32>(1.0, 0.0), vec2<f32>(0.0), maxIndexF);
let coord01F = clamp(baseCoordF + vec2<f32>(0.0, 1.0), vec2<f32>(0.0), maxIndexF);
let coord11F = clamp(baseCoordF + vec2<f32>(1.0, 1.0), vec2<f32>(0.0), maxIndexF);

let coord00 = vec2<u32>(coord00F);
let coord10 = vec2<u32>(coord10F);
let coord01 = vec2<u32>(coord01F);
let coord11 = vec2<u32>(coord11F);

// ==== 이전 소스 텍스처 샘플링 (모션 감지용) ====
let prevSource00 = textureLoad(previousSourceTexture, coord00).rgb;
let prevSource10 = textureLoad(previousSourceTexture, coord10).rgb;
let prevSource01 = textureLoad(previousSourceTexture, coord01).rgb;
let prevSource11 = textureLoad(previousSourceTexture, coord11).rgb;

let prevSource0 = mix(prevSource00, prevSource10, fractionalPart.x);
let prevSource1 = mix(prevSource01, prevSource11, fractionalPart.x);
let previousSourceColor = mix(prevSource0, prevSource1, fractionalPart.y);

// ==== 이전 누적 프레임 샘플링 (최종 블렌딩용) ====
let prevFrame00 = textureLoad(previousFrameTexture, coord00).rgb;
let prevFrame10 = textureLoad(previousFrameTexture, coord10).rgb;
let prevFrame01 = textureLoad(previousFrameTexture, coord01).rgb;
let prevFrame11 = textureLoad(previousFrameTexture, coord11).rgb;

let prevFrame0 = mix(prevFrame00, prevFrame10, fractionalPart.x);
let prevFrame1 = mix(prevFrame01, prevFrame11, fractionalPart.x);
let previousFrameColor = mix(prevFrame0, prevFrame1, fractionalPart.y);

// ==== 소스 기반 모션/변화 감지 ====
let sourceColorDistance = distance(currentFrameColor, previousSourceColor);
let sourceLumaDistance = abs(dot(currentFrameColor, vec3<f32>(0.299, 0.587, 0.114)) -
                            dot(previousSourceColor, vec3<f32>(0.299, 0.587, 0.114)));

// 순수 소스 비교로 더 정확한 변화 감지
let isSignificantChange = sourceColorDistance > 0.15 || sourceLumaDistance > 0.1;
let changeIntensity = saturate(sourceColorDistance * 4.0);

// ==== 이웃 클램핑 ====
var minColor = neighborColors[4];
var maxColor = neighborColors[4];

for (var i = 0; i < 4; i++) {
    minColor = min(minColor, neighborColors[i]);
    maxColor = max(maxColor, neighborColors[i]);
}

if (isEdge) {
    let expansion = 0.1 + combinedEdgeStrength * 0.15;
    let range = maxColor - minColor;
    minColor -= range * expansion;
    maxColor += range * expansion;
}

let clampedPreviousFrame = clamp(previousFrameColor, minColor, maxColor);

// ==== 소스 비교 기반 블렌딩 팩터 계산 ====
var temporalBlendRatio = uniforms.temporalBlendFactor;

// 1. 에지 강도에 따른 조정
if (isEdge) {
    let edgeFactor = saturate(combinedEdgeStrength * 8.0);
    temporalBlendRatio *= (1.5 + edgeFactor);
}

// 2. 소스 기반 변화 감지에 따른 조정
if (isSignificantChange) {
    // 소스 간 변화가 클수록 현재 프레임 가중치 증가
    temporalBlendRatio += changeIntensity * 0.35;
}

// 3. 모션 벡터 강도에 따른 조정
if (motionMagnitude > 0.001) {
    let motionFactor = saturate(motionMagnitude * uniforms.motionVectorIntensity);
    temporalBlendRatio += motionFactor * 0.3;
}

// 4. 정적이고 평탄한 영역에서는 보수적 접근
if (!isEdge && !isSignificantChange && motionMagnitude < 0.001) {
    temporalBlendRatio *= 0.4;
}

temporalBlendRatio = clamp(temporalBlendRatio, 0.02, 0.75);

// ==== 최종 블렌딩 (단순화) ====
var finalColor = mix(clampedPreviousFrame, currentFrameColor, temporalBlendRatio);

// ==== 에지 디테일 보존 (소스 정보 활용) ====
if (isEdge && combinedEdgeStrength > 0.12) {
    let centerAvg = (neighborColors[0] + neighborColors[1] +
                     neighborColors[2] + neighborColors[3]) * 0.25;
    let currentDetail = currentFrameColor - centerAvg;
    let currentDetailStrength = length(currentDetail);

    if (currentDetailStrength > 0.02) {
        // 소스 변화량이 클수록 디테일 보존 강화
        let detailPreservation = 0.15 + changeIntensity * 0.2;
        let restoration = currentDetail * detailPreservation * (1.0 - temporalBlendRatio * 0.7);
        finalColor += restoration;
    }
}

textureStore(outputTexture, pixelIndex, vec4<f32>(finalColor, 1.0));
