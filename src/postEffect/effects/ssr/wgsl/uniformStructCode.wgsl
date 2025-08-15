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
    let y = -2.0 * uv.y + 1.0;  // Y축 뒤집기
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

fn getWorldPixelSize(worldPos: vec3<f32>) -> f32 {
      let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;
      let distance = length(worldPos - cameraWorldPos);

      // 프로젝션 매트릭스에서 FOV 추출
      // projectionMatrix[1][1] = 1/tan(fovY/2)
      let tanHalfFovY = 1.0 / systemUniforms.projectionMatrix[1][1];

      // 화면 높이 (임시로 1080 사용, 실제로는 텍스처 크기에서 가져와야 함)
      let screenHeight = 1080.0;

      // 거리에서 1픽셀이 차지하는 월드 공간 크기
      let worldPixelSize = (2.0 * distance * tanHalfFovY) / screenHeight;
      return worldPixelSize;
  }

  fn getAdaptiveStepSize(worldPos: vec3<f32>, screenStepSize: f32) -> f32 {
      let worldPixelSize = getWorldPixelSize(worldPos);

      // 화면 공간 stepSize를 픽셀 단위로 변환
      let texDims = textureDimensions(depthTexture);
      let screenPixels = screenStepSize * f32(texDims.x); // 화면 너비 기준

      // 월드 공간 스텝 크기 계산
      let worldStepSize = worldPixelSize * screenPixels;

      // 실용적인 범위로 제한 (2cm ~ 50cm)
      return clamp(worldStepSize, 0.02, 0.5);
  }
fn getAdaptiveFadeDistance(startWorldPos: vec3<f32>, screenFadeDistance: f32) -> f32 {
    let worldPixelSize = getWorldPixelSize(startWorldPos);

    // 화면 공간 fadeDistance를 픽셀 단위로 변환 (화면 너비 기준)
    let texDims = textureDimensions(depthTexture);
    let screenPixels = screenFadeDistance * f32(texDims.x);

    // 월드 공간 페이드 거리 계산
    let worldFadeDistance = worldPixelSize * screenPixels;

    // 합리적인 범위로 제한 (최소 1m, 최대 50m)
    return clamp(worldFadeDistance, 1.0, 50.0);
}

 fn performWorldRayMarching(startWorldPos: vec3<f32>, rayDir: vec3<f32>) -> vec4<f32> {
     let cameraWorldPos = systemUniforms.camera.inverseCameraMatrix[3].xyz;

     // 적응적 페이드 거리 계산
     let adaptiveFadeDistance = getAdaptiveFadeDistance(startWorldPos, uniforms.fadeDistance);

     var currentWorldPos = startWorldPos;
     let maxSteps = u32(uniforms.maxSteps);

     for (var i = 0u; i < maxSteps; i++) {
         // 프로젝션 기반 적응적 스텝 크기 계산
         let adaptiveStepSize = getAdaptiveStepSize(currentWorldPos, uniforms.stepSize);
         currentWorldPos += rayDir * adaptiveStepSize;

         let travelDistance = length(currentWorldPos - startWorldPos);
         if (travelDistance > uniforms.maxDistance) {
             break;
         }

         let screenUV = worldToScreen(currentWorldPos);
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

         let sampledWorldPos = reconstructWorldPosition(screenCoord, sampledDepth);
         let rayDistanceFromCamera = length(currentWorldPos - cameraWorldPos);
         let surfaceDistanceFromCamera = length(sampledWorldPos - cameraWorldPos);

         // 깊이 테스트
         if (rayDistanceFromCamera > surfaceDistanceFromCamera) {
             let reflectionColor = textureLoad(sourceTexture, screenCoord);

             // 적응적 페이드 거리 사용
             let distanceFade = 1.0 - smoothstep(0.0, adaptiveFadeDistance, travelDistance);
             let edgeFade = calculateEdgeFade(screenUV);
             let stepFade = 1.0 - pow(f32(i) / f32(maxSteps), 1.5);

             let totalFade = distanceFade * edgeFade * stepFade;

             return vec4<f32>(reflectionColor.rgb, totalFade);
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
