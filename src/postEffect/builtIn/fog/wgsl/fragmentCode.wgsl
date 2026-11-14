// [KO] 1. 거리 구간 유효성 확인 (farDistance <= nearDistance 시 전체 픽셀 조기 종료)
// [EN] 1. Validate distance range (early-out all pixels if farDistance <= nearDistance)
let u_near = max(uniforms.nearDistance, 0.0);
let u_far = max(uniforms.farDistance, u_near);
if (u_far <= u_near) {
    discard;
    return vec4<f32>(0.0);
}

// [KO] 2. 3D 유클리드 거리(Euclidean Distance) 복원 및 근거리(nearDistance 이내) 제곱 거리 Early-out
// [EN] 2. Reconstruct 3D Euclidean distance and squared-distance Early-out for near range
let coord = vec2<i32>(fragCoord);
let depth = textureLoad(depthTexture, coord, 0);

var camDistance: f32;
if (depth >= 0.99999) {
    camDistance = u_far;
} else {
    let worldPos = getWorldPositionFromDepth(uv, depth, systemUniforms.projection.inverseProjectionViewMatrix);
    let diff = worldPos - systemUniforms.camera.cameraPosition;
    let distSq = dot(diff, diff);
    if (distSq <= u_near * u_near) {
        discard;
        return vec4<f32>(0.0);
    }
    camDistance = min(sqrt(distSq), u_far);
}

// [KO] 3. 순수 Beer-Lambert 물리 거리 감쇠 및 maxOpacity 상한 적용 (무분기 select 통합)
// [EN] 3. Pure Beer-Lambert physical distance attenuation and maxOpacity cap (branchless select)
let u_density = uniforms.density;
let u_maxOpacity = saturate(uniforms.maxOpacity);
let opticalDepth = u_density * (camDistance - u_near);

let exponent = select(opticalDepth * opticalDepth, opticalDepth, uniforms.fogType == 0u);
let fogFactor = exp(-exponent);
let transmittance = max(saturate(fogFactor), 1.0 - u_maxOpacity);

// [KO] 4. 하드웨어 ROP 블렌더(SRC_ALPHA + ONE_MINUS_SRC_ALPHA)로 선형 HDR 안개 합성
// [EN] 4. Linear HDR fog composition via hardware ROP blending (SRC_ALPHA + ONE_MINUS_SRC_ALPHA)
return vec4<f32>(uniforms.fogColor.rgb, 1.0 - transmittance);
