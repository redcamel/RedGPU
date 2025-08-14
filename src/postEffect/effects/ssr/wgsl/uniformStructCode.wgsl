struct Uniforms {
    maxSteps: u32,
    maxDistance: f32,
    stepSize: f32,
    thickness: f32,
    reflectionIntensity: f32,
    fadeDistance: f32,
    edgeFade: f32,
    _padding: f32,
}

fn reconstructViewPosition(screenCoord: vec2<i32>, depth: f32) -> vec3<f32> {
    let texDims = textureDimensions(depthTexture);
    let texSize = vec2<f32>(texDims);
    let uv = (vec2<f32>(screenCoord) + vec2<f32>(0.5)) / texSize;

    // NDC 좌표 계산
    let ndc = vec3<f32>(
        uv * 2.0 - vec2<f32>(1.0),  // xy: 0-1 -> -1~1
        depth          // z: 0-1 -> -1~1
    );

    // 클립 공간에서 뷰 공간으로 변환
    let clipPos = vec4<f32>(ndc, 1.0);
    let viewPos4 = systemUniforms.inverseProjectionMatrix * clipPos;

    // 수치적 안정성 개선
    let w = max(abs(viewPos4.w), 1e-6);
    return viewPos4.xyz / w;
}

// 개선된 노멀 복원 - 올바른 방향 보장
fn reconstructViewNormal(screenCoord: vec2<i32>) -> vec3<f32> {
    let texDims = textureDimensions(depthTexture);
    let texSize = vec2<i32>(texDims);

    let x = screenCoord.x;
    let y = screenCoord.y;
    let maxX = texSize.x - 1;
    let maxY = texSize.y - 1;

    // 중앙 차분법을 사용한 그래디언트 계산
    let depthL = textureLoad(depthTexture, vec2<i32>(max(0, x - 1), y), 0);
    let depthR = textureLoad(depthTexture, vec2<i32>(min(maxX, x + 1), y), 0);
    let depthT = textureLoad(depthTexture, vec2<i32>(x, max(0, y - 1)), 0);
    let depthB = textureLoad(depthTexture, vec2<i32>(x, min(maxY, y + 1)), 0);

    // 뷰 포지션으로 변환
    let viewPosL = reconstructViewPosition(vec2<i32>(max(0, x - 1), y), depthL);
    let viewPosR = reconstructViewPosition(vec2<i32>(min(maxX, x + 1), y), depthR);
    let viewPosT = reconstructViewPosition(vec2<i32>(x, max(0, y - 1)), depthT);
    let viewPosB = reconstructViewPosition(vec2<i32>(x, min(maxY, y + 1)), depthB);

    // 그래디언트 벡터
    let dx = viewPosR - viewPosL;
    let dy = viewPosB - viewPosT;

    // 노멀 계산 - 올바른 방향 보장
    let rawNormal = normalize(cross(dx, dy));
    let normalLength = length(rawNormal);

    if (normalLength < 1e-6) {
        // fallback: 카메라를 향하는 노멀
        let viewPos = reconstructViewPosition(screenCoord, textureLoad(depthTexture, screenCoord, 0));
        return normalize(-viewPos);
    }

    // 노멀이 카메라를 향하도록 보장
    let viewPos = reconstructViewPosition(screenCoord, textureLoad(depthTexture, screenCoord, 0));
    let viewDir = normalize(-viewPos);

    // 노멀이 카메라 반대쪽을 향하면 뒤집기
    if (dot(rawNormal, viewDir) < 0.0) {
        return -rawNormal;
    }

    return rawNormal;
}

// 재질의 기본 반사율 추정
fn estimateMaterialReflectance(color: vec3<f32>) -> f32 {
    let luminance = dot(color, vec3<f32>(0.299, 0.587, 0.114));
    let metallic = smoothstep(0.2, 0.8, luminance);
    let dielectricF0 = 0.04;
    let metallicF0 = luminance;
    return mix(dielectricF0, metallicF0, metallic);
}

