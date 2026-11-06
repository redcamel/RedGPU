// [KO] 1. 거리 파라미터 유효성 선행 판정 및 깊이 샘플링
// [EN] 1. Early distance parameter check and depth sampling
let u_near = uniforms.nearDistance;
let u_far = max(uniforms.farDistance, u_near);
if (u_far <= u_near) {
    discard;
    return vec4<f32>(0.0);
}

let coord = vec2<i32>(fragCoord);
let depth = textureLoad(depthTexture, coord, 0);
let worldPos = getWorldPositionFromDepth(uv, depth, systemUniforms.projection.inverseProjectionViewMatrix);

let u_baseHeight = uniforms.baseHeight;
let u_height = max(uniforms.height, 0.1);
let topHeight = u_baseHeight + u_height;

// [KO] 2. 일반 지오메트리(depth < 0.99999)가 안개 상단(topHeight = baseHeight + height) 이상일 때 sqrt 이전에 즉시 Early-out
// [EN] 2. Immediate early-out before sqrt when geometry (depth < 0.99999) is above fog ceiling (topHeight)
let isSky = depth >= 0.99999;
if (!isSky && worldPos.y >= topHeight) {
    discard;
    return vec4<f32>(0.0);
}

let camPos = systemUniforms.camera.cameraPosition;
let rayVector = worldPos - camPos;
let distSq = dot(rayVector, rayVector);

// [KO] 3. 근거리(nearDistance 이내) 제곱 거리 기반 Early-out (sqrt, 나눗셈, exp 및 ROP 쓰기 생략)
// [EN] 3. Squared-distance early-out for near range (skips sqrt, division, exp, and ROP write)
if (distSq <= u_near * u_near) {
    discard;
    return vec4<f32>(0.0);
}

let rawDist = sqrt(distSq);
let endDist = select(rawDist, min(rawDist, u_far), isSky);
let raySpanDist = endDist - u_near;
if (raySpanDist <= 0.0) {
    discard;
    return vec4<f32>(0.0);
}

// [KO] 4. 대상 지점 월드 고도(targetY) 산출 및 상단(topHeight) 이상 Early-out
// [EN] 4. Compute target world altitude (targetY) and early-out above fog ceiling (topHeight)
let targetY = select(worldPos.y, camPos.y + rayVector.y * (endDist / rawDist), isSky);
if (targetY >= topHeight) {
    discard;
    return vec4<f32>(0.0);
}

// [KO] 5. 고도 감쇠율(heightFactor: targetY <= baseHeight에서 1.0 유지, topHeight에서 0.0 소멸) 및 Beer-Lambert 투과율 계산
// [EN] 5. Compute altitude attenuation (heightFactor: 1.0 for targetY <= baseHeight, 0.0 at topHeight) and Beer-Lambert transmittance
let t = saturate((targetY - u_baseHeight) / u_height);
let oneMinusT = 1.0 - t;
let heightFactor = oneMinusT * oneMinusT;
let opticalDepth = max(uniforms.density * raySpanDist * heightFactor, 0.0);

let exponent = select(opticalDepth * opticalDepth, opticalDepth, uniforms.fogType == 0u);
let fogFactor = exp(-exponent);
let u_maxOpacity = saturate(uniforms.maxOpacity);
let transmittance = max(saturate(fogFactor), 1.0 - u_maxOpacity);

return vec4<f32>(uniforms.fogColor.rgb, 1.0 - transmittance);
