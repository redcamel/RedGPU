struct Uniforms {
    maxSteps: u32,
    maxDistance: f32,
    stepSize: f32,
    reflectionIntensity: f32,
    fadeDistance: f32,
    edgeFade: f32,
    frameCount: f32,
    jitterStrength: f32,
}

// 개선된 해시 함수들
fn hash21(p: vec2<f32>) -> f32 {
    let p3 = fract(vec3<f32>(p.xyx) * vec3<f32>(0.1031, 0.1030, 0.0973));
    let p3_dot = dot(p3, vec3<f32>(p3.yzx) + 19.19);
    return fract((p3.x + p3.y) * p3_dot);
}

fn hash22(p: vec2<f32>) -> vec2<f32> {
    let p3 = fract(vec3<f32>(p.xyx) * vec3<f32>(0.1031, 0.1030, 0.0973));
    let p3_dot = dot(p3, vec3<f32>(p3.yzx) + 19.19);
    return fract((vec2<f32>(p3.x + p3.y, p3.y + p3.z)) * p3_dot);
}

// 황금비 기반 저불일치 시퀀스 - 더 균등한 분포
fn goldenRatio2D(n: f32) -> vec2<f32> {
    let g = vec2<f32>(0.7548776662466927, 0.5698402909980532); // 2D 황금비
    return fract(n * g);
}

// 개선된 Blue Noise 스타일 지터
fn generateBlueNoiseJitter(coord: vec2<i32>, frameOffset: f32) -> vec2<f32> {
    let baseCoord = vec2<f32>(coord);

    // 다층 해시를 통한 더 나은 분포
    let hash1 = hash22(baseCoord * 0.1 + vec2<f32>(frameOffset * 0.618));
    let hash2 = hash22(baseCoord * 0.3 + vec2<f32>(frameOffset * 0.382));

    // 황금비 시퀀스와 혼합하여 균등한 분포 달성
    let goldenSeq = goldenRatio2D(frameOffset + f32(coord.x + coord.y * 1024));

    // 여러 노이즈 소스를 혼합하여 패턴 제거
    return mix(hash1, hash2, 0.5) + (goldenSeq - 0.5) * 0.3;
}

// 월드 위치 재구성
fn reconstructWorldPosition(screenCoord: vec2<i32>, depth: f32) -> vec3<f32> {
    let texDims = textureDimensions(depthTexture);
    let uv = (vec2<f32>(screenCoord) + 0.5) / vec2<f32>(texDims);

    let ndc = vec3<f32>(
        uv.x * 2.0 - 1.0,
        1.0 - uv.y * 2.0,
        depth * 2.0 - 1.0
    );

    let clipPos = vec4<f32>(ndc, 1.0);
    let viewPos4 = systemUniforms.inverseProjectionMatrix * clipPos;

    if (abs(viewPos4.w) < 1e-6) {
        return vec3<f32>(0.0, 0.0, -1.0);
    }

    let viewPos = viewPos4.xyz / viewPos4.w;
    let worldPos4 = systemUniforms.camera.inverseCameraMatrix * vec4<f32>(viewPos, 1.0);
    return worldPos4.xyz;
}

// 월드 노멀 재구성
fn reconstructWorldNormal(gBufferNormalData: vec4<f32>) -> vec3<f32> {
    let normalizedData = gBufferNormalData.rgb * 2.0 - 1.0;
    let normalLength = length(normalizedData);

    if (normalLength < 0.1) {
        return vec3<f32>(0.0, 1.0, 0.0);
    }

    return normalizedData / normalLength;
}

// 월드-스크린 좌표 변환
fn worldToScreen(worldPos: vec3<f32>) -> vec2<f32> {
    let viewPos4 = systemUniforms.camera.cameraMatrix * vec4<f32>(worldPos, 1.0);
    let clipPos4 = systemUniforms.projectionMatrix * vec4<f32>(viewPos4.xyz, 1.0);

    if (abs(clipPos4.w) < 1e-6) {
        return vec2<f32>(-2.0);
    }

    let ndc = clipPos4.xyz / clipPos4.w;
    return vec2<f32>(
        ndc.x * 0.5 + 0.5,
        -ndc.y * 0.5 + 0.5
    );
}

