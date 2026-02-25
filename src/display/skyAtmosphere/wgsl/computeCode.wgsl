/**
 * [KO] 스카이 애트모스피어(대기 산란) 효과를 위한 컴퓨팅 셰이더입니다.
 * [EN] Compute shader for Sky Atmosphere (atmospheric scattering) effects.
 */
let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneSample = textureLoad(sourceTexture, id, 0);
var sceneColor = sceneSample.rgb;
let sceneAlpha = sceneSample.a;

// [KO] 1. 시선 방향(viewDir) 재구축 (수치적 안정성 강화)
// [EN] 1. Reconstruct view direction (viewDir) with improved numerical stability.
// [KO] 투영 행렬 성분을 직접 사용하여 화면 경계에서의 지글거림(Jittering)을 방지합니다.
// [EN] Use projection matrix components directly to prevent shimmering/jittering at screen edges.
let invP = systemUniforms.projection.inverseProjectionMatrix;
let viewSpaceDir = vec3<f32>(
    (uv.x * 2.0 - 1.0) * invP[0][0],
    ((1.0 - uv.y) * 2.0 - 1.0) * invP[1][1],
    -1.0
);

let worldRotation = mat3x3<f32>(
    systemUniforms.camera.inverseViewMatrix[0].xyz,
    systemUniforms.camera.inverseViewMatrix[1].xyz,
    systemUniforms.camera.inverseViewMatrix[2].xyz
);

// [KO] 정규화는 모든 변환이 끝난 뒤에 단 한 번만 수행하여 수치적 안정성을 확보합니다.
// [EN] Normalize once after all transforms to improve numerical stability.
let viewDir = normalize(worldRotation * viewSpaceDir);

let sunDir = normalize(uniforms.sunDirection);
let camH = max(0.0001, uniforms.cameraHeight);
let r = uniforms.earthRadius;
let atmH = uniforms.atmosphereHeight;

// [KO] 2. 공중 원근법(Aerial Perspective) 적용
// [EN] 2. Apply Aerial Perspective
let rawDepth = fetchDepth(id);
let depthKm = getLinearizeDepth(
    rawDepth, 
    systemUniforms.camera.nearClipping, 
    systemUniforms.camera.farClipping
) / 1000.0;

let max_ap_dist = 100.0; 
let ap_dist = clamp(depthKm, 0.0, max_ap_dist);

// [KO] 3D LUT UVW 계산 (CameraVolumeGenerator와 매핑 위치 동기화)
// [EN] Calculate 3D LUT UVW (Synchronize mapping with CameraVolumeGenerator)
let azimuth = atan2(viewDir.z, viewDir.x);
let elevation = asin(clamp(viewDir.y, -1.0, 1.0));

// [KO] ap_u(방위각)는 Repeat 샘플러를 사용하여 360도 경계에서 부드럽게 이어지도록 합니다.
// [EN] ap_u (Azimuth) uses a repeat sampler for seamless 360-degree wrapping.
let ap_u = (azimuth / PI2) + 0.5;
let ap_v = clamp((elevation * INV_PI) + 0.5, 0.001, 0.999);
let ap_w = clamp(sqrt(ap_dist / max_ap_dist), 0.0, 0.999);
let ap_sample = textureSampleLevel(cameraVolumeTexture, atmosphereSampler, vec3<f32>(ap_u, ap_v, ap_w), 0.0);

// [KO] 불투명 객체(depth < 0.999999)에 대한 산란 효과 적용
// [EN] Apply scattering effect to opaque objects (depth < 0.999999)
if (rawDepth < 0.999999) {
    sceneColor = (sceneColor * ap_sample.a) + (ap_sample.rgb * uniforms.sunIntensity);
}

// [KO] 3. 대기 배경 연산 (하늘 영역)
// [EN] 3. Atmosphere background calculation (Sky region)
var atmosphereBackground: vec3<f32>;
let camPos = vec3<f32>(0.0, r + camH, 0.0);
let t_earth = get_ray_sphere_intersection(camPos, viewDir, r);

if (t_earth > 0.0) {
    // [KO] 가려진 지면 영역 [EN] Occluded ground area
    let hitPos = camPos + viewDir * t_earth;
    let up = normalize(hitPos);
    let cos_sun = dot(up, sunDir);
    let sun_trans = get_transmittance(transmittanceTexture, atmosphereSampler, 0.0, cos_sun, atmH);
    
    let albedo = uniforms.groundAlbedo * INV_PI;
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
    
    // [KO] 지면 조명: (직사광 + 산란광) * 알베도
    // [EN] Ground lighting: (Direct + Scattered) * Albedo
    let groundColor = (sun_trans * max(0.0, cos_sun) + skySample.rgb) * uniforms.sunIntensity * albedo;
    atmosphereBackground = groundColor;
} else {
    // [KO] 순수 하늘 영역 [EN] Pure sky area
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
    atmosphereBackground = skySample.rgb * uniforms.sunIntensity;
    
    // [KO] 태양 디스크 합성 [EN] Sun disk synthesis
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_rad = uniforms.sunSize * DEG_TO_RAD;
    let sun_mask = smoothstep(cos(sun_rad) - 0.001, cos(sun_rad), view_sun_cos);
    let sun_trans = get_transmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, atmH);
    atmosphereBackground += sun_mask * sun_trans * (uniforms.sunIntensity * 100.0);
}

// [KO] 지평선 안개(Haze)는 Sky-View LUT와 Aerial Perspective LUT에 이미 물리적으로 통합되어 있습니다.
// [EN] Horizon Haze is already physically integrated into Sky-View and Aerial Perspective LUTs.

// [KO] 4. 최종 합성 및 노출 적용
// [EN] 4. Final synthesis and exposure application
// [KO] sceneAlpha가 1.0인 불투명 영역에는 atmosphereBackground가 투영되지 않습니다.
// [EN] Opaque areas (sceneAlpha = 1.0) do not mix with atmosphereBackground.
let finalColor = mix(atmosphereBackground, sceneColor, sceneAlpha);

textureStore(outputTexture, id, vec4<f32>(finalColor * uniforms.exposure, 1.0));
