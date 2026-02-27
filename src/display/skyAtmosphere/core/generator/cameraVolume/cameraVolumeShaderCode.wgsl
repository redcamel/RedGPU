// [KO] Aerial Perspective 3D LUT 생성을 위한 Compute Shader

@group(0) @binding(0) var cameraVolumeTexture: texture_storage_3d<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(cameraVolumeTexture);
    if (global_id.x >= size.x || global_id.y >= size.y || global_id.z >= size.z) { return; }

    let uvw = (vec3<f32>(global_id) + 0.5) / vec3<f32>(size);
    
    // UVW를 뷰 공간의 방향과 거리로 변환
    let azimuth = (uvw.x - 0.5) * 2.0 * PI;
    let elevation = (uvw.y - 0.5) * PI;
    
    // [KO] Artistic Symmetry: useGround가 꺼진 경우 상하 대칭을 위해 각도 반전
    var effective_elevation = elevation;
    if (params.useGround < 0.5) {
        effective_elevation = abs(elevation);
    }
    
    let view_dir = vec3<f32>(cos(effective_elevation) * cos(azimuth), sin(effective_elevation), cos(effective_elevation) * sin(azimuth));
    
    // 거리 매핑 (언리얼과 유사하게 비선형적으로 설정, 최대 100km)
    let max_dist = 100.0;
    let slice_dist = uvw.z * uvw.z * max_dist; 

    let r = params.earthRadius;
    let h_c = max(0.0001, params.cameraHeight);
    let ray_origin = vec3<f32>(0.0, h_c + r, 0.0);

    // 적분 시작
    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    // [KO] 지면 교차점 계산 (t_in, t_out 모두 확보)
    let b = dot(ray_origin, view_dir);
    let c = dot(ray_origin, ray_origin) - r * r;
    let delta = b * b - c;
    var t_earth_in = -1.0;
    var t_earth_out = -1.0;
    if (delta >= 0.0) {
        let s = sqrt(delta);
        t_earth_in = -b - s;
        t_earth_out = -b + s;
    }

    let intersects_planet_volume = t_earth_in > 0.0;

    if (slice_dist > 0.0) {
        if (intersects_planet_volume) {
            // --- Segment 1: Camera to Earth (Front Atmosphere) ---
            let t_front_end = min(slice_dist, t_earth_in);
            let steps_front = 16;
            let step_size_front = t_front_end / f32(steps_front);
            for (var i = 0; i < steps_front; i = i + 1) {
                let t = (f32(i) + 0.5) * step_size_front;
                integrate_camera_volume_step(ray_origin + view_dir * t, view_dir, step_size_front, &radiance, &transmittance);
            }

            if (params.useGround < 0.5 && slice_dist > t_earth_out && t_earth_out > 0.0) {
                // --- Segment 2: Earth Exit to Slice Dist (Back Atmosphere) ---
                let back_dist = slice_dist - t_earth_out;
                let steps_back = 16;
                let step_size_back = back_dist / f32(steps_back);
                for (var i = 0; i < steps_back; i = i + 1) {
                    let t = t_earth_out + (f32(i) + 0.5) * step_size_back;
                    integrate_camera_volume_step(ray_origin + view_dir * t, view_dir, step_size_back, &radiance, &transmittance);
                }
            }
        } else {
            // --- Single Segment: Standard Sky Path ---
            let steps = 32;
            let step_size = slice_dist / f32(steps);
            for (var i = 0; i < steps; i = i + 1) {
                let t = (f32(i) + 0.5) * step_size;
                integrate_camera_volume_step(ray_origin + view_dir * t, view_dir, step_size, &radiance, &transmittance);
            }
        }
    }

    // 결과 저장 (RGB: 산란광, A: 평균 투과율)
    let avg_trans = (transmittance.r + transmittance.g + transmittance.b) / 3.0;
    textureStore(cameraVolumeTexture, global_id, vec4<f32>(radiance, avg_trans));
}

fn integrate_camera_volume_step(p: vec3<f32>, view_dir: vec3<f32>, step_size: f32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    let p_len = length(p);
    let r = params.earthRadius;
    let cur_h = p_len - r;
    let up = p / p_len;
    let cos_sun = dot(up, params.sunDirection);

    // [KO] useGround가 켜져 있는 경우에만 지표면 아래에서 적분을 스킵합니다.
    if (params.useGround > 0.5 && cur_h < -0.001) { return; }

    // [KO] 조명 에너지는 지면 가림을 무시하는 물리 투과율 사용
    let sun_trans = get_physical_transmittance(p, params.sunDirection, r, params.atmosphereHeight, params);

    // [KO] 행성 내부(cur_h < 0)는 진공으로 처리하여 밀도를 0으로 설정합니다.
    var rho_r = 0.0;
    var rho_m = 0.0;
    var rho_f = 0.0;
    var rho_o = 0.0;

    if (cur_h >= 0.0) {
        rho_r = exp(-cur_h / params.rayleighScaleHeight);
        rho_m = exp(-cur_h / params.mieScaleHeight);
        rho_f = exp(-cur_h * params.heightFogFalloff);
        let ozone_dist = abs(cur_h - params.ozoneLayerCenter);
        rho_o = exp(-max(0.0, ozone_dist * ozone_dist) / (params.ozoneLayerWidth * params.ozoneLayerWidth));
    }

    // [KO] 행성 그림자
    var shadow_mask = 1.0;
    if (params.useGround > 0.5 && get_ray_sphere_intersection(p, params.sunDirection, r) > 0.0) { shadow_mask = 0.0; }

    let view_sun_cos = dot(view_dir, params.sunDirection);
    
    let scat_r = params.rayleighScattering * rho_r * phase_rayleigh(view_sun_cos);
    let scat_m = vec3<f32>(params.mieScattering * rho_m * phase_mie(view_sun_cos, params.mieAnisotropy));
    let scat_f = vec3<f32>(params.heightFogDensity * rho_f * phase_mie(view_sun_cos, 0.7)); 
    
    let step_scat = (scat_r + scat_m + scat_f) * sun_trans * shadow_mask;

    // [KO] 다중 산란 기여분 (에너지 보존 고려)
    let ms_uv = vec2<f32>(clamp(cos_sun * 0.5 + 0.5, 0.0, 1.0), 1.0 - clamp(cur_h / params.atmosphereHeight, 0.0, 1.0));
    let multi_scat_energy = textureSampleLevel(multiScatTexture, atmosphereSampler, ms_uv, 0.0).rgb;
    let total_scat_coeff = params.rayleighScattering * rho_r + vec3<f32>((params.mieScattering * rho_m) + (params.heightFogDensity * rho_f));
    let ms_scat = multi_scat_energy * total_scat_coeff * shadow_mask;

    // [KO] 전체 소멸 계수 (에너지 소실)
    let extinction = get_total_extinction(cur_h, params) + vec3<f32>(params.heightFogDensity * rho_f);

    *radiance += *transmittance * (step_scat + ms_scat) * step_size;
    *transmittance *= exp(-extinction * step_size);
}
