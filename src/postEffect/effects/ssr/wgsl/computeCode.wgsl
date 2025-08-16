let screenCoord = vec2<i32>(global_id.xy);
let texDims = textureDimensions(sourceTexture);
let texSize = vec2<i32>(texDims);

if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) {
    return;
}

let originalColor = textureLoad(sourceTexture, screenCoord);
let depth = textureLoad(depthTexture, screenCoord, 0);

if (depth >= 0.999) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

let gBufferNormalData = textureLoad(gBufferNormalTexture, screenCoord, 0);
let gBufferMetalData = textureLoad(gBufferMetalTexture, screenCoord, 0);

// 이미 계산된 반사 강도 사용
let precomputedReflectionStrength = gBufferMetalData.r;

// 임계값 체크 (훨씬 단순함)
//if (precomputedReflectionStrength < 0.05) {
//    textureStore(outputTexture, screenCoord, originalColor);
//    return;
//}

let worldPos = reconstructWorldPosition(screenCoord, depth);
let worldNormal = reconstructWorldNormal(gBufferNormalData);

let normalLength = length(worldNormal);
//if (normalLength < 0.01) {
//    textureStore(outputTexture, screenCoord, originalColor);
//    return;
//}

let normal = normalize(worldNormal);
let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;

// 픽셀 좌표 기반 지터 생성
let jitter = generatePixelJitter(screenCoord);

let reflectionDir = calculateWorldReflectionRay(worldPos, normal, cameraWorldPos);
let reflection = performWorldRayMarching(worldPos, reflectionDir, jitter);

var reflectionColor = vec3<f32>(0.0);
var reflectionAlpha = 0.0;

if (reflection.a > 0.001) {
    reflectionColor = reflection.rgb;
    reflectionAlpha = reflection.a;
}

// 최종 반사 계산 (매우 단순함)
let finalReflectionStrength = reflectionAlpha *
                             uniforms.reflectionIntensity *
                             precomputedReflectionStrength;

let finalReflectionColor = reflectionColor * finalReflectionStrength;
let diffuseColor = originalColor.rgb * (1.0 - finalReflectionStrength);
var finalColor = diffuseColor + finalReflectionColor;

textureStore(outputTexture, screenCoord, vec4<f32>(finalColor, originalColor.a));
