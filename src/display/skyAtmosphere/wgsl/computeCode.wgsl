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

// [KO] 모든 배경 영역(하늘 및 지면)에 대해 Sky-View LUT를 사용하여 대기 효과가 통합된 색상을 가져옵니다.
// [EN] Use Sky-View LUT for all background areas (sky and ground) to get colors with integrated atmospheric effects.
let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
atmosphereBackground = skySample.rgb * uniforms.sunIntensity;

if (t_earth <= 0.0 || uniforms.showGround < 0.5) {
    // [KO] 태양 디스크 합성 (지면에 가려지지 않았거나 showGround가 꺼진 경우)
    // [EN] Sun disk synthesis (only if not occluded by the ground or showGround is off)
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_rad = uniforms.sunSize * DEG_TO_RAD;
    let sun_mask = smoothstep(cos(sun_rad) - 0.001, cos(sun_rad), view_sun_cos);
    
    // [KO] showGround는 useGround가 켜져 있을 때만 의미가 있습니다.
    // [EN] showGround is only meaningful when useGround is enabled.
    let is_ghost_planet = uniforms.useGround > 0.5 && uniforms.showGround < 0.5;
    
    var sun_trans: vec3<f32>;
    if (is_ghost_planet) {
        // [KO] Ghost Planet 모드: 지면은 물리적으로 존재하지만 시각적으로는 투과해야 하므로 직접 계산
        let r_val = uniforms.earthRadius;
        let ray_origin_sun = vec3<f32>(0.0, r_val + camH, 0.0);
        
        // [KO] 물리적 지면 가림 확인
        // [EN] Check for physical ground occlusion
        let t_earth_sun = get_ray_sphere_intersection(ray_origin_sun, sunDir, r_val);
        if (t_earth_sun > 0.0) {
            sun_trans = vec3<f32>(0.0);
        } else {
            let t_max_sun = get_ray_sphere_intersection(ray_origin_sun, sunDir, r_val + uniforms.atmosphereHeight);
            let step_size_sun = t_max_sun / 40.0;
            var opt_ext_sun = vec3<f32>(0.0);
            for (var i = 0u; i < 40u; i = i + 1u) {
                let t_sun = (f32(i) + 0.5) * step_size_sun;
                let cur_h_sun = length(ray_origin_sun + sunDir * t_sun) - r_val;
                
                // [KO] 지면 내부(cur_h < 0)는 대기 밀도가 0인 것으로 간주하여 적분을 건너뜁니다.
                if (uniforms.useGround > 0.5 && cur_h_sun < -0.001) { continue; }
                
                opt_ext_sun += get_total_extinction(cur_h_sun, uniforms) * step_size_sun;
            }
            sun_trans = exp(-min(opt_ext_sun, vec3<f32>(50.0)));
        }
    } else {
        // [KO] 일반 모드 (지면 없음 또는 지면 보임): 이미 물리 상태가 반영된 LUT 사용
        sun_trans = get_transmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, uniforms.atmosphereHeight);
    }
    
    // [KO] 태양 디스크 합성: 물리적으로 올바른 강도 적용
    // [EN] Sun disk synthesis: apply physically correct intensity
    // [KO] 물리적 지면(useGround)이 있는 경우 시선이 지면에 닿으면(t_earth > 0) 태양을 가립니다.
    // [EN] If physical ground (useGround) exists, block the sun if the view hits the ground (t_earth > 0).
    let is_occluded_by_ground = uniforms.useGround > 0.5 && t_earth > 0.0;
    if (!is_occluded_by_ground || uniforms.showGround < 0.5) {
        atmosphereBackground += sun_mask * sun_trans * uniforms.sunIntensity;
    }
}

// [KO] 지평선 안개(Haze)는 Sky-View LUT와 Aerial Perspective LUT에 이미 물리적으로 통합되어 있습니다.
// [EN] Horizon Haze is already physically integrated into Sky-View and Aerial Perspective LUTs.

// [KO] 4. 최종 합성 및 노출 적용
// [EN] 4. Final synthesis and exposure application
// [KO] sceneAlpha가 1.0인 불투명 영역에는 atmosphereBackground가 투영되지 않습니다.
// [EN] Opaque areas (sceneAlpha = 1.0) do not mix with atmosphereBackground.
let finalColor = mix(atmosphereBackground, sceneColor, sceneAlpha);

textureStore(outputTexture, id, vec4<f32>(finalColor * uniforms.exposure, 1.0));
