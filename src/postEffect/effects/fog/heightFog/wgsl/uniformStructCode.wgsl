#redgpu_include math.EPSILON
#redgpu_include math.reconstruct.getWorldPositionFromDepth
#redgpu_include math.direction.getRayDirection
struct Uniforms {
    fogType: u32,
    density: f32,
    baseHeight: f32,
    thickness: f32,
    falloff: f32,
    startDepth: f32,
    endDepth: f32,
    fogColor: vec3<f32>,
    padding1: f32,
};

fn isFiniteValue(value: f32) -> bool {
    return value == value;
}

fn isFiniteVec3(v: vec3<f32>) -> bool {
    return isFiniteValue(v.x) && isFiniteValue(v.y) && isFiniteValue(v.z);
}

fn reconstructWorldPositionUltraPrecise(screenCoord: vec2<f32>, depth: f32) -> vec3<f32> {
    let worldPos = getWorldPositionFromDepth(screenCoord, depth, systemUniforms.projection.inverseProjectionViewMatrix);
    return select(vec3<f32>(0.0), worldPos, isFiniteVec3(worldPos));
}

fn calculateHeightFogFactor(screenCoord: vec2<f32>, depth: f32) -> f32 {
    let backgroundThreshold = 1.0 - 1e-5;
    let isBackground = depth >= backgroundThreshold;

    var pixelWorldPos: vec3<f32>;
    var pixelWorldHeight: f32;
    var camDistance: f32 = 0.0;

    if (isBackground) {
        let rayDirection = getRayDirectionMaxPrecision(screenCoord);
        pixelWorldHeight = getSkyboxHeightMaxPrecision(rayDirection);
        camDistance = uniforms.endDepth + 1000.0;
    } else {
        let worldPos = reconstructWorldPositionUltraPrecise(screenCoord, depth);
        pixelWorldHeight = worldPos.y;
        camDistance = length(worldPos - systemUniforms.camera.cameraPosition);
    }

    let heightFogVal = calculateAbsoluteHeightFogMaxPrecision(pixelWorldHeight);

    // 💡 startDepth & endDepth 거리 안개 계산 (endDepth > 0.0 일 때만 원거리 제약 적용)
    var distFactor: f32 = 1.0;
    if (uniforms.endDepth > 0.0 && uniforms.endDepth > uniforms.startDepth + 1.0) {
        distFactor = clamp((camDistance - uniforms.startDepth) / (uniforms.endDepth - uniforms.startDepth), 0.0, 1.0);
    }

    // 높이 안개와 거리 안개의 최적 결합 (startDepth 이내의 근경은 안개 0%)
    let rawFogFactor = clamp((1.0 - heightFogVal) * distFactor, 0.0, 1.0);
    return 1.0 - rawFogFactor;
}

fn getSkyboxHeightMaxPrecision(rayDirection: vec3<f32>) -> f32 {
    let u_baseHeight = uniforms.baseHeight;
    let u_maxHeight = u_baseHeight + uniforms.thickness;

    let rayY = clamp(rayDirection.y, -0.999, 0.999);

    let upThreshold = 0.08;
    let downThreshold = -0.015;
    let transitionRange = upThreshold - downThreshold;

    let safeTransitionRange = max(transitionRange, EPSILON);

    if (rayY > upThreshold) {
        return u_maxHeight + 25.0;
    } else if (rayY < downThreshold) {
        return fma(u_maxHeight - u_baseHeight, 0.03, u_baseHeight);
    } else {
        let normalizedT = (rayY - downThreshold) / safeTransitionRange;

        let smoothT = smoothstep(0.0, 1.0, normalizedT);

        let lowValue = fma(u_maxHeight - u_baseHeight, 0.03, u_baseHeight);
        let highValue = u_maxHeight + 25.0;

        return fma(smoothT, highValue - lowValue, lowValue);
    }
}

fn calculateAbsoluteHeightFogMaxPrecision(worldHeight: f32) -> f32 {
    let u_baseHeight = uniforms.baseHeight;
    let u_maxHeight = u_baseHeight + uniforms.thickness;
    let u_density = uniforms.density;
    let u_falloff = uniforms.falloff;
    let u_fogType = uniforms.fogType;

    if (!isFiniteValue(worldHeight)) {
        return 1.0;
    }

    let heightRange = u_maxHeight - u_baseHeight;
    let safeHeightRange = max(heightRange, 1e-3);
    let margin = fma(safeHeightRange, 0.18, 1.2);

    let extendedBaseHeight = u_baseHeight - margin;
    let extendedMaxHeight = u_maxHeight + margin;
    let extendedRange = extendedMaxHeight - extendedBaseHeight;

    if (worldHeight <= extendedBaseHeight || worldHeight >= extendedMaxHeight) {
        return 1.0;
    }

    let safeExtendedRange = max(extendedRange, 1e-3);
    if (safeExtendedRange <= 0.3) {
        return 1.0;
    }

    let normalizedHeight = clamp(
        (worldHeight - extendedBaseHeight) / safeExtendedRange,
        0.0,
        1.0
    );

    let centerOffset = normalizedHeight - 0.5;
    let edgeFactor = fma(-abs(centerOffset), 0.25, 1.0);

    let heightFactor = 1.0 - normalizedHeight;
    let safeHeightFactor = max(heightFactor, 1e-4);

    let safeFalloff = clamp(u_falloff, 0.05, 1.8);
    let expPower = fma(safeFalloff, 0.73, 1.05);

    var fogDensity: f32;

    if (u_fogType == 0u) {
        fogDensity = pow(safeHeightFactor, expPower);
        fogDensity = smoothstep(0.0, 1.0, fogDensity);
    } else {
        let expResult = pow(safeHeightFactor, expPower);
        fogDensity = expResult * expResult;
        fogDensity = smoothstep(0.0, 1.0, fogDensity);
    }

    let densityWithEdge = fogDensity * edgeFactor;
    let safeDensity = clamp(u_density, 0.0, 5.0);
    let finalFogAmount = clamp(densityWithEdge * safeDensity, 0.0, 1.0);

    let result = clamp(1.0 - finalFogAmount, 0.0, 1.0);

    return select(1.0, result, isFiniteValue(result));
}

fn getRayDirectionMaxPrecision(screenCoord: vec2<f32>) -> vec3<f32> {
    let worldPos = getWorldPositionFromDepth(screenCoord, 1.0, systemUniforms.projection.inverseProjectionViewMatrix);
    let rayDir = getRayDirection(worldPos, systemUniforms.camera.cameraPosition);
    return select(vec3<f32>(0.0, 0.0, 1.0), rayDir, isFiniteVec3(rayDir));
}
