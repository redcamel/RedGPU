#redgpu_include math.getInterleavedGradientNoise
#redgpu_include depth.getLinearizeDepth
#redgpu_include math.EPSILON
#redgpu_include math.reconstruct.getViewPositionFromDepth
#redgpu_include math.reconstruct.getWorldNormalFromGNormalBuffer
#redgpu_include math.direction.getViewDirection
#redgpu_include math.direction.getReflectionVectorFromViewDirection

/**
 * [KO] SSR(Screen Space Reflection)을 위한 유니폼 구조체입니다.
 * [EN] Uniform structure for SSR (Screen Space Reflection).
 */
struct Uniforms {
    maxSteps: u32,
    maxDistance: f32,
    stepSize: f32,
    reflectionIntensity: f32,
    fadeDistance: f32,
    edgeFade: f32,
    _padding: f32,
    _padding2: f32,
}

/**
 * [KO] 텍스처의 크기를 반환합니다.
 * [EN] Returns the dimensions of the texture.
 */
fn getTextureDimensions() -> vec2<u32> {
    return textureDimensions(depthTexture);
}

/**
 * [KO] UV와 깊이 값을 사용하여 월드 공간 좌표를 복원합니다.
 * [EN] Reconstructs world space coordinates using UV and depth values.
 */
fn reconstructWorldPosition(uv: vec2<f32>, depth: f32) -> vec3<f32> {
    // [KO] 1. 뷰 공간 복원 (내장 함수 사용)
    // [EN] 1. Restore View Space (Using built-in functions)
    let viewPos = getViewPositionFromDepth(uv, depth, systemUniforms.projection.inverseProjectionMatrix);
    
    // [KO] 2. 월드 공간 변환 (카메라 역뷰 행렬 사용)
    // [EN] 2. Transform to World Space (Using camera inverse view matrix)
    let worldPos4 = systemUniforms.camera.inverseViewMatrix * vec4<f32>(viewPos, 1.0);
    return worldPos4.xyz;
}

/**
 * [KO] 월드 좌표를 스크린 UV 좌표로 변환합니다.
 * [EN] Transforms world coordinates to screen UV coordinates.
 */
fn worldToScreen(worldPos: vec3<f32>) -> vec2<f32> {
    let clipPos4 = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);

    if (abs(clipPos4.w) < EPSILON) {
        return vec2<f32>(-1.0);
    }

    let ndc = clipPos4.xyz / clipPos4.w;
    return vec2<f32>(ndc.x * 0.5 + 0.5, -ndc.y * 0.5 + 0.5);
}

/**
 * [KO] 화면 가장자리에 대한 페이드 효과를 계산합니다.
 * [EN] Calculates fade effect for screen edges.
 */
fn calculateEdgeFade(screenUV: vec2<f32>) -> f32 {
    let edge = min(screenUV, 1.0 - screenUV);
    let edgeDist = min(edge.x, edge.y);
    return smoothstep(0.0, uniforms.edgeFade, edgeDist);
}

/**
 * [KO] 월드 공간에서의 반사 광선 방향을 계산합니다.
 * [EN] Calculates the reflection ray direction in world space.
 */
fn calculateWorldReflectionRay(worldPos: vec3<f32>, worldNormal: vec3<f32>, cameraWorldPos: vec3<f32>) -> vec3<f32> {
    let viewDir = getViewDirection(worldPos, cameraWorldPos);
    return getReflectionVectorFromViewDirection(viewDir, worldNormal);
}

/**
 * [KO] 월드 공간 레이 마칭을 수행하여 반사 지점을 찾습니다.
 * [EN] Performs world space ray marching to find reflection points.
 *
 * @param startWorldPos - [KO] 시작 지점 (월드 좌표) [EN] Starting point (World coords)
 * @param rayDir - [KO] 레이 방향 (정규화된 벡터) [EN] Ray direction (Normalized vector)
 * @param screenCoord - [KO] 노이즈 지터링을 위한 스크린 좌표 [EN] Screen coordinates for noise jittering
 * @returns [KO] 반사된 컬러와 감쇠 계수(Alpha) [EN] Reflected color and falloff factor (Alpha)
 */
