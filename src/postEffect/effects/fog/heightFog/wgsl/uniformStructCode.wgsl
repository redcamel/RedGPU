struct Uniforms {
    fogType: u32,
    density: f32,
    baseHeight: f32,
    falloff: f32,
    maxHeight: f32,
    fogColor: vec3<f32>,
    padding1: f32,
    padding2: f32,
};

fn isFiniteValue(value: f32) -> bool {
    return value == value;
}

fn isFiniteVec3(v: vec3<f32>) -> bool {
    return isFiniteValue(v.x) && isFiniteValue(v.y) && isFiniteValue(v.z);
}

fn reconstructWorldPositionUltraPrecise(screenCoord: vec2<f32>, depth: f32) -> vec3<f32> {
    let ndcX = fma(screenCoord.x, 2.0, -1.0);
    let ndcY = fma(-screenCoord.y, 2.0, 1.0);

    let safeDepth = clamp(depth, 1e-7, 1.0 - 1e-7);
    let ndc = vec3<f32>(ndcX, ndcY, safeDepth);

    let clipPos = vec4<f32>(ndc, 1.0);
    let worldPos4 = systemUniforms.inverseProjectionCameraMatrix * clipPos;

    let epsilon = 1e-6;
    let w = select(worldPos4.w, epsilon, abs(worldPos4.w) < epsilon);
    let worldPos = worldPos4.xyz / w;

    let maxCoord = 1e6;
    let stabilizedX = clamp(worldPos.x, -maxCoord, maxCoord);
    let stabilizedY = clamp(worldPos.y, -maxCoord, maxCoord);
    let stabilizedZ = clamp(worldPos.z, -maxCoord, maxCoord);

    let finalPos = vec3<f32>(stabilizedX, stabilizedY, stabilizedZ);

    return select(vec3<f32>(0.0, 0.0, 0.0), finalPos, isFiniteVec3(finalPos));
}

fn calculateHeightFogFactor(screenCoord: vec2<f32>, depth: f32) -> f32 {
    let backgroundThreshold = 1.0 - 1e-5;
    let isBackground = depth >= backgroundThreshold;

    var pixelWorldHeight: f32;

    if (isBackground) {
        let rayDirection = getRayDirectionMaxPrecision(screenCoord);
        pixelWorldHeight = getSkyboxHeightMaxPrecision(rayDirection);
    } else {
        let worldPos = reconstructWorldPositionUltraPrecise(screenCoord, depth);
        pixelWorldHeight = worldPos.y;
    }

    return calculateAbsoluteHeightFogMaxPrecision(pixelWorldHeight);
}

fn getSkyboxHeightMaxPrecision(rayDirection: vec3<f32>) -> f32 {
    let u_baseHeight = uniforms.baseHeight;
    let u_maxHeight = uniforms.maxHeight;

    let rayY = clamp(rayDirection.y, -0.999, 0.999);

    let upThreshold = 0.08;
    let downThreshold = -0.015;
    let transitionRange = upThreshold - downThreshold;

    let safeTransitionRange = max(transitionRange, 1e-6);

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
    let u_maxHeight = uniforms.maxHeight;
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
    let safeDensity = clamp(u_density, 0.0, 4.0);
    let finalFogAmount = fma(densityWithEdge, safeDensity, 0.0) * 0.42;

    let result = clamp(1.0 - finalFogAmount, 0.0, 1.0);

    return select(1.0, result, isFiniteValue(result));
}

fn getRayDirectionMaxPrecision(screenCoord: vec2<f32>) -> vec3<f32> {
    let centeredX = fma(screenCoord.x, 1.0, -0.5);
    let centeredY = fma(screenCoord.y, 1.0, -0.5);

    let ndcX = centeredX * 2.0;
    let ndcY = -(centeredY * 2.0);
    let ndc = vec3<f32>(ndcX, ndcY, 1.0);

    let clipPos = vec4<f32>(ndc, 1.0);
    let worldPos4 = systemUniforms.inverseProjectionCameraMatrix * clipPos;

    let epsilon = 1e-6;
    let w = select(worldPos4.w, epsilon, abs(worldPos4.w) < epsilon);
    let worldPos = worldPos4.xyz / w;

    let cameraPos = systemUniforms.camera.cameraPosition;
    let rayDir = worldPos - cameraPos;

    let rayLength = length(rayDir);
    let minLength = 1e-6;

    if (rayLength < minLength) {
        return vec3<f32>(0.0, 0.0, 1.0);
    }

    let normalizedRay = rayDir / rayLength;

    let safeRayX = clamp(normalizedRay.x, -0.999, 0.999);
    let safeRayY = clamp(normalizedRay.y, -0.999, 0.999);
    let safeRayZ = clamp(normalizedRay.z, -0.999, 0.999);

    let safeRay = vec3<f32>(safeRayX, safeRayY, safeRayZ);

    let finalRayLength = length(safeRay);
    let isValidRay = finalRayLength > 1e-6 && isFiniteValue(finalRayLength);

    if (isValidRay) {
        let finalRay = safeRay / finalRayLength;
        return select(vec3<f32>(0.0, 0.0, 1.0), finalRay, isFiniteVec3(finalRay));
    }

    return vec3<f32>(0.0, 0.0, 1.0);
}
