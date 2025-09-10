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

 fn getTextureDimensions() -> vec2<u32> {
     return textureDimensions(depthTexture);
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
     return normalize(gBufferNormalData.rgb * 2.0 - 1.0);
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

fn performWorldRayMarching(startWorldPos: vec3<f32>, rayDir: vec3<f32>) -> vec4<f32> {
    let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;
    let cameraDistance = length(startWorldPos - cameraWorldPos);

    let distanceScale = 1.0 + cameraDistance * 0.1;
    let adaptiveStepSize = uniforms.stepSize * min(distanceScale, 4.0);

    let stepScale = 1.0 + cameraDistance * 0.067;
    let adaptiveMaxSteps = u32(f32(uniforms.maxSteps) * min(stepScale, 2.0));

    let maxDistanceSq = uniforms.maxDistance * uniforms.maxDistance;
    let texDims = getTextureDimensions();
    let texSizeF = vec2<f32>(texDims);
    let maxRefinementLevels = 4u;
    let invMaxSteps = 1.0 / f32(adaptiveMaxSteps);

    var currentWorldPos = startWorldPos + rayDir * 0.01;
    var currentStepSize = adaptiveStepSize;
    var refinementLevel = 0u;

    for (var i = 0u; i < adaptiveMaxSteps; i++) {
        currentWorldPos += rayDir * currentStepSize;

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

        let intersectionThreshold = currentStepSize * (4.0 + cameraDistance * 0.033);

        if (distanceDiff > 0.0 && distanceDiff < intersectionThreshold) {
            if (refinementLevel < maxRefinementLevels) {
                currentWorldPos -= rayDir * currentStepSize;
                currentStepSize *= 0.6;
                refinementLevel++;
                continue;
            }

            let reflectionColor = textureLoad(sourceTexture, screenCoord);
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
