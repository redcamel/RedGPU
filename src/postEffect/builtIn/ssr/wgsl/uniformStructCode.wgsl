#redgpu_include math.getInterleavedGradientNoise
#redgpu_include math.EPSILON
#redgpu_include math.reconstruct.getViewNormalFromGNormalBuffer

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
}

/**
 * [KO] 역투영 행렬의 Z/W 성분을 이용해 4x4 행렬 곱 없이 양수 선형 깊이(-viewPos.z)를 복원합니다.
 * [EN] Reconstructs positive linear depth (-viewPos.z) without 4x4 matrix multiplication using Z/W components of inverseProjectionMatrix.
 */
fn depthToLinearZ(depth: f32, zParams: vec4<f32>) -> f32 {
    let z = zParams.x * depth + zParams.y;
    let w = zParams.z * depth + zParams.w;
    return -z / w;
}

/**
 * [KO] 화면 UV와 선형 깊이로부터 4x4 행렬 곱 없이 뷰 공간 3D 좌표를 복원합니다 (TAA 지터 완벽 지원).
 * [EN] Reconstructs 3D view-space position from screen UV and linear depth without 4x4 matrix multiplication (full TAA jitter support).
 */
fn reconstructViewPosition(uv: vec2<f32>, linearZ: f32, invFocalLen: vec2<f32>, invJitter: vec2<f32>) -> vec3<f32> {
    let ndc = vec2<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0);
    return vec3<f32>((ndc * invFocalLen + invJitter) * linearZ, -linearZ);
}

/**
 * [KO] 뷰 공간 3D 좌표를 4x4 행렬 곱 없이 스크린 UV 좌표로 투영합니다 (TAA 지터 완벽 지원).
 * [EN] Projects 3D view-space coordinates to screen UV coordinates without 4x4 matrix multiplication (full TAA jitter support).
 */
fn viewToScreenUV(viewPos: vec3<f32>, projScale: vec2<f32>, projJitter: vec2<f32>) -> vec2<f32> {
    if (viewPos.z >= -EPSILON) {
        return vec2<f32>(-1.0);
    }
    let invW = 1.0 / (-viewPos.z);
    let ndc = (viewPos.xy * projScale + projJitter * viewPos.z) * invW;
    return vec2<f32>(ndc.x * 0.5 + 0.5, -ndc.y * 0.5 + 0.5);
}

/**
 * [KO] 화면 가장자리에 대한 페이드 효과를 계산합니다.
 * [EN] Calculates fade effect for screen edges.
 */
fn calculateEdgeFade(screenUV: vec2<f32>) -> f32 {
    let edge = min(screenUV, 1.0 - screenUV);
    let edgeDist = min(edge.x, edge.y);
    return smoothstep(0.0, max(uniforms.edgeFade, EPSILON), edgeDist);
}

/**
 * [KO] 무행렬 뷰 공간(View-Space) 레이 마칭을 수행하여 반사 지점을 찾습니다.
 * [EN] Performs matrix-free view-space ray marching to find reflection points.
 *
 * @param startViewPos - [KO] 시작 지점 (뷰 공간 좌표) [EN] Starting point (View-space coords)
 * @param rayDir - [KO] 반사 레이 방향 (정규화된 뷰 공간 벡터) [EN] Reflection ray direction (Normalized view-space vector)
 * @param screenCoord - [KO] 노이즈 지터링을 위한 스크린 좌표 [EN] Screen coordinates for noise jittering
 * @param texSizeF - [KO] 출력 텍스처 해상도 (vec2<f32>) [EN] Output texture dimensions (vec2<f32>)
 * @param projScale - [KO] 투영 행렬 대각 스케일 성분 (P[0][0], P[1][1]) [EN] Projection matrix diagonal scale (P[0][0], P[1][1])
 * @param projJitter - [KO] 투영 행렬 지터 오프셋 성분 (P[2][0], P[2][1]) [EN] Projection matrix jitter offset (P[2][0], P[2][1])
 * @param zParams - [KO] 역투영 행렬 Z/W 선형화 계수 [EN] Inverse projection Z/W linearization coefficients
 * @returns [KO] 반사된 컬러와 감쇠 계수(Alpha) [EN] Reflected color and falloff factor (Alpha)
 */