// 엣지 페이드 계산
fn calculateEdgeFade(screenUV: vec2<f32>) -> f32 {
    let edgeDist = min(min(screenUV.x, 1.0 - screenUV.x), min(screenUV.y, 1.0 - screenUV.y));
    return saturate(edgeDist / max(uniforms.edgeFade, 0.01));
}

// 표면 복잡도 기반 적응적 지터 강도
fn calculateAdaptiveJitterStrength(worldNormal: vec3<f32>, screenUV: vec2<f32>, screenCoord: vec2<i32>) -> f32 {
    // 기본 지터 강도를 더 낮게 설정
    let baseStrength = uniforms.jitterStrength * 0.3;

    // 엣지에서의 추가 지터를 줄임
    let edgeFactor = (1.0 - calculateEdgeFade(screenUV)) * 0.5;

    let texDims = textureDimensions(gBufferNormalTexture);
    var complexityFactor = 0.0;

    // 표면 복잡도 계산을 더 보수적으로
    if (screenCoord.x > 0 && screenCoord.x < i32(texDims.x) - 1 &&
        screenCoord.y > 0 && screenCoord.y < i32(texDims.y) - 1) {

        let normalLeft = reconstructWorldNormal(textureLoad(gBufferNormalTexture, vec2<i32>(screenCoord.x - 1, screenCoord.y), 0));
        let normalRight = reconstructWorldNormal(textureLoad(gBufferNormalTexture, vec2<i32>(screenCoord.x + 1, screenCoord.y), 0));
        let normalUp = reconstructWorldNormal(textureLoad(gBufferNormalTexture, vec2<i32>(screenCoord.x, screenCoord.y - 1), 0));
        let normalDown = reconstructWorldNormal(textureLoad(gBufferNormalTexture, vec2<i32>(screenCoord.x, screenCoord.y + 1), 0));

        let horizontalVariation = length(normalRight - normalLeft);
        let verticalVariation = length(normalDown - normalUp);

        // 복잡도 팩터를 더 부드럽게 계산
        complexityFactor = saturate((horizontalVariation + verticalVariation) * 2.0) * 0.5;
    }

    return baseStrength + baseStrength * max(edgeFactor, complexityFactor);
}

// 개선된 반사 레이 계산
fn calculateWorldReflectionRay(worldPos: vec3<f32>, worldNormal: vec3<f32>, cameraWorldPos: vec3<f32>, jitterOffset: vec2<f32>) -> vec3<f32> {
    let viewDir = normalize(cameraWorldPos - worldPos);
    let reflectDir = normalize(reflect(-viewDir, worldNormal));

    // 더 안정적인 탄젠트 벡터 계산
    var tangent = vec3<f32>(0.0, 1.0, 0.0);
    if (abs(dot(worldNormal, tangent)) > 0.9) {
        tangent = vec3<f32>(1.0, 0.0, 0.0);
    }
    tangent = normalize(cross(worldNormal, tangent));
    let bitangent = cross(worldNormal, tangent);

    // 지터 강도를 더 줄임
    let jitterAmount = uniforms.jitterStrength * 0.05;
    let jitteredDir = reflectDir +
        tangent * jitterOffset.x * jitterAmount +
        bitangent * jitterOffset.y * jitterAmount;

    return normalize(jitteredDir);
}

