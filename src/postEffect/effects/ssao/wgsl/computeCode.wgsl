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

// 카메라와의 거리 계산
let distToCamera = -viewPos.z;

// 노이즈 기반 TBN 생성
let noiseVec = getNoiseVec(vec2<f32>(screenCoord));
let tangent = normalize(noiseVec - viewNormal * dot(noiseVec, viewNormal));
let bitangent = cross(viewNormal, tangent);
let tbn = mat3x3<f32>(tangent, bitangent, viewNormal);

// 반구 내부에 분포된 샘플 (중심 근처에 더 많이, 외곽으로 갈수록 적게)
let samples = array<vec3<f32>, 16>(
    vec3<f32>(0.033, 0.021, 0.015),   vec3<f32>(-0.025, 0.038, 0.012),
    vec3<f32>(0.042, -0.031, 0.028),  vec3<f32>(-0.047, -0.019, 0.035),
    vec3<f32>(0.098, 0.067, 0.112),   vec3<f32>(-0.089, 0.105, 0.098),
    vec3<f32>(0.115, -0.092, 0.128),  vec3<f32>(-0.108, -0.098, 0.135),
    vec3<f32>(0.221, 0.178, 0.245),   vec3<f32>(-0.198, 0.235, 0.221),
    vec3<f32>(0.245, -0.205, 0.268),  vec3<f32>(-0.238, -0.212, 0.278),
    vec3<f32>(0.412, 0.368, 0.445),   vec3<f32>(-0.398, 0.425, 0.421),
    vec3<f32>(0.445, -0.398, 0.468),  vec3<f32>(-0.432, -0.405, 0.478)
);

var totalOcclusion = 0.0;

for (var i = 0u; i < 16u; i++) {
    let sampleOffset = tbn * samples[i];
    let sampleDir = normalize(sampleOffset);
    let sampleViewPos = viewPos + sampleOffset * uniforms.radius;

    let offset = systemUniforms.projectionMatrix * vec4<f32>(sampleViewPos, 1.0);
    let sampleUV = (offset.xy / offset.w) * vec2<f32>(0.5, -0.5) + 0.5;

    // 화면 밖 샘플은 건너뛰기
    if (sampleUV.x < 0.0 || sampleUV.x > 1.0 || sampleUV.y < 0.0 || sampleUV.y > 1.0) {
        continue;
    }

    let sampleCoord = vec2<i32>(sampleUV * vec2<f32>(texSize));

    let realDepth = textureLoad(depthTexture, sampleCoord, 0);
    let realViewPos = reconstructViewPosition(sampleCoord, realDepth);

    // 거리 기반 적응형 bias
    let adaptiveBias = uniforms.bias * (1.0 + distToCamera * uniforms.biasDistanceScale);

    // 3D 거리 계산
    let sampleDist = length(viewPos - realViewPos);

    // Z 깊이 비교: 샘플 위치가 실제 지오메트리 뒤에 있으면(가려지면) occlusion
    // View Space에서 -Z 방향이 카메라 앞이므로, realViewPos.z가 더 크면(덜 음수) 샘플이 가려진 것
    if (realViewPos.z > sampleViewPos.z + adaptiveBias) {
        // Range check: 샘플이 radius 범위 내에 있을 때만 기여
        let rangeCheck = smoothstep(0.0, 1.0, uniforms.radius / max(sampleDist, 0.001));

        // 각도 가중치: 표면에 평행한 샘플일수록 영향 감소
        let angleWeight = max(dot(viewNormal, sampleDir), 0.0);

        totalOcclusion += angleWeight * rangeCheck;
    }
}

// 최종 AO 계산
let ao = (totalOcclusion / 16.0) * uniforms.intensity;

// 거리에 따른 부드러운 감쇄 (설정 가능한 파라미터 사용)
let distanceFade = smoothstep(
    uniforms.fadeDistanceStart + uniforms.fadeDistanceRange,
    uniforms.fadeDistanceStart,
    distToCamera
);

var finalAO = saturate(1.0 - (ao * distanceFade));
finalAO = pow(finalAO, uniforms.contrast);

let finalColor = vec4<f32>(originalColor.rgb * finalAO, originalColor.a);
textureStore(outputTexture, screenCoord, finalColor);
