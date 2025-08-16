struct Uniforms {
    maxSteps: u32,
    maxDistance: f32,
    stepSize: f32,
    reflectionIntensity: f32,
    fadeDistance: f32,
    edgeFade: f32,
    _padding1: f32,
    _padding2: f32,
}

fn reconstructWorldPosition(screenCoord: vec2<i32>, depth: f32) -> vec3<f32> {
    let texDims = textureDimensions(depthTexture);
    let uv = (vec2<f32>(screenCoord) + 0.5) / vec2<f32>(texDims);

    // NDC 좌표 계산 (TypeScript screenToWorld 로직과 일치)
    let x = 2.0 * uv.x - 1.0;
    let y = -(2.0 * uv.y - 1.0);  // Y축 뒤집기
    let z = depth * 2.0 - 1.0;

    let ndc = vec3<f32>(x, y, z);
    let clipPos = vec4<f32>(ndc, 1.0);

    // 뷰 공간으로 변환
    let viewPos4 = systemUniforms.inverseProjectionMatrix * clipPos;
    if (abs(viewPos4.w) < 1e-6) {
        return vec3<f32>(0.0, 0.0, 0.0);
    }
    let viewPos = viewPos4.xyz / viewPos4.w;

    // 월드 공간으로 변환 (inverseCameraMatrix 사용)
    let worldPos4 = systemUniforms.camera.inverseCameraMatrix * vec4<f32>(viewPos, 1.0);
    return worldPos4.xyz;
}

fn reconstructWorldNormal(gBufferNormalData: vec4<f32>) -> vec3<f32> {
    let worldNormal = normalize(gBufferNormalData.rgb * 2.0 - 1.0);

    if (length(worldNormal) < 0.1) {
        return vec3<f32>(0.0, 1.0, 0.0);
    }

    return normalize(worldNormal);
}

fn worldToScreen(worldPos: vec3<f32>) -> vec2<f32> {
    // 월드 좌표를 뷰 좌표로 변환
    let viewPos4 = systemUniforms.camera.cameraMatrix * vec4<f32>(worldPos, 1.0);
    let viewPos = viewPos4.xyz;

    // 뷰 좌표를 클립 좌표로 변환
    let clipPos4 = systemUniforms.projectionMatrix * vec4<f32>(viewPos, 1.0);

    if (abs(clipPos4.w) < 1e-6) {
        return vec2<f32>(-1.0);
    }

    // NDC로 변환
    let ndc = clipPos4.xyz / clipPos4.w;

    // 스크린 좌표로 변환 (Y축 뒤집기 고려)
    let screenX = ndc.x * 0.5 + 0.5;
    let screenY = -ndc.y * 0.5 + 0.5;  // Y축 뒤집기

    return vec2<f32>(screenX, screenY);
}

fn calculateEdgeFade(screenUV: vec2<f32>) -> f32 {
    let edgeDist = min(min(screenUV.x, 1.0 - screenUV.x), min(screenUV.y, 1.0 - screenUV.y));
    let fadeRange = max(uniforms.edgeFade, 0.05);
    return smoothstep(0.0, fadeRange, edgeDist);
}

fn calculateWorldReflectionRay(worldPos: vec3<f32>, worldNormal: vec3<f32>, cameraWorldPos: vec3<f32>) -> vec3<f32> {
    let viewDir = normalize(cameraWorldPos - worldPos);
    return normalize(reflect(-viewDir, worldNormal));
}


fn performWorldRayMarching(startWorldPos: vec3<f32>, rayDir: vec3<f32>) -> vec4<f32> {
    let stepVec = rayDir * uniforms.stepSize;
    let maxSteps = u32(uniforms.maxSteps);
    let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;

    // 카메라 방향 확인 추가
    let toCameraDir = normalize(cameraWorldPos - startWorldPos);
    let rayViewAlignment = dot(rayDir, toCameraDir);

    // 카메라 뒤쪽으로 향하는 반사는 무시
    if (rayViewAlignment > 0.8) {
        return vec4<f32>(0.0);
    }

     // 지터 없이 시작 위치 설정
     var currentWorldPos = startWorldPos + rayDir * 0.01;

     for (var i = 0u; i < maxSteps; i++) {
         currentWorldPos += stepVec;

                 let travelDistance = length(currentWorldPos - startWorldPos);
                 if (travelDistance > uniforms.maxDistance) {
                     break;
                 }



         let currentScreenUV = worldToScreen(currentWorldPos);
         if (currentScreenUV.x < 0.0 || currentScreenUV.x > 1.0 || currentScreenUV.y < 0.0 || currentScreenUV.y > 1.0) {
             break;
         }

         let texDims = textureDimensions(depthTexture);
         let screenCoord = vec2<i32>(currentScreenUV * vec2<f32>(texDims));
         let texSize = vec2<i32>(texDims);

         if (screenCoord.x < 0 || screenCoord.x >= texSize.x || screenCoord.y < 0 || screenCoord.y >= texSize.y) {
             continue;
         }

         let sampledDepth = textureLoad(depthTexture, screenCoord, 0);

         if (sampledDepth >= 0.999) {
             continue;
         }

         let sampledWorldPos = reconstructWorldPosition(screenCoord, sampledDepth);

                // 카메라 거리 체크 개선
        let rayDistanceFromCamera = length(currentWorldPos - cameraWorldPos);
        let surfaceDistanceFromCamera = length(sampledWorldPos - cameraWorldPos);

        // 카메라 near/far 클리핑 고려
        if (rayDistanceFromCamera < systemUniforms.camera.nearClipping ||
            rayDistanceFromCamera > systemUniforms.camera.farClipping) {
            continue;
        }


         let intersectionThreshold = uniforms.stepSize * 2.0;
         let distanceDiff = rayDistanceFromCamera - surfaceDistanceFromCamera;

         if (distanceDiff > 0.0 && distanceDiff < intersectionThreshold) {
             let worldSpaceDistance = length(currentWorldPos - sampledWorldPos);

             if (worldSpaceDistance < intersectionThreshold * 1.5) {
                 let reflectionColor = textureLoad(sourceTexture, screenCoord);
                 let distanceFade = 1.0 - smoothstep(0.0, uniforms.fadeDistance, travelDistance);
                 let edgeFade = calculateEdgeFade(currentScreenUV);
                 let stepFade = 1.0 - f32(i) / f32(maxSteps);

                 let totalFade = distanceFade * edgeFade * stepFade;

                 return vec4<f32>(reflectionColor.rgb, totalFade);
             }
         }
     }

     return vec4<f32>(0.0);
 }
// 기존 함수들은 호환성을 위해 유지 (사용되지 않음)
fn reconstructViewPosition(screenCoord: vec2<i32>, depth: f32) -> vec3<f32> {
    return vec3<f32>(0.0);
}

fn reconstructViewNormal(screenCoord: vec2<i32>) -> vec3<f32> {
    return vec3<f32>(0.0, 0.0, -1.0);
}

fn projectViewToScreen(viewPos: vec3<f32>) -> vec2<f32> {
    return vec2<f32>(-1.0);
}

fn calculateReflectionRay(viewPos: vec3<f32>, viewNormal: vec3<f32>) -> vec3<f32> {
    return vec3<f32>(0.0);
}

fn performRayMarching(startViewPos: vec3<f32>, rayDir: vec3<f32>) -> vec4<f32> {
    return vec4<f32>(0.0);
}
