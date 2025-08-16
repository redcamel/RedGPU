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

// gBufferNormalTexture에서 거칠기 값 추출
let gBufferNormalData = textureLoad(gBufferNormalTexture, screenCoord, 0);
let gBufferRoughnessData = textureLoad(gBufferRoughnessTexture, screenCoord, 0);
let roughness = gBufferRoughnessData.r;

let worldPos = reconstructWorldPosition(screenCoord, depth);
let worldNormal = reconstructWorldNormal(gBufferNormalData);

let normalLength = length(worldNormal);
if (normalLength < 0.01) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

let normal = normalize(worldNormal);
let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;
let viewDir = normalize(cameraWorldPos - worldPos);
let NdotV = dot(normal, viewDir);

// 거칠기 체크를 완화
if (roughness > 1.0) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

// 지터링을 위한 지터 오프셋 계산
let spatialJitter = generateBlueNoiseJitter(screenCoord, uniforms.frameCount);
let screenUV = (vec2<f32>(screenCoord) + 0.5) / vec2<f32>(texDims);

// 적응적 지터 강도 계산 (screenCoord도 전달)
let adaptiveJitterStrength = calculateAdaptiveJitterStrength(normal, screenUV, screenCoord);
let scaledJitterOffset = spatialJitter * adaptiveJitterStrength;

// 월드 공간에서 지터링된 반사 벡터 계산
let reflectionDir = calculateWorldReflectionRay(worldPos, normal, cameraWorldPos, scaledJitterOffset);
let reflection = performWorldRayMarching(worldPos, reflectionDir);

var reflectionColor = vec3<f32>(0.0);
var reflectionAlpha = 0.0;

if (reflection.a > 0.001) {
    reflectionColor = reflection.rgb;
    reflectionAlpha = reflection.a;
}

// 향상된 프레넬 계산 (물리 기반)
let F0 = mix(0.04, 0.16, 1.0 - roughness);
let cosTheta = max(abs(NdotV), 0.0);
let fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);

// 거칠기에 따른 반사 강도 조절
let roughnessFactor = max(0.16, 1.0 - roughness);
let distanceFromEdge = calculateEdgeFade(screenUV);


let reflectionStrength = reflectionAlpha *
                        uniforms.reflectionIntensity *
                        fresnel *
                        roughnessFactor *
                        distanceFromEdge;

let finalReflectionColor = reflectionColor * reflectionStrength;

// 에너지 보존을 위한 색상 혼합
let energyConservation = 1.0 - reflectionStrength * 0.8;
let diffuseColor = originalColor.rgb * energyConservation;
var finalColor = diffuseColor + finalReflectionColor;

textureStore(outputTexture, screenCoord, vec4<f32>(finalColor, originalColor.a));
