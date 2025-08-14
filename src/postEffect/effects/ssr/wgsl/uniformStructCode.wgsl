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
    let uv = (vec2<f32>(screenCoord) + 0.5) / vec2<f32>(texDims);
    let ndc = vec3<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0, depth * 2.0 - 1.0);
    let clipPos = vec4<f32>(ndc, 1.0);
    let viewPos4 = systemUniforms.inverseProjectionMatrix * clipPos;

    if (abs(viewPos4.w) < 1e-6) {
        return vec3<f32>(0.0, 0.0, -1.0);
    }
    return viewPos4.xyz / viewPos4.w;
}

fn reconstructViewNormal(screenCoord: vec2<i32>) -> vec3<f32> {
    let normalReflectionData = textureLoad(normalRoughnessTexture, screenCoord, 0);
    let decodedWorldNormal = normalize(normalReflectionData.rgb * 2.0 - 1.0);

    if (length(decodedWorldNormal) < 0.1) {
        return vec3<f32>(0.0, 0.0, -1.0);
    }

    let cameraMatrix = systemUniforms.camera.cameraMatrix;
    let viewNormal = mat3x3<f32>(
        cameraMatrix[0].xyz,
        cameraMatrix[1].xyz,
        cameraMatrix[2].xyz
    ) * decodedWorldNormal;

    return normalize(viewNormal);
}

fn calculateEdgeFade(screenUV: vec2<f32>) -> f32 {
    let edgeDist = min(min(screenUV.x, 1.0 - screenUV.x), min(screenUV.y, 1.0 - screenUV.y));
    let fadeRange = max(uniforms.edgeFade, 0.05);
    return smoothstep(0.0, fadeRange, edgeDist);
}

fn projectViewToScreen(viewPos: vec3<f32>) -> vec2<f32> {
    let clipPos4 = systemUniforms.projectionMatrix * vec4<f32>(viewPos, 1.0);

    if (abs(clipPos4.w) < 1e-6) {
        return vec2<f32>(-1.0);
    }

    let ndc = clipPos4.xyz / clipPos4.w;
    return vec2<f32>(ndc.x * 0.5 + 0.5, 1.0 - (ndc.y * 0.5 + 0.5));
}

fn calculateReflectionRay(viewPos: vec3<f32>, viewNormal: vec3<f32>) -> vec3<f32> {
    return normalize(reflect(normalize(viewPos), viewNormal));
}

fn performRayMarching(startViewPos: vec3<f32>, rayDir: vec3<f32>) -> vec4<f32> {
    var currentViewPos = startViewPos + rayDir * 0.01;
    let stepVec = rayDir * uniforms.stepSize;
    let maxSteps = u32(uniforms.maxSteps);

    for (var i = 0u; i < maxSteps; i++) {
        currentViewPos += stepVec;

        let travelDistance = length(currentViewPos - startViewPos);
        if (travelDistance > uniforms.maxDistance) {
            break;
        }

        let screenUV = projectViewToScreen(currentViewPos);
        if (screenUV.x < 0.0 || screenUV.x > 1.0 || screenUV.y < 0.0 || screenUV.y > 1.0) {
            break;
        }

        let texDims = textureDimensions(depthTexture);
        let screenCoord = vec2<i32>(screenUV * vec2<f32>(texDims));
        let texSize = vec2<i32>(texDims);

        if (screenCoord.x < 0 || screenCoord.x >= texSize.x || screenCoord.y < 0 || screenCoord.y >= texSize.y) {
            continue;
        }

        let sampledDepth = textureLoad(depthTexture, screenCoord, 0);
        if (sampledDepth >= 0.999) {
            continue;
        }

        let sampledViewPos = reconstructViewPosition(screenCoord, sampledDepth);
        let rayDepth = -currentViewPos.z;
        let surfaceDepth = -sampledViewPos.z;

        if (rayDepth > surfaceDepth && (rayDepth - surfaceDepth) < uniforms.thickness) {
            let reflectionColor = textureLoad(sourceTexture, screenCoord);
            let distanceFade = 1.0 - smoothstep(0.0, uniforms.fadeDistance, travelDistance);
            let edgeFade = calculateEdgeFade(screenUV);
            let stepFade = 1.0 - f32(i) / f32(maxSteps);
            let totalFade = distanceFade * edgeFade * stepFade;
            return vec4<f32>(reflectionColor.rgb, totalFade);
        }
    }

    return vec4<f32>(0.0);
}
