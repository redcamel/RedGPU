/**
 * [KO] 방향성 광원의 그림자 가시성(Visibility)을 계산합니다.
 * [EN] Calculates the shadow visibility for a directional light.
 *
 * @param directionalShadowMap [KO] 방향성 광원용 깊이 텍스처 [EN] Depth texture for directional light
 * @param directionalShadowMapSampler [KO] 비교 샘플러 [EN] Comparison sampler
 * @param shadowDepthTextureSize [KO] 그림자 텍스처의 크기 [EN] Size of the shadow texture
 * @param bias [KO] 그림자 바이어스 [EN] Shadow bias
 * @param shadowCoord [KO] [0, 1] 범위로 변환된 그림자 좌표 (shadow.getShadowCoord 결과값) [EN] Shadow coordinates transformed to [0, 1] range (result of shadow.getShadowCoord)
 * @returns [KO] 가시성 계수 (0.0 ~ 1.0) [EN] Visibility factor (0.0 ~ 1.0)
 */
// 의사 난수(Pseudo-random) 회전 각도를 얻는 헬퍼 함수
fn getShadowRandomAngle(co: vec2<f32>) -> f32 {
    return fract(sin(dot(co, vec2<f32>(12.9898, 78.233))) * 43758.5453) * 6.28318530718;
}

fn getDirectionalShadowVisibility(
   directionalShadowMap: texture_depth_2d,
   directionalShadowMapSampler: sampler_comparison,
   shadowDepthTextureSize: u32,
   bias: f32,
   shadowCoord: vec3<f32>
) -> f32 {
    let oneOverShadowDepthTextureSize = 1.0 / f32(shadowDepthTextureSize);
    let shadowDepth = clamp(shadowCoord.z, 0.0, 1.0);

    // 12-Sample Poisson Disk 패턴 선언
    var poissonDisk = array<vec2<f32>, 12>(
        vec2<f32>(-0.171104, -0.635832),
        vec2<f32>(-0.580224, -0.171168),
        vec2<f32>(-0.03816, -0.07152),
        vec2<f32>(0.569424, -0.121344),
        vec2<f32>(0.134016, 0.638592),
        vec2<f32>(-0.320496, 0.490896),
        vec2<f32>(-0.814272, 0.428544),
        vec2<f32>(-0.18048, -0.960288),
        vec2<f32>(0.395376, -0.612144),
        vec2<f32>(0.741024, 0.421296),
        vec2<f32>(0.320112, 0.175152),
        vec2<f32>(-0.596064, -0.73032)
    );

    var visibility: f32 = 0.0;
    
    // 그림자 필터 번짐 반경 스케일 (지터링 도입으로 4.0 수준에서도 매우 우수한 소프트 섀도우를 연출함)
    let filterScale = 3.0;

    // 픽셀 스크린 공간 좌표 기반으로 무작위 회전 각도 계산
    let randomAngle = getShadowRandomAngle(shadowCoord.xy * 1000.0);
    let cosAngle = cos(randomAngle);
    let sinAngle = sin(randomAngle);
    let rotationMatrix = mat2x2<f32>(cosAngle, -sinAngle, sinAngle, cosAngle);

    // Poisson Disk 샘플링 루프 순회
    for (var i = 0; i < 12; i++) {
        // 포아송 오프셋을 랜덤 각도로 회전
        let rotatedOffset = rotationMatrix * poissonDisk[i];
        let offset = rotatedOffset * oneOverShadowDepthTextureSize * filterScale;
        let tUV = shadowCoord.xy + offset;

        // textureSampleCompare는 Uniform Control Flow 규격을 유지하기 위해 분기문 밖에서 실행
        let sampleVisibility = textureSampleCompare(
            directionalShadowMap,
            directionalShadowMapSampler,
            tUV,
            shadowDepth - bias
        );

        // 범위 밖의 영역은 그림자 가시성을 1.0으로 고정 (select 함수 사용)
        let outOfBounds = tUV.x < 0.0 || tUV.x > 1.0 || tUV.y < 0.0 || tUV.y > 1.0;
        visibility += select(sampleVisibility, 1.0, outOfBounds);
    }

    visibility /= 12.0;

    // 라이트 프러스트럼 범위 밖(Near/Far plane 너머)인 경우 가시성 1.0 반환
    let invalidDepth = shadowCoord.z < 0.0 || shadowCoord.z > 1.0;
    return select(visibility, 1.0, invalidDepth);
}
