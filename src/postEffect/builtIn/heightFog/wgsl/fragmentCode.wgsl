// [KO] 1. 깊이 샘플링 및 실제 3D 월드 거리(rawDist) 계산
// [EN] 1. Depth sampling and actual 3D world distance (rawDist) calculation
let coord = vec2<i32>(fragCoord);
let depth = textureLoad(depthTexture, coord, 0);
let worldPos = getWorldPositionFromDepth(uv, depth, systemUniforms.projection.inverseProjectionViewMatrix);

let camPos = systemUniforms.camera.cameraPosition;
let rayVector = worldPos - camPos;
let rawDist = length(rayVector);

let u_near = uniforms.nearDistance;
let u_far = max(uniforms.farDistance, u_near);

// [KO] 2. 근거리(nearDistance 이내) Early-out (exp SFU 및 ROP 쓰기 생략)
// [EN] 2. Early-out for near range (skips exp SFU and ROP write)
if (rawDist <= u_near) {
    discard;
    return vec4<f32>(0.0);
}

let rayDir = rayVector / max(rawDist, 1e-5);
let endDist = select(rawDist, min(rawDist, u_far), depth >= 0.99999);
let raySpanDist = endDist - u_near;
if (raySpanDist <= 0.0) {
    discard;
    return vec4<f32>(0.0);
}

// [KO] 3. 실제 계산된 거리(raySpanDist) 기반 3D 광선-고도 해석적 선적분 (Analytical Ray-Height Line Integral)
// [EN] 3. Actual distance (raySpanDist) based Analytical 3D Ray-Height Line Integral
let startY = camPos.y + rayDir.y * u_near;
let endY = camPos.y + rayDir.y * endDist;

let u_falloff = max(uniforms.falloff, 0.001);
let rawH0 = u_falloff * (startY - uniforms.baseHeight);
let rawH1 = u_falloff * (endY - uniforms.baseHeight);

let expH0 = exp(-clamp(rawH0, -10.0, 20.0));
let expH1 = exp(-clamp(rawH1, -10.0, 20.0));
let rawDeltaH = rawH1 - rawH0;

// [KO] 수평 시선(|rawDeltaH| <= 1e-4)에서는 평균 밀도로 수렴, 경사 시선에서는 실제 고도차(rawDeltaH)에 대한 정적분 계산
// [EN] Converges to average density for horizontal rays (|rawDeltaH| <= 1e-4), exact integral over actual altitude delta (rawDeltaH) for sloped rays
let u_density = uniforms.density;
let u_maxOpacity = saturate(uniforms.maxOpacity);
let heightFactor = select(0.5 * (expH0 + expH1), (expH0 - expH1) / rawDeltaH, abs(rawDeltaH) > 1e-4);
let opticalDepth = max(u_density * raySpanDist * heightFactor, 0.0);

// [KO] 4. Beer-Lambert 투과율 계산 (EXPONENTIAL / EXPONENTIAL_SQUARED) 및 maxOpacity 상한 적용
// [EN] 4. Beer-Lambert transmittance calculation (EXPONENTIAL / EXPONENTIAL_SQUARED) and maxOpacity cap
var fogFactor: f32;
if (uniforms.fogType == 0u) {
    fogFactor = exp(-opticalDepth);
} else {
    fogFactor = exp(-(opticalDepth * opticalDepth));
}
let transmittance = max(saturate(fogFactor), 1.0 - u_maxOpacity);

// [KO] 5. 하드웨어 ROP 블렌더(SRC_ALPHA + ONE_MINUS_SRC_ALPHA)로 선형 HDR 안개 합성
// [EN] 5. Linear HDR fog composition via hardware ROP blending (SRC_ALPHA + ONE_MINUS_SRC_ALPHA)
return vec4<f32>(uniforms.fogColor.rgb, 1.0 - transmittance);
