struct Uniforms {
     maxSteps: u32,
     maxDistance: f32,
     stepSize: f32,
     reflectionIntensity: f32,
     fadeDistance: f32,
     edgeFade: f32,
     jitterStrength: f32,
     _padding: f32,
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

 // 🎯 간소화된 해시 함수 (성능 최적화)
 fn hash22(p: vec2<f32>) -> vec2<f32> {
     var p3 = fract(vec3<f32>(p.xyx) * vec3<f32>(0.1031, 0.1030, 0.0973));
     p3 += dot(p3, p3.yzx + 19.19);
     return fract((p3.xx + p3.yz) * p3.zy);
 }

 fn reconstructWorldPosition(screenCoord: vec2<i32>, depth: f32) -> vec3<f32> {
     let texDims = getTextureDimensions();
     let invTexDims = 1.0 / vec2<f32>(texDims);
     let uv = (vec2<f32>(screenCoord) + 0.5) * invTexDims;

     let ndc = vec3<f32>(
         uv.x * 2.0 - 1.0,
         -(uv.y * 2.0 - 1.0),
         depth * 2.0 - 1.0
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
     let normalLengthSq = dot(worldNormal, worldNormal);

//     if (normalLengthSq < 0.01) {
//         return vec3<f32>(0.0, 1.0, 0.0);
//     }

     return normalize(worldNormal);
 }

 fn worldToScreen(worldPos: vec3<f32>) -> vec2<f32> {
     let clipPos4 = systemUniforms.projectionCameraMatrix * vec4<f32>(worldPos, 1.0);

     if (abs(clipPos4.w) < 1e-6) {
         return vec2<f32>(-1.0);
     }

     let ndc = clipPos4.xyz / clipPos4.w;
     return vec2<f32>(ndc.x * 0.5 + 0.5, -ndc.y * 0.5 + 0.5);
 }

 fn calculateEdgeFade(screenUV: vec2<f32>) -> f32 {
     let edge = min(screenUV, 1.0 - screenUV);
     let edgeDist = min(edge.x, edge.y);
     return smoothstep(0.0, uniforms.edgeFade, edgeDist);
 }

 fn calculateWorldReflectionRay(worldPos: vec3<f32>, worldNormal: vec3<f32>, cameraWorldPos: vec3<f32>) -> vec3<f32> {
     let viewDir = normalize(cameraWorldPos - worldPos);
     return reflect(-viewDir, worldNormal);
 }

// 🎯 세로 방향만 지터 생성 (안정성 극대화)
 fn generatePixelJitter(coord: vec2<i32>) -> vec2<f32> {
     let coordF = vec2<f32>(coord);

     // 간단한 체크보드 패턴으로 시간적 변화
     let checkerboard = f32((coord.x + coord.y) & 1) * 0.5;

     // 기본 노이즈만 사용 (블루노이즈와 그리드 패턴 제거)
     let jitter = hash22(coordF + checkerboard) * 2.0 - 1.0;

     // 🎯 세로 방향만 반환 (X축 지터 제거)
     return vec2<f32>(0.0, jitter.y) * uniforms.jitterStrength * 0.5;
 }

fn performWorldRayMarching(startWorldPos: vec3<f32>, rayDir: vec3<f32>, jitter: vec2<f32>) -> vec4<f32> {
    let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;
    let cameraDistance = length(startWorldPos - cameraWorldPos);

    // 🎯 계산 간소화: 거리 기반 스케일링을 단순화
    let distanceScale = 1.0 + cameraDistance * 0.1; // 나눗셈을 곱셈으로 변경
    let adaptiveStepSize = uniforms.stepSize * min(distanceScale, 4.0);

    let stepScale = 1.0 + cameraDistance * 0.067; // 1/15 ≈ 0.067
    let adaptiveMaxSteps = u32(f32(uniforms.maxSteps) * min(stepScale, 2.0));

    // 🎯 지터 계산 간소화
    let cameraUp = normalize(systemUniforms.camera.inverseCameraMatrix[1].xyz);
    let jitterStrength = uniforms.jitterStrength * 0.01 * min(1.0 + cameraDistance * 0.05, 3.0);
    let jitteredRayDir = normalize(rayDir + cameraUp * jitter.y * jitterStrength);

    // 🎯 미리 계산된 상수들
    let maxDistanceSq = uniforms.maxDistance * uniforms.maxDistance;
    let texDims = getTextureDimensions();
    let texSizeF = vec2<f32>(texDims);
    let maxRefinementLevels = 4u;
    let invMaxSteps = 1.0 / f32(adaptiveMaxSteps); // 나눗셈을 한 번만 계산

    // 🎯 레이 마칭 루프
    var currentWorldPos = startWorldPos + jitteredRayDir * 0.01;
    var currentStepSize = adaptiveStepSize;
    var refinementLevel = 0u;

    for (var i = 0u; i < adaptiveMaxSteps; i++) {
        currentWorldPos += jitteredRayDir * currentStepSize;

        // 🎯 거리 체크 간소화
        let travelVec = currentWorldPos - startWorldPos;
        let travelDistanceSq = dot(travelVec, travelVec);
        if (travelDistanceSq > maxDistanceSq) {
            break;
        }

        let currentScreenUV = worldToScreen(currentWorldPos);
        if (any(currentScreenUV < vec2<f32>(0.0)) || any(currentScreenUV > vec2<f32>(1.0))) {
            break;
        }

        let screenCoord = vec2<i32>(currentScreenUV * texSizeF);
        let sampledDepth = textureLoad(depthTexture, screenCoord, 0);

        if (sampledDepth >= 0.999) {
            continue;
        }

        let sampledWorldPos = reconstructWorldPosition(screenCoord, sampledDepth);

        // 🎯 거리 차이 계산 간소화
        let rayDistanceFromCamera = length(currentWorldPos - cameraWorldPos);
        let surfaceDistanceFromCamera = length(sampledWorldPos - cameraWorldPos);
        let distanceDiff = rayDistanceFromCamera - surfaceDistanceFromCamera;

        // 🎯 임계값 계산 간소화
        let intersectionThreshold = currentStepSize * (4.0 + cameraDistance * 0.033); // 1/30 ≈ 0.033

        if (distanceDiff > 0.0 && distanceDiff < intersectionThreshold) {
            if (refinementLevel < maxRefinementLevels) {
                currentWorldPos -= jitteredRayDir * currentStepSize;
                currentStepSize *= 0.6;
                refinementLevel++;
                continue;
            }

            // 🎯 픽셀 지터링 간소화
            let pixelJitter = generatePixelJitter(screenCoord);
            let samplingRadius = max(1.0, cameraDistance * 0.125); // 1/8 = 0.125
            let verticalJitter = vec2<i32>(0, i32(pixelJitter.y * samplingRadius));

            let finalScreenCoord = vec2<i32>(
                clamp(screenCoord.x + verticalJitter.x, 0, i32(texDims.x) - 1),
                clamp(screenCoord.y + verticalJitter.y, 0, i32(texDims.y) - 1)
            );

            let reflectionColor = textureLoad(sourceTexture, finalScreenCoord);

            // 🎯 페이드 계산 간소화 - sqrt 제거
            let travelDistance = sqrt(travelDistanceSq); // 필요한 경우만 계산
            let distanceFade = 1.0 - smoothstep(0.0, uniforms.fadeDistance, travelDistance);
            let edgeFade = calculateEdgeFade(currentScreenUV);
            let stepFade = 1.0 - f32(i) * invMaxSteps; // 미리 계산된 역수 사용
            let distanceCompensation = min(1.5, 1.0 + cameraDistance * 0.04); // 1/25 = 0.04

            let totalFade = distanceFade * edgeFade * stepFade * distanceCompensation;

            return vec4<f32>(reflectionColor.rgb, totalFade);
        }
    }

    return vec4<f32>(0.0);
}
