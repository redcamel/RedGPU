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
fn hash12(p: vec2<f32>) -> f32 {
    let p3 = fract(p.x * p.y * 9.1031);
    return fract(p3 * (p.x + p.y + 33.33));
}

fn hash22(p: vec2<f32>) -> vec2<f32> {
    var p3 = fract(vec3<f32>(p.xyx) * vec3<f32>(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

// 🎯 단순화된 지터 생성 (복잡한 블루노이즈 제거)
fn generatePixelJitter(coord: vec2<i32>) -> vec2<f32> {
    let coordF = vec2<f32>(coord);

    // 간단한 체크보드 패턴으로 시간적 변화
    let checkerboard = f32((coord.x + coord.y) & 1) * 0.5;

    // 기본 노이즈만 사용 (블루노이즈와 그리드 패턴 제거)
    let jitter = hash22(coordF + checkerboard) * 2.0 - 1.0;

    return jitter * uniforms.jitterStrength * 0.5; // 전체 강도 감소
}

fn reconstructWorldPosition(screenCoord: vec2<i32>, depth: f32) -> vec3<f32> {
    let texDims = getTextureDimensions();
    let invTexDims = 1.0 / vec2<f32>(texDims);
    let uv = (vec2<f32>(screenCoord) + 0.5) * invTexDims;

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
    let normalLengthSq = dot(worldNormal, worldNormal);

    if (normalLengthSq < 0.01) {
        return vec3<f32>(0.0, 1.0, 0.0);
    }

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

// 🎯 간소화된 멀티 샘플 지터 (성능 최적화)
fn generateMultiSampleJitter(coord: vec2<i32>, stepSize: f32, sampleIndex: u32) -> vec2<f32> {
    let coordF = vec2<f32>(coord) + f32(sampleIndex) * 0.618034;
    let jitter = hash22(coordF) * 2.0 - 1.0;
    let jitterScale = uniforms.jitterStrength * min(stepSize / 0.05, 2.0); // 스케일 제한
    return jitter * jitterScale;
}
fn performWorldRayMarching(startWorldPos: vec3<f32>, rayDir: vec3<f32>, jitter: vec2<f32>) -> vec4<f32> {
     let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;

     // 🎯 간소화된 적응형 스텝 사이즈
     let cameraDistance = length(startWorldPos - cameraWorldPos);
     let baseStepSize = uniforms.stepSize;
     let adaptiveStepSize = baseStepSize * (1.0 + cameraDistance * 0.05); // 계수 감소

     // 🎯 단순화된 지터 적용
     let cameraRight = normalize(systemUniforms.camera.inverseCameraMatrix[0].xyz);
     let cameraUp = normalize(systemUniforms.camera.inverseCameraMatrix[1].xyz);
     let jitteredRayDir = normalize(
         rayDir +
         cameraRight * jitter.x * 0.005 + // 강도 감소
         cameraUp * jitter.y * 0.005
     );

     let maxSteps = u32(uniforms.maxSteps);
     let maxDistanceSq = uniforms.maxDistance * uniforms.maxDistance;
     let texDims = getTextureDimensions();
     let texSizeF = vec2<f32>(texDims);

     var currentWorldPos = startWorldPos + jitteredRayDir * 0.01; // 시작 오프셋 단순화
     var currentStepSize = adaptiveStepSize;
     var refinementLevel = 0u;
     let maxRefinementLevels = 4u; // 정제 레벨 감소

     for (var i = 0u; i < maxSteps; i++) {
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
         let intersectionThreshold = currentStepSize * 2.5; // 임계값 감소

         if (distanceDiff > 0.0 && distanceDiff < intersectionThreshold) {
             // 정제 단계
             if (refinementLevel < maxRefinementLevels) {
                 currentWorldPos -= jitteredRayDir * currentStepSize;
                 currentStepSize *= 0.6;
                 refinementLevel++;
                 continue;
             }

             // 🎯 단순한 샘플링 (복잡한 지터 제거)
             let sampleJitter = generateMultiSampleJitter(screenCoord, currentStepSize, i);
             let jitteredScreenCoord = screenCoord + vec2<i32>(sampleJitter);

             let finalScreenCoord = vec2<i32>(
                 clamp(jitteredScreenCoord.x, 0, i32(texDims.x) - 1),
                 clamp(jitteredScreenCoord.y, 0, i32(texDims.y) - 1)
             );

             var reflectionColor = textureLoad(sourceTexture, finalScreenCoord);

             // 🎯 폴백: 지터 샘플링 실패 시 원본 좌표 사용
             if (length(reflectionColor.rgb) < 0.01) {
                 reflectionColor = textureLoad(sourceTexture, screenCoord);
             }

             let travelDistance = sqrt(travelDistanceSq);
             let distanceFade = 1.0 - smoothstep(0.0, uniforms.fadeDistance, travelDistance);
             let edgeFade = calculateEdgeFade(currentScreenUV);
             let stepFade = 1.0 - f32(i) / f32(maxSteps);

             let totalFade = distanceFade * edgeFade * stepFade;

             return vec4<f32>(reflectionColor.rgb, totalFade);
         }
     }

     return vec4<f32>(0.0);
 }
