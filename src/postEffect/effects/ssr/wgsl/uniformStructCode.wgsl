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

    // WebGPU NDC 좌표 계산 - 올바른 변환
    let ndc = vec3<f32>(
        uv.x * 2.0 - 1.0,
      (1.0 - uv.y) * 2.0 - 1.0, // WebGPU 텍스처 좌표계: 위쪽이 0
        depth * 2.0 - 1.0   // [0,1] → [-1,1] 변환
    );

    let clipPos = vec4<f32>(ndc, 1.0);
    let viewPos4 = systemUniforms.inverseProjectionMatrix * clipPos;

    if (abs(viewPos4.w) < 1e-6) {
        return vec3<f32>(0.0, 0.0, -1.0);
    }
    return viewPos4.xyz / viewPos4.w;
}
fn reconstructViewNormal(screenCoord: vec2<i32>) -> vec3<f32> {
    let normalRoughnessData = textureLoad(normalRoughnessTexture, screenCoord, 0);
    let worldNormal = normalRoughnessData.rgb;

    // G-Buffer 노멀 디코딩
    let decodedWorldNormal = worldNormal * 2.0 - 1.0;

    let normalLength = length(decodedWorldNormal);
    if (normalLength < 0.1) {
        // 물 표면은 위쪽을 향하는 노멀을 가져야 함
        return vec3<f32>(0.0, 1.0, 0.0);
    }

    let normalizedWorldNormal = normalize(decodedWorldNormal);

    // 카메라 매트릭스로 월드 노멀을 뷰 공간으로 변환 (동차좌표 사용)
    let viewNormal4 = systemUniforms.camera.cameraMatrix * vec4<f32>(normalizedWorldNormal, 0.0);
    return normalize(viewNormal4.xyz);
}

fn estimateMaterialReflectance(color: vec3<f32>) -> f32 {
    let luminance = dot(color, vec3<f32>(0.299, 0.587, 0.114));
    return mix(0.04, max(0.04, luminance), step(0.5, luminance));
}

fn calculateEdgeFadeImproved(screenUV: vec2<f32>) -> f32 {
    let edgeX = min(screenUV.x, 1.0 - screenUV.x);
    let edgeY = min(screenUV.y, 1.0 - screenUV.y);
    let edgeDist = min(edgeX, edgeY);

    let fadeRange = max(uniforms.edgeFade, 0.05);
    return smoothstep(0.0, fadeRange, edgeDist);
}

fn projectViewToScreen(viewPos: vec3<f32>) -> vec2<f32> {
    let clipPos4 = systemUniforms.projectionMatrix * vec4<f32>(viewPos, 1.0);

    if (abs(clipPos4.w) < 1e-6) {
        return vec2<f32>(-1.0, -1.0);
    }

    let ndc = clipPos4.xyz / clipPos4.w;

    // NDC를 텍스처 UV로 변환 - Y축 방향 통일
    let screenUV = vec2<f32>(
        ndc.x * 0.5 + 0.5,
        1.0 - (ndc.y * 0.5 + 0.5)  // Y축 일관성 유지
    );
    return screenUV;
}

fn performRayMarching(startViewPos: vec3<f32>, rayDir: vec3<f32>) -> vec4<f32> {
    // 반사 레이 시작점 조정
    var currentViewPos = startViewPos + rayDir * 0.02;
    let stepVec = rayDir * uniforms.stepSize;
    var hitColor = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    let maxSteps = u32(uniforms.maxSteps);

    for (var i = 0u; i < maxSteps; i++) {
        currentViewPos += stepVec;

        let travelDistance = length(currentViewPos - startViewPos);
        if (travelDistance > uniforms.maxDistance) {
            break;
        }

        let screenUV = projectViewToScreen(currentViewPos);

        // 화면 경계 체크
        if (screenUV.x < 0.0 || screenUV.x > 1.0 ||
            screenUV.y < 0.0 || screenUV.y > 1.0) {
            break;
        }

        let texDims = textureDimensions(depthTexture);
        let texSizeF = vec2<f32>(texDims);
        let screenCoord = vec2<i32>(screenUV * texSizeF);

        let texSize = vec2<i32>(texDims);
        if (screenCoord.x < 0 || screenCoord.x >= texSize.x ||
            screenCoord.y < 0 || screenCoord.y >= texSize.y) {
            continue;
        }

        let sampledDepth = textureLoad(depthTexture, screenCoord, 0);

        if (sampledDepth >= 0.999) {
            continue;
        }

        let sampledViewPos = reconstructViewPosition(screenCoord, sampledDepth);

        // 교차점 검사 - 레이가 표면을 지나갔는지 확인
        let rayDepth = -currentViewPos.z;  // 뷰 공간에서 Z는 음수
        let surfaceDepth = -sampledViewPos.z;

        // 레이가 표면 뒤로 지나갔는지 확인
        if (rayDepth > surfaceDepth) {
            let depthDiff = rayDepth - surfaceDepth;

            if (depthDiff < uniforms.thickness) {
                let reflectionColor = textureLoad(sourceTexture, screenCoord);

                // 페이드 계산
                let distanceFade = 1.0 - smoothstep(0.0, uniforms.fadeDistance, travelDistance);
                let edgeFade = calculateEdgeFadeImproved(screenUV);
                let stepFade = 1.0 - f32(i) / f32(maxSteps);

                let totalFade = distanceFade * edgeFade * stepFade;
                hitColor = vec4<f32>(reflectionColor.rgb, totalFade);
                break;
            }
        }
    }

    return hitColor;
}