// 개선된 레이 마칭
fn performWorldRayMarching(startWorldPos: vec3<f32>, rayDir: vec3<f32>) -> vec4<f32> {
    let texDims = textureDimensions(depthTexture);
    let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;

    let startScreenUV = worldToScreen(startWorldPos);
    let startScreenCoord = vec2<i32>(startScreenUV * vec2<f32>(texDims));

    // 개선된 지터 시스템
    let spatialJitter = generateBlueNoiseJitter(startScreenCoord, uniforms.frameCount);

    // 지터 강도를 더 제한
    let jitterScale = 0.15;
    let combinedJitter = spatialJitter.x * jitterScale;

    let baseStepSize = uniforms.stepSize;
    let jitteredStepSize = baseStepSize * (0.95 + combinedJitter * 0.1);
    let initialOffset = baseStepSize * 0.1;

    let maxSteps = uniforms.maxSteps;
    var currentWorldPos = startWorldPos + rayDir * initialOffset;
    var bestHit = vec4<f32>(0.0);
    var bestConfidence = 0.0;
    var consecutiveMisses = 0u;

    var currentStepSize = jitteredStepSize;
    var lastHitDistance = -1.0;

    for (var i = 0u; i < maxSteps; i++) {
        // 더 부드러운 스텝 지터링
        let stepIndex = f32(i) + uniforms.frameCount * 0.1;
        let stepJitter = hash21(vec2<f32>(stepIndex, f32(startScreenCoord.x + startScreenCoord.y))) * 0.05 + 0.975;
        let adaptiveStepSize = currentStepSize * stepJitter;

        currentWorldPos += rayDir * adaptiveStepSize;

        let travelDistance = length(currentWorldPos - startWorldPos);
        if (travelDistance > uniforms.maxDistance) {
            break;
        }

        let screenUV = worldToScreen(currentWorldPos);

        if (any(screenUV < vec2<f32>(0.0)) || any(screenUV > vec2<f32>(1.0))) {
            consecutiveMisses += 1u;
            if (consecutiveMisses > 3u) {
                break;
            }
            continue;
        }

        // 매우 제한된 픽셀 지터링
        let pixelJitterSeed = vec2<f32>(stepIndex, f32(startScreenCoord.y * 1024 + startScreenCoord.x));
        let pixelJitter = hash22(pixelJitterSeed) * 0.1;
        let jitteredScreenCoord = screenUV * vec2<f32>(texDims) + pixelJitter;
        let screenCoord = vec2<i32>(jitteredScreenCoord);

        let sampledDepth = textureLoad(depthTexture, screenCoord, 0);

        if (sampledDepth >= 0.999) {
            consecutiveMisses += 1u;
            continue;
        }

        let sampledWorldPos = reconstructWorldPosition(screenCoord, sampledDepth);
        let rayDistanceFromCamera = length(currentWorldPos - cameraWorldPos);
        let surfaceDistanceFromCamera = length(sampledWorldPos - cameraWorldPos);

        let depthDifference = abs(rayDistanceFromCamera - surfaceDistanceFromCamera);
        let depthThreshold = adaptiveStepSize * 1.2;

        if (depthDifference > depthThreshold) {
            if (lastHitDistance > 0.0 && depthDifference < adaptiveStepSize * 2.5) {
                currentStepSize *= 0.9;
            }
            continue;
        }

        consecutiveMisses = 0u;
        lastHitDistance = travelDistance;

        let reflectionColor = textureLoad(sourceTexture, screenCoord);

        let distanceFade = 1.0 - saturate(travelDistance / uniforms.fadeDistance);
        let edgeFade = calculateEdgeFade(screenUV);
        let depthConfidence = 1.0 - saturate(depthDifference / depthThreshold);
        let totalFade = distanceFade * edgeFade * depthConfidence;

        if (totalFade > bestConfidence) {
            bestHit = vec4<f32>(reflectionColor.rgb, totalFade);
            bestConfidence = totalFade;
        }

        if (totalFade > 0.7) {
            return bestHit;
        }

        currentStepSize = min(currentStepSize * 1.05, baseStepSize * 1.2);
    }

    return select(vec4<f32>(0.0), bestHit, bestHit.a > 0.02);
}
