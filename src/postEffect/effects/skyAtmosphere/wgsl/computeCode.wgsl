let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneSample = textureLoad(sourceTexture, id, 0);
var sceneColor = sceneSample.rgb;
let sceneAlpha = sceneSample.a;

// 1. 시선 방향(viewDir) 재구성 (안정성 강화)
// [KO] 투영 행렬 성분을 직접 사용하여 화면 경계에서의 지글거림을 방지합니다.
// [EN] Use projection matrix components directly to prevent shimmering at screen edges.
let invP = systemUniforms.inverseProjectionMatrix;
let viewSpaceDir = vec3<f32>(
    (uv.x * 2.0 - 1.0) * invP[0][0],
    ((1.0 - uv.y) * 2.0 - 1.0) * invP[1][1],
    -1.0
);

let worldRotation = mat3x3<f32>(
    systemUniforms.camera.inverseCameraMatrix[0].xyz,
    systemUniforms.camera.inverseCameraMatrix[1].xyz,
    systemUniforms.camera.inverseCameraMatrix[2].xyz
);
// [KO] 정규화는 모든 변환이 끝난 후 한 번만 수행하여 수치적 안정성을 높입니다.
// [EN] Normalize once after all transforms to improve numerical stability.
let viewDir = normalize(worldRotation * viewSpaceDir);

let sunDir = normalize(uniforms.sunDirection);
let camH = max(0.0001, uniforms.cameraHeight);
let r = uniforms.earthRadius;
let atmH = uniforms.atmosphereHeight;

// 3. 공중 투시(Aerial Perspective) 적용
let rawDepth = fetchDepth(id);
let depthKm = linearizeDepth(
    rawDepth, 
    systemUniforms.camera.nearClipping, 
    systemUniforms.camera.farClipping
) / 1000.0;

let max_ap_dist = 100.0; 
let ap_dist = clamp(depthKm, 0.0, max_ap_dist);

// 3D LUT UVW 계산 (CameraVolumeGenerator의 매핑과 일치)
let azimuth = atan2(viewDir.z, viewDir.x);
let elevation = asin(clamp(viewDir.y, -1.0, 1.0));

// [KO] ap_u(Azimuth)는 repeat 샘플러를 사용하여 360도 경계에서 부드럽게 이어지도록 합니다.
// [EN] ap_u (Azimuth) uses a repeat sampler to smoothly wrap around the 360-degree boundary.
let ap_u = (azimuth / PI2) + 0.5;
let ap_v = clamp((elevation * INV_PI) + 0.5, 0.001, 0.999);
let ap_w = clamp(sqrt(ap_dist / max_ap_dist), 0.0, 0.999);
let ap_sample = textureSampleLevel(cameraVolumeTexture, tSampler, vec3<f32>(ap_u, ap_v, ap_w), 0.0);

// 불투명 객체(depth < 0.999999)에 대기 효과 적용
if (rawDepth < 0.999999) {
    sceneColor = (sceneColor * ap_sample.a) + (ap_sample.rgb * uniforms.sunIntensity);
}

// 3. 대기 배경 연산 (하늘 영역)
var atmosphereBackground: vec3<f32>;
let camPos = vec3<f32>(0.0, r + camH, 0.0);
let t_earth = get_ray_sphere_intersection(camPos, viewDir, r);

if (t_earth > 0.0) {
    // 가상 지면 영역
    let hitPos = camPos + viewDir * t_earth;
    let up = normalize(hitPos);
    let cos_sun = dot(up, sunDir);
    let gTrans = get_transmittance(transmittanceTexture, tSampler, 0.0, cos_sun, atmH);
    let albedo = uniforms.groundAlbedo * INV_PI;
    let diffuse = albedo * gTrans * max(0.0, cos_sun) * uniforms.sunIntensity;
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, tSampler, skyUV, 0.0);
    atmosphereBackground = (diffuse * skySample.a) + (skySample.rgb * uniforms.sunIntensity);
} else {
    // 순수 하늘 영역
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, tSampler, skyUV, 0.0);
    atmosphereBackground = skySample.rgb * uniforms.sunIntensity;
    
    // 태양 디스크 합성
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_rad = uniforms.sunSize * DEG_TO_RAD;
    let sun_mask = smoothstep(cos(sun_rad) - 0.001, cos(sun_rad), view_sun_cos);
    let sun_trans = get_transmittance(transmittanceTexture, tSampler, camH, sunDir.y, atmH);
    atmosphereBackground += sun_mask * sun_trans * (uniforms.sunIntensity * 100.0);
}

// [KO] 지평선 연무(Haze)는 Sky-View LUT와 Aerial Perspective LUT에 이미 물리적으로 통합되어 있습니다.
// [EN] Horizon Haze is already physically integrated into Sky-View and Aerial Perspective LUTs.

// 4. 최종 합성 및 단일 노출 적용
// [KO] sceneAlpha가 1.0인 불투명 영역은 atmosphereBackground가 섞이지 않습니다.
// [EN] Opaque areas (sceneAlpha = 1.0) do not mix with atmosphereBackground.
let finalColor = mix(atmosphereBackground, sceneColor, sceneAlpha);
textureStore(outputTexture, id, vec4<f32>(finalColor * uniforms.exposure, 1.0));
