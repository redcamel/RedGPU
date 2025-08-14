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

// normalRoughnessTexture에서 거칠기 값 추출
let normalReflectionData = textureLoad(normalRoughnessTexture, screenCoord, 0);
let roughness = normalReflectionData.a; // 알파 채널에서 거칠기 값 추출

let viewPos = reconstructViewPosition(screenCoord, depth);
let viewNormal = reconstructViewNormal(screenCoord);

let normalLength = length(viewNormal);
if (normalLength < 0.01) { // 임계값을 매우 낮춤
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

let normal = normalize(viewNormal);
let viewDir = normalize(-viewPos);
let NdotV = dot(normal, viewDir);

// 거칠기 체크를 완화
if (roughness > 1.0) { // 거의 모든 표면 허용
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

// 반사 벡터 계산
let reflectionDir = calculateReflectionRay(viewPos, normal);
let reflection = performRayMarching(viewPos, reflectionDir);

var reflectionColor = vec3<f32>(0.0);
var reflectionAlpha = 0.0;

if (reflection.a > 0.001) {
    reflectionColor = reflection.rgb;
    reflectionAlpha = reflection.a;
}

// 단순화된 프레넬 계산
let F0 = mix(0.04, 0.16, 1.0 - roughness);
let fresnel = pow(1.0 - max(abs(NdotV), 0.0), 2.0);
let fresnelReflectance = F0 + (1.0 - F0) * fresnel;

// 단순화된 반사 강도 계산
let reflectionStrength = reflectionAlpha *
                        uniforms.reflectionIntensity *
                        fresnelReflectance;

let finalReflectionColor = reflectionColor * reflectionStrength;

// 단순한 색상 혼합
let diffuseColor = originalColor.rgb * (1.0 - reflectionStrength);
var finalColor = diffuseColor + finalReflectionColor;

textureStore(outputTexture, screenCoord, vec4<f32>(finalColor, originalColor.a));
