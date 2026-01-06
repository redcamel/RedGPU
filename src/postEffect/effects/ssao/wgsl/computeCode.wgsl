let screenCoord = vec2<i32>(global_id.xy);
let texSize = vec2<i32>(textureDimensions(sourceTexture));

if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) { return; }

let originalColor = textureLoad(sourceTexture, screenCoord);
let depth = textureLoad(depthTexture, screenCoord, 0);

if (depth >= 0.9999) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

let viewPos = reconstructViewPosition(screenCoord, depth);
let viewNormal = reconstructViewNormal(textureLoad(gBufferNormalTexture, screenCoord, 0));

// 노이즈를 이용한 TBN 행렬 구성 (지글거리는 패턴 분산)
let noiseVec = getNoiseVec(vec2<f32>(screenCoord));
let tangent = normalize(noiseVec - viewNormal * dot(noiseVec, viewNormal));
let bitangent = cross(viewNormal, tangent);
let tbn = mat3x3<f32>(tangent, bitangent, viewNormal);

// 샘플 분포 최적화 (가까운 곳에 더 많은 샘플 배치)
// 기존 0.1~0.9 대신, 0.05~0.6 정도로 범위를 좁히고 안쪽으로 밀집시킵니다.
let samples = array<vec3<f32>, 8>(
    vec3<f32>(0.05, 0.05, 0.02),   vec3<f32>(-0.05, 0.1, 0.05),
    vec3<f32>(0.15, -0.05, 0.1),   vec3<f32>(-0.15, -0.15, 0.15),
    vec3<f32>(0.25, 0.3, 0.2),    vec3<f32>(-0.2, 0.4, 0.3),
    vec3<f32>(0.5, -0.1, 0.4),    vec3<f32>(-0.4, -0.3, 0.5)
);

var occlusion = 0.0;
for (var i = 0u; i < 8u; i++) {
    let sampleDir = tbn * samples[i];
    let sampleViewPos = viewPos + sampleDir * uniforms.radius;

    // 투영 시 w값이 0에 가까운지 체크 (안정성)
    let offset = systemUniforms.projectionMatrix * vec4<f32>(sampleViewPos, 1.0);
    var sampleUV = (offset.xy / offset.w) * vec2<f32>(0.5, -0.5) + 0.5;

    // UV가 화면 밖으로 나가는 경우 처리
    if (any(sampleUV < vec2<f32>(0.0)) || any(sampleUV > vec2<f32>(1.0))) {
        continue;
    }

    let sampleCoord = vec2<i32>(sampleUV * vec2<f32>(texSize));
    let realDepth = textureLoad(depthTexture, sampleCoord, 0);
    let realViewPos = reconstructViewPosition(sampleCoord, realDepth);

    // [중요] Range Check 로직 개선
   let distDiff = abs(viewPos.z - realViewPos.z);
   // 거리가 멀어질수록 가중치를 급격히 줄여 '노이즈 튀는 현상'을 방지
   let rangeCheck = smoothstep(0.0, 1.0, uniforms.radius / (distDiff + 0.001));

   // bias를 조금 더 넉넉히 주어 평면에서의 노이즈를 제거
   if (realViewPos.z >= sampleViewPos.z + uniforms.bias) {
       occlusion += 1.0 * rangeCheck;
   }
}

// 최종 AO 적용
let aoFactor = 1.0 - (occlusion / 8.0) * uniforms.intensity;
let finalColor = vec4<f32>(originalColor.rgb * saturate(aoFactor), originalColor.a);

textureStore(outputTexture, screenCoord, finalColor);