fn performViewSpaceRayMarching(
    startViewPos: vec3<f32>,
    rayDir: vec3<f32>,
    screenCoord: vec2<i32>,
    texSizeF: vec2<f32>,
    projScale: vec2<f32>,
    projJitter: vec2<f32>,
    zParams: vec4<f32>
) -> vec4<f32> {
    let cameraDistance = length(startViewPos);

    // [KO] 거리에 따른 적응형 단계 크기 및 최대 단계 수 조절
    // [EN] Adjust adaptive step size and max steps based on distance
    let distanceScale = 1.0 + cameraDistance * 0.1;
    let adaptiveStepSize = uniforms.stepSize * min(distanceScale, 4.0);

    let stepScale = 1.0 + cameraDistance * 0.067;
    let adaptiveMaxSteps = u32(f32(uniforms.maxSteps) * min(stepScale, 2.0));

    let maxDistanceSq = uniforms.maxDistance * uniforms.maxDistance;
    let maxRefinementLevels = 4u;
    let invMaxSteps = 1.0 / f32(max(adaptiveMaxSteps, 1u));

    // [KO] IGN(Interleaved Gradient Noise)을 사용하여 레이 마칭 지터링 적용
    // [EN] Apply ray marching jittering using IGN (Interleaved Gradient Noise)
    let jitter = getInterleavedGradientNoise(vec2<f32>(screenCoord));
    var currentViewPos = startViewPos + rayDir * (adaptiveStepSize * jitter);

    var currentStepSize = adaptiveStepSize;
    var refinementLevel = 0u;

    for (var i = 0u; i < adaptiveMaxSteps; i++) {
        currentViewPos += rayDir * currentStepSize;

        // 최대 추적 거리 초과 또는 카메라 Near 평면 뒤로 넘어갈 시 종료
        let travelVec = currentViewPos - startViewPos;
        let travelDistanceSq = dot(travelVec, travelVec);
        if (travelDistanceSq > maxDistanceSq || currentViewPos.z >= -EPSILON) {
            break;
        }

        // 무행렬 투영으로 화면 경계를 벗어나면 종료
        let currentScreenUV = viewToScreenUV(currentViewPos, projScale, projJitter);
        if (any(currentScreenUV < vec2<f32>(0.0)) || any(currentScreenUV > vec2<f32>(1.0))) {
            break;
        }

        let coord = vec2<i32>(currentScreenUV * texSizeF);
        let sampledDepth = textureLoad(depthTexture, coord, 0);

        if (sampledDepth >= 1.0) {
            continue;
        }

        // [KO] 동일 시선 광선상의 비례 항등식을 이용한 무행렬 거리 차이 계산 (||P_ray|| - ||P_surf|| == (Z_ray - Z_surf) * (||P_ray|| / Z_ray))
        // [EN] Matrix-free radial distance difference using collinear ray proportionality identity
        let surfaceLinearZ = depthToLinearZ(sampledDepth, zParams);
        let rayLinearZ = -currentViewPos.z;
        let rayDistanceFromCamera = length(currentViewPos);
        let distanceDiff = (rayLinearZ - surfaceLinearZ) * (rayDistanceFromCamera / rayLinearZ);

        // [KO] 교차 판정 임계값 (거리에 따라 적응형으로 설정하여 정밀도 유지)
        // [EN] Intersection threshold (set adaptively based on distance to maintain precision)
        let intersectionThreshold = currentStepSize * (4.0 + cameraDistance * 0.033);

        if (distanceDiff > 0.0 && distanceDiff < intersectionThreshold) {
            // [KO] 이진 탐색 기법(Binary Search)을 사용한 교차 지점 정밀화
            // [EN] Binary search refinement for intersection point
            if (refinementLevel < maxRefinementLevels) {
                currentViewPos -= rayDir * currentStepSize;
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
