struct Uniforms {
    maxSteps: u32,
    maxDistance: f32,
    stepSize: f32,
    reflectionIntensity: f32,
    fadeDistance: f32,
    edgeFade: f32,
    _padding1: f32,
    _padding2: f32,
}

// 텍스처 차원을 한 번만 계산하여 캐싱
var<private> cachedTexDims: vec2<u32>;
var<private> texDimsCached: bool = false;

fn getTextureDimensions() -> vec2<u32> {
    if (!texDimsCached) {
        cachedTexDims = textureDimensions(depthTexture);
        texDimsCached = true;
    }
    return cachedTexDims;
}

fn reconstructWorldPosition(screenCoord: vec2<i32>, depth: f32) -> vec3<f32> {
    let texDims = getTextureDimensions();
    let invTexDims = vec2<f32>(1.0) / vec2<f32>(texDims);
    let uv = (vec2<f32>(screenCoord) + 0.5) * invTexDims;

    // NDC 좌표 계산 단순화
    let ndc = vec3<f32>(
        uv.x * 2.0 - 1.0,
        -(uv.y * 2.0 - 1.0),
        depth
    );

    let clipPos = vec4<f32>(ndc, 1.0);
    let viewPos4 = systemUniforms.inverseProjectionMatrix * clipPos;

    if (abs(viewPos4.w) < 1e-6) {
        return vec3<f32>(0.0);
    }

    let viewPos = viewPos4.xyz / viewPos4.w;
    let worldPos4 = systemUniforms.camera.inverseCameraMatrix * vec4<f32>(viewPos, 1.0);
    return worldPos4.xyz;
}

fn reconstructWorldNormal(gBufferNormalData: vec4<f32>) -> vec3<f32> {
    let worldNormal = gBufferNormalData.rgb * 2.0 - 1.0;

    // 길이 검사 최적화
    let normalLengthSq = dot(worldNormal, worldNormal);
    if (normalLengthSq < 0.01) {
        return vec3<f32>(0.0, 1.0, 0.0);
    }

    return normalize(worldNormal);
}

// 행렬 곱셈을 한 번에 수행하도록 최적화
fn worldToScreen(worldPos: vec3<f32>) -> vec2<f32> {
    let clipPos4 = systemUniforms.projectionCameraMatrix * vec4<f32>(worldPos, 1.0);

    if (abs(clipPos4.w) < 1e-6) {
        return vec2<f32>(-1.0);
    }

    let ndc = clipPos4.xyz / clipPos4.w;
    return vec2<f32>(ndc.x * 0.5 + 0.5, -ndc.y * 0.5 + 0.5);
}

// 엣지 페이드 계산 인라인 최적화
fn calculateEdgeFade(screenUV: vec2<f32>) -> f32 {
    let edge = min(screenUV, 1.0 - screenUV);
    let edgeDist = min(edge.x, edge.y);
    let fadeRange = max(uniforms.edgeFade, 0.05);
    return smoothstep(0.0, fadeRange, edgeDist);
}

fn calculateWorldReflectionRay(worldPos: vec3<f32>, worldNormal: vec3<f32>, cameraWorldPos: vec3<f32>) -> vec3<f32> {
    let viewDir = normalize(cameraWorldPos - worldPos);
    return reflect(-viewDir, worldNormal);
}

fn performWorldRayMarching(startWorldPos: vec3<f32>, rayDir: vec3<f32>) -> vec4<f32> {
    // 상수들을 미리 계산
    let stepVec = rayDir * uniforms.stepSize;
    let maxSteps = u32(uniforms.maxSteps);
    let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;
    let maxDistanceSq = uniforms.maxDistance * uniforms.maxDistance;
    let intersectionThreshold = uniforms.stepSize * 2.0;
    let worldSpaceThreshold = intersectionThreshold * 1.5;
    let texDims = getTextureDimensions();
    let texSizeF = vec2<f32>(texDims);

    // 조기 종료 최적화
    let toCameraDir = normalize(cameraWorldPos - startWorldPos);
    let rayViewAlignment = dot(rayDir, toCameraDir);

    if (rayViewAlignment > 0.8) {
        return vec4<f32>(0.0);
    }

    var currentWorldPos = startWorldPos + rayDir * 0.01;

    // 적응형 스텝 크기를 위한 변수
    let invMaxSteps = 1.0 / f32(maxSteps);

    for (var i = 0u; i < maxSteps; i++) {
        currentWorldPos += stepVec;

        // 거리 체크를 제곱거리로 최적화
        let travelVec = currentWorldPos - startWorldPos;
        let travelDistanceSq = dot(travelVec, travelVec);
        if (travelDistanceSq > maxDistanceSq) {
            break;
        }

        let currentScreenUV = worldToScreen(currentWorldPos);

        // 화면 경계 체크 최적화
        if (any(currentScreenUV < vec2<f32>(0.0)) || any(currentScreenUV > vec2<f32>(1.0))) {
            break;
        }

        let screenCoord = vec2<i32>(currentScreenUV * texSizeF);

        // 텍스처 경계 체크 간소화
        if (any(screenCoord < vec2<i32>(0)) || any(screenCoord >= vec2<i32>(texDims))) {
            continue;
        }

        let sampledDepth = textureLoad(depthTexture, screenCoord, 0);

        // 스카이박스 깊이 체크
        if (sampledDepth >= 0.999) {
            continue;
        }

        let sampledWorldPos = reconstructWorldPosition(screenCoord, sampledDepth);

        // 카메라 거리 계산 최적화
        let rayDistanceFromCamera = length(currentWorldPos - cameraWorldPos);
        let surfaceDistanceFromCamera = length(sampledWorldPos - cameraWorldPos);

        // 클리핑 평면 체크
        if (rayDistanceFromCamera < systemUniforms.camera.nearClipping ||
            rayDistanceFromCamera > systemUniforms.camera.farClipping) {
            continue;
        }

        let distanceDiff = rayDistanceFromCamera - surfaceDistanceFromCamera;

        if (distanceDiff > 0.0 && distanceDiff < intersectionThreshold) {
            let worldSpaceDistance = length(currentWorldPos - sampledWorldPos);

            if (worldSpaceDistance < worldSpaceThreshold) {
                let reflectionColor = textureLoad(sourceTexture, screenCoord);

                // 페이드 계산 최적화
                let travelDistance = sqrt(travelDistanceSq);
                let distanceFade = 1.0 - smoothstep(0.0, uniforms.fadeDistance, travelDistance);
                let edgeFade = calculateEdgeFade(currentScreenUV);
                let stepFade = 1.0 - f32(i) * invMaxSteps;

                let totalFade = distanceFade * edgeFade * stepFade;

                return vec4<f32>(reflectionColor.rgb, totalFade);
            }
        }
    }

    return vec4<f32>(0.0);
}