fn performWorldRayMarching(startWorldPos: vec3<f32>, rayDir: vec3<f32>, screenCoord: vec2<i32>) -> vec4<f32> {
    let cameraWorldPos = systemUniforms.camera.inverseViewMatrix[3].xyz;
    let cameraDistance = length(startWorldPos - cameraWorldPos);

    // [KO] 거리에 따른 적응형 단계 크기 및 최대 단계 수 조절
    // [EN] Adjust adaptive step size and max steps based on distance
    // [KO] 원거리 물체일수록 더 성긴 단계로 추적하여 연산 성능 최적화
    // [EN] Optimize performance by using sparser steps for distant objects
    let distanceScale = 1.0 + cameraDistance * 0.1;
    let adaptiveStepSize = uniforms.stepSize * min(distanceScale, 4.0);

    let stepScale = 1.0 + cameraDistance * 0.067;
    let adaptiveMaxSteps = u32(f32(uniforms.maxSteps) * min(stepScale, 2.0));

    let maxDistanceSq = uniforms.maxDistance * uniforms.maxDistance;
    let texDims = getTextureDimensions();
    let texSizeF = vec2<f32>(texDims);
    let maxRefinementLevels = 4u;
    let invMaxSteps = 1.0 / f32(adaptiveMaxSteps);

    // [KO] IGN(Interleaved Gradient Noise)을 사용하여 레이 마칭 지터링 적용
    // [EN] Apply ray marching jittering using IGN (Interleaved Gradient Noise)
    // [KO] 샘플링 단계 사이의 계단 현상(Banding)을 노이즈로 분산시켜 시각적 품질 향상
    // [EN] Distribute banding artifacts between sampling steps using noise to improve visual quality
    let jitter = getInterleavedGradientNoise(vec2<f32>(screenCoord));
    var currentWorldPos = startWorldPos + rayDir * (adaptiveStepSize * jitter);
    
    var currentStepSize = adaptiveStepSize;
    var refinementLevel = 0u;

    for (var i = 0u; i < adaptiveMaxSteps; i++) {
        currentWorldPos += rayDir * currentStepSize;

        // 최대 추적 거리 초과 시 종료
        let travelVec = currentWorldPos - startWorldPos;
        let travelDistanceSq = dot(travelVec, travelVec);
        if (travelDistanceSq > maxDistanceSq) {
            break;
        }

        // 화면 경계를 벗어나면 종료
        let currentScreenUV = worldToScreen(currentWorldPos);
        if (any(currentScreenUV < vec2<f32>(0.0)) || any(currentScreenUV > vec2<f32>(1.0))) {
            break;
        }

        let coord = vec2<i32>(currentScreenUV * texSizeF);
        let sampledDepth = textureLoad(depthTexture, coord, 0);

        if (sampledDepth >= 0.999) {
            continue;
        }

        // [KO] 교차 판정 로직
        // [EN] Intersection detection logic
        let sampledWorldPos = reconstructWorldPosition(currentScreenUV, sampledDepth);
        let rayDistanceFromCamera = length(currentWorldPos - cameraWorldPos);
        let surfaceDistanceFromCamera = length(sampledWorldPos - cameraWorldPos);
        let distanceDiff = rayDistanceFromCamera - surfaceDistanceFromCamera;

        // [KO] 교차 판정 임계값 (거리에 따라 적응형으로 설정하여 정밀도 유지)
        // [EN] Intersection threshold (set adaptively based on distance to maintain precision)
        let intersectionThreshold = currentStepSize * (4.0 + cameraDistance * 0.033);

        if (distanceDiff > 0.0 && distanceDiff < intersectionThreshold) {
            // [KO] 이진 탐색 기법(Binary Search)을 사용한 교차 지점 정밀화
            // [EN] Binary search refinement for intersection point
            if (refinementLevel < maxRefinementLevels) {
                currentWorldPos -= rayDir * currentStepSize;
                currentStepSize *= 0.6;
                refinementLevel++;
                continue;
            }

            // [KO] 하드웨어 선형 샘플링을 통한 고품질 반사 컬러 로드
            // [EN] Load high-quality reflection color via hardware linear sampling
            let reflectionColor = textureSampleLevel(sourceTexture, basicSampler, currentScreenUV, 0.0);
            
            // [KO] 각종 감쇠 계수 계산 (거리, 경계면, 단계)
            // [EN] Calculate various falloff factors (distance, edge, step)
            let travelDistance = sqrt(travelDistanceSq);
            let distanceFade = 1.0 - smoothstep(0.0, uniforms.fadeDistance, travelDistance);
            let edgeFade = calculateEdgeFade(currentScreenUV);
            let stepFade = 1.0 - f32(i) * invMaxSteps;
            let distanceCompensation = min(1.5, 1.0 + cameraDistance * 0.04);

            let totalFade = distanceFade * edgeFade * stepFade * distanceCompensation;

            return vec4<f32>(reflectionColor.rgb, totalFade);
        }
    }

    return vec4<f32>(0.0);
}
