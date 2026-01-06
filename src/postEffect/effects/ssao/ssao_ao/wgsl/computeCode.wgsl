// 1. 초기화 및 기본 정보 추출
let screenCoord = vec2<i32>(global_id.xy);
let texSize     = vec2<i32>(textureDimensions(sourceTexture));

// 경계 검사 및 배경(Depth=0) 처리
if (screenCoord.x >= texSize.x || screenCoord.y >= texSize.y) { return; }

let originalColor = textureLoad(sourceTexture, screenCoord);
let depth         = textureLoad(depthTexture, screenCoord, 0);

if (depth < 0.001) {
    textureStore(outputTexture, screenCoord, originalColor);
    return;
}

// 2. View Space 정보 복원 (위치 및 노멀)
let viewPos      = reconstructViewPosition(screenCoord, depth);
let viewNormal   = reconstructViewNormal(textureLoad(gBufferNormalTexture, screenCoord, 0));
let distToCamera = -viewPos.z; // 카메라로부터의 거리 (View Space Z는 음수)

// 3. TBN 매트릭스 생성 (노이즈를 이용한 샘플 회전)
let noiseVec  = getNoiseVec(vec2<f32>(screenCoord));
let tangent   = normalize(noiseVec - viewNormal * dot(noiseVec, viewNormal));
let bitangent = cross(viewNormal, tangent);
let tbn       = mat3x3<f32>(tangent, bitangent, viewNormal);

// 4. 반구형(Hemisphere) 샘플링 데이터
let samples = array<vec3<f32>, 8>(
    vec3<f32>(0.04, 0.03, 0.02),    vec3<f32>(-0.03, 0.05, 0.025),
    vec3<f32>(0.12, -0.08, 0.15),   vec3<f32>(-0.10, -0.09, 0.14),
    vec3<f32>(0.25, 0.20, 0.28),    vec3<f32>(-0.22, 0.26, 0.27),
    vec3<f32>(0.42, -0.38, 0.46),   vec3<f32>(-0.40, -0.39, 0.45)
);

// 5. Occlusion 루프 연산
var totalOcclusion = 0.0;

for (var i = 0u; i < 8u; i++) {
    // [Step A] 샘플 위치 결정 (TBN 회전 + Radius 적용)
    let sampleOffset  = tbn * samples[i];
    let sampleDir     = normalize(sampleOffset);
    let sampleViewPos = viewPos + sampleOffset * uniforms.radius;

    // [Step B] 샘플을 화면 좌표(UV)로 재투영
    let offset   = systemUniforms.projectionMatrix * vec4<f32>(sampleViewPos, 1.0);
    let sampleUV = (offset.xy / offset.w) * vec2<f32>(0.5, -0.5) + 0.5;

    if (sampleUV.x < 0.0 || sampleUV.x > 1.0 || sampleUV.y < 0.0 || sampleUV.y > 1.0) {
        continue;
    }

    // [Step C] 해당 좌표의 실제 깊이값 읽기
    let sampleCoord = vec2<i32>(sampleUV * vec2<f32>(texSize));
    let realDepth   = textureLoad(depthTexture, sampleCoord, 0);
    let realViewPos = reconstructViewPosition(sampleCoord, realDepth);

    // [Step D] 차폐 여부 판정 (Z-Buffer Test)
    // 멀어질수록 Bias를 크게 주어 아티팩트(Self-Shadowing) 방지
    let adaptiveBias = uniforms.bias * (1.0 + distToCamera * uniforms.biasDistanceScale);
    let sampleDist   = length(viewPos - realViewPos);

    if (realViewPos.z > sampleViewPos.z + adaptiveBias) {
        // 급격한 깊이 차이가 나는 배경 등에 대한 예외 처리 (Range Check)
        let rangeCheck = smoothstep(0.0, 1.0, uniforms.radius / max(sampleDist, 0.001));

        // 각도 가중치: 표면 수직 방향에 가까운 샘플일수록 더 강한 차폐
        let angleWeight = max(dot(viewNormal, sampleDir), 0.0);

        totalOcclusion += angleWeight * rangeCheck;
    }
}

// 6. 최종 AO 결과 합성 및 감쇄 처리
let ao = (totalOcclusion / 8.0) * uniforms.intensity;

// 거리에 따른 AO 감쇄 (멀리 있는 물체는 AO를 줄여 노이즈 방지)
let distanceFade = smoothstep(
    uniforms.fadeDistanceStart + uniforms.fadeDistanceRange,
    uniforms.fadeDistanceStart,
    distToCamera
);

// Contrast 및 밝기 반전
var finalAO = saturate(1.0 - (ao * distanceFade));
finalAO = pow(finalAO, uniforms.contrast);

// 7. 결과 저장 (블러용 Raw 데이터 또는 최종 컬러 합성)
// uniforms.useBlur가 켜져 있으면 AO 값만 출력하여 다음 패스(블러)로 넘김
let finalColor = vec4<f32>(
    select(originalColor.rgb * vec3<f32>(finalAO), vec3<f32>(finalAO), uniforms.useBlur > 0.0),
    originalColor.a
);

textureStore(outputTexture, screenCoord, finalColor);