// 개선된 가장자리 페이드 함수
fn calculateEdgeFadeImproved(screenUV: vec2<f32>) -> f32 {
    let edgeX = min(screenUV.x, 1.0 - screenUV.x);
    let edgeY = min(screenUV.y, 1.0 - screenUV.y);
    let edgeDist = min(edgeX, edgeY);

    let fadeRange = max(uniforms.edgeFade, 0.02);
    return smoothstep(-fadeRange, fadeRange, edgeDist);
}

// 뷰 스페이스 포지션을 스크린 좌표로 투영
fn projectViewToScreen(viewPos: vec3<f32>) -> vec2<f32> {
    let clipPos4 = systemUniforms.projectionMatrix * vec4<f32>(viewPos, 1.0);
    let ndc = clipPos4.xyz / clipPos4.w;

    // NDC를 스크린 UV로 변환
    let screenUV = vec2<f32>(
        ndc.x * 0.5 + 0.5,
        ndc.y * 0.5 + 0.5
    );
    return screenUV;
}

// 깔끔한 레이 마칭 함수 (지터 제거됨)
fn performRayMarching(startViewPos: vec3<f32>, rayDir: vec3<f32>) -> vec4<f32> {
    var currentViewPos = startViewPos;

    // 일정한 스텝 크기 (지터 없음)
    let stepVec = rayDir * uniforms.stepSize;

    var hitColor = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    let maxSteps = u32(uniforms.maxSteps);

    // 시작점을 약간 앞으로 이동하여 자기 자신과의 충돌 방지
    currentViewPos += stepVec * 0.01;

    for (var i = 0u; i < maxSteps; i++) {
        currentViewPos += stepVec;

        // 최대 거리 체크
        let travelDistance = length(currentViewPos - startViewPos);
        if (travelDistance > uniforms.maxDistance) {
            break;
        }

        // 스크린 좌표로 변환
        let screenUV = projectViewToScreen(currentViewPos);

        // 화면 경계 처리
        let margin = 0.02;
        if (screenUV.x < margin || screenUV.x > (1.0 - margin) ||
            screenUV.y < margin || screenUV.y > (1.0 - margin)) {
            break;
        }

        // 텍셀 좌표 계산
        let texDims = textureDimensions(depthTexture);
        let texSizeF = vec2<f32>(texDims);
        let exactCoord = screenUV * texSizeF;
        let screenCoord = vec2<i32>(exactCoord);

        // 범위 체크
        let texSize = vec2<i32>(texDims);
        if (screenCoord.x < 0 || screenCoord.x >= texSize.x ||
            screenCoord.y < 0 || screenCoord.y >= texSize.y) {
            continue;
        }

        let clampedCoord = clamp(screenCoord, vec2<i32>(0), texSize - vec2<i32>(1));

        // 깊이 샘플링
        let sampledDepth = textureLoad(depthTexture, clampedCoord, 0);

        // 스카이박스 체크
        if (sampledDepth >= 0.999) {
            continue;
        }

        let sampledViewPos = reconstructViewPosition(clampedCoord, sampledDepth);

        // 교차점 검사
        let depthDiff = currentViewPos.z - sampledViewPos.z;
        let baseThickness = uniforms.thickness;

        // 거리에 따른 적응적 두께
        let distanceFactor = travelDistance / uniforms.maxDistance;
        let adaptiveThickness = baseThickness * (1.0 + distanceFactor * 0.3);

        if (depthDiff > -0.02 && depthDiff < adaptiveThickness) {
            // 색상 샘플링
            let reflectionColor = textureLoad(sourceTexture, clampedCoord);

            // 페이드 계산
            let distanceFade = 1.0 - smoothstep(0.0, uniforms.fadeDistance, travelDistance);
            let edgeFade = calculateEdgeFadeImproved(screenUV);
            let stepProgress = f32(i) / f32(maxSteps);
            let rayFade = 1.0 - stepProgress * stepProgress;

            let totalFade = distanceFade * edgeFade * rayFade;
            hitColor = vec4<f32>(reflectionColor.rgb, totalFade);
            break;
        }
    }

    return hitColor;
}
