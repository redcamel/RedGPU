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
    let baseStepSize = uniforms.stepSize;

    // 🎯 카메라와의 거리 계산
    let cameraDistance = length(startWorldPos - cameraWorldPos);

    // 🎯 거리 기반 적응형 스텝 사이즈 (멀수록 더 큰 스텝)
    let distanceScale = 1.0 + (cameraDistance / 10.0); // 10 단위당 2배씩 증가
    let adaptiveStepSize = baseStepSize * min(distanceScale, 4.0); // 최대 4배까지만

    // 🎯 거리 기반 적응형 최대 스텝 수 (멀수록 더 많은 스텝)
    let baseMaxSteps = f32(uniforms.maxSteps);
    let stepScale = 1.0 + (cameraDistance / 15.0); // 15 단위당 2배씩 증가
    let adaptiveMaxSteps = u32(baseMaxSteps * min(stepScale, 2.0)); // 최대 2배까지만

    // 🎯 세로 방향 지터만 적용 (안정성 극대화)
    let cameraUp = normalize(systemUniforms.camera.inverseCameraMatrix[1].xyz);

    let distanceJitterScale = 1.0 + (cameraDistance / 20.0);
    let jitterStrength = uniforms.jitterStrength * 0.01 * min(distanceJitterScale, 3.0);

    // 세로 방향만 적용
    let jitteredRayDir = normalize(
        rayDir + cameraUp * jitter.y * jitterStrength
    );

    // 🎯 공통 변수들
    let maxDistanceSq = uniforms.maxDistance * uniforms.maxDistance;
    let texDims = getTextureDimensions();
    let texSizeF = vec2<f32>(texDims);
    let maxRefinementLevels = 4u;

    // 🎯 레이 마칭
    var currentWorldPos = startWorldPos + jitteredRayDir * 0.01;
    var currentStepSize = adaptiveStepSize;
    var refinementLevel = 0u;

    for (var i = 0u; i < adaptiveMaxSteps; i++) {
        currentWorldPos += jitteredRayDir * currentStepSize;

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
        let rayDistanceFromCamera = length(currentWorldPos - cameraWorldPos);
        let surfaceDistanceFromCamera = length(sampledWorldPos - cameraWorldPos);

        let distanceDiff = rayDistanceFromCamera - surfaceDistanceFromCamera;
        let baseThreshold = currentStepSize * 4.0;
        let distanceToleranceScale = 1.0 + (cameraDistance / 30.0);
        let intersectionThreshold = baseThreshold * distanceToleranceScale;

        if (distanceDiff > 0.0 && distanceDiff < intersectionThreshold) {
            if (refinementLevel < maxRefinementLevels) {
                currentWorldPos -= jitteredRayDir * currentStepSize;
                currentStepSize *= 0.6;
                refinementLevel++;
                continue;
            }

            let pixelJitter = generatePixelJitter(screenCoord);
            let samplingRadius = max(1.0, cameraDistance / 8.0);
            let verticalJitter = vec2<i32>(0, i32(pixelJitter.y * samplingRadius));
            let jitteredScreenCoord = screenCoord + verticalJitter;

            let finalScreenCoord = vec2<i32>(
                clamp(jitteredScreenCoord.x, 0, i32(texDims.x) - 1),
                clamp(jitteredScreenCoord.y, 0, i32(texDims.y) - 1)
            );

            var reflectionColor = textureLoad(sourceTexture, finalScreenCoord);

            let travelDistance = sqrt(travelDistanceSq);
            let distanceFade = 1.0 - smoothstep(0.0, uniforms.fadeDistance, travelDistance);
            let edgeFade = calculateEdgeFade(currentScreenUV);
            let stepFade = 1.0 - f32(i) / f32(adaptiveMaxSteps);
            let distanceCompensation = min(1.5, 1.0 + (cameraDistance / 25.0));

            let totalFade = distanceFade * edgeFade * stepFade * distanceCompensation;

            return vec4<f32>(reflectionColor.rgb, totalFade);
        }
    }

    return vec4<f32>(0.0);
}
