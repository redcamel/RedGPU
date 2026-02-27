@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(outputTexture).xy;
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let clipPos = vec4<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0, 1.0, 1.0);
    
    // [KO] 큐브맵 페이스 행렬을 이용해 월드 공간 방향 계산
    // [EN] Calculate world space direction using cubemap face matrix
    let worldPos = faceMatrices[face] * clipPos;
    var view_dir = normalize(worldPos.xyz);
    
    // [KO] Artistic Symmetry: useGround가 꺼진 경우 상하 대칭을 위해 고도 반전
    if (params.useGround < 0.5) {
        view_dir.y = abs(view_dir.y);
    }
    
    let r = params.earthRadius;
    let h_c = max(0.0001, params.cameraHeight);
    let ray_origin = vec3<f32>(0.0, h_c + r, 0.0);

    let t_max = get_ray_sphere_intersection(ray_origin, view_dir, r + params.atmosphereHeight);
    let t_earth = get_ray_sphere_intersection(ray_origin, view_dir, r);
    
    // [KO] 반사(조명)는 시각적 옵션과 상관없이 물리적 지면(useGround)만 따릅니다.
    var dist_limit = select(t_max, t_earth, params.useGround > 0.5 && t_earth > 0.0);

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

    if (dist_limit > 0.0) {
        if (intersects_planet_volume) {
            // --- Segment 1: Camera to Earth (Front Atmosphere) ---
            let steps_front = 16;
            let step_size_front = t_earth_in / f32(steps_front);
            for (var i = 0; i < steps_front; i = i + 1) {
                let t = (f32(i) + 0.5) * step_size_front;
                integrate_reflection_step(ray_origin + view_dir * t, view_dir, step_size_front, &radiance, &transmittance);
            }

            if (params.useGround > 0.5 && params.showGround > 0.5) {
                // [KO] 일반 모드: 지면 반사광 추가
                let hitPos = ray_origin + view_dir * t_earth_in;
                let up = normalize(hitPos);
                let cos_sun = dot(up, params.sunDirection);
                let sun_trans = get_physical_transmittance(hitPos, params.sunDirection, r, params.atmosphereHeight, params);
                let albedo = params.groundAlbedo * INV_PI;
                let ms_energy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cos_sun * 0.5 + 0.5, 0.0), 0.0).rgb;
                radiance += transmittance * (sun_trans * max(0.0, cos_sun) + ms_energy + params.groundAmbient) * albedo;
            } else if (t_earth_out > 0.0 && dist_limit > t_earth_out) {
                // --- Segment 2: Earth Exit to Atmosphere Top (Back Atmosphere) ---
                let back_dist = dist_limit - t_earth_out;
                let steps_back = 16;
                let step_size_back = back_dist / f32(steps_back);
                for (var i = 0; i < steps_back; i = i + 1) {
                    let t = t_earth_out + (f32(i) + 0.5) * step_size_back;
                    integrate_reflection_step(ray_origin + view_dir * t, view_dir, step_size_back, &radiance, &transmittance);
                }
            }
        } else {
            // --- Single Segment: Standard Sky Path ---
            let steps = 32;
            let step_size = dist_limit / f32(steps);
            for (var i = 0; i < steps; i = i + 1) {
                let t = (f32(i) + 0.5) * step_size;
                integrate_reflection_step(ray_origin + view_dir * t, view_dir, step_size, &radiance, &transmittance);
            }
        }
    }

    // [KO] 최종 광도 저장 (태양 강도는 재질에서 샘플링 시 곱함)
    // [EN] Store final radiance (sun intensity is multiplied when sampling in the material)
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}

fn integrate_reflection_step(p: vec3<f32>, view_dir: vec3<f32>, step_size: f32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    let p_len = length(p);
    let r = params.earthRadius;
    let cur_h = p_len - r;
    let up = p / p_len;
    let cos_sun = dot(up, params.sunDirection);

    // [KO] 물리적으로 지면 아래면 적분 건너뜀
    if (params.useGround > 0.5 && cur_h < -0.001) { return; }

    // [KO] 조명 에너지는 지면 가림을 무시하는 물리 투과율 사용
    let sun_trans = get_physical_transmittance(p, params.sunDirection, r, params.atmosphereHeight, params);

    // [KO] 행성 내부(cur_h < 0)는 진공으로 처리하여 밀도를 0으로 설정합니다.
    var rho_r = 0.0;
    var rho_m = 0.0;
    var rho_f = 0.0;
    if (cur_h >= 0.0) {
        rho_r = exp(-cur_h / params.rayleighScaleHeight);
        rho_m = exp(-cur_h / params.mieScaleHeight);
        rho_f = exp(-cur_h * params.heightFogFalloff);
    }

    // [KO] 행성 그림자: 물리적 지면(useGround)이 있을 때만 계산합니다.
    var shadow_mask = 1.0;
    if (params.useGround > 0.5 && get_ray_sphere_intersection(p, params.sunDirection, r) > 0.0) { shadow_mask = 0.0; }

    let view_sun_cos = dot(view_dir, params.sunDirection);
    
    let scat_r = params.rayleighScattering * rho_r * phase_rayleigh(view_sun_cos);
    let scat_m = vec3<f32>(params.mieScattering * rho_m * phase_mie(view_sun_cos, params.mieAnisotropy));
    let scat_f = vec3<f32>(params.heightFogDensity * rho_f * phase_mie(view_sun_cos, 0.7)); 
    
    let scat = (scat_r + scat_m + scat_f) * sun_trans * shadow_mask;

    let ms_uv = vec2<f32>(cos_sun * 0.5 + 0.5, 1.0 - clamp(cur_h / params.atmosphereHeight, 0.0, 1.0));
    let ms_energy = textureSampleLevel(multiScatTexture, atmosphereSampler, ms_uv, 0.0).rgb;
    let total_scat_coeff = params.rayleighScattering * rho_r + vec3<f32>(params.mieScattering * rho_m + params.heightFogDensity * rho_f);
    let ms_scat = ms_energy * total_scat_coeff * shadow_mask;

    let extinction = get_total_extinction(cur_h, params) + vec3<f32>(params.heightFogDensity * rho_f);

    *radiance += *transmittance * (scat + ms_scat) * step_size;
    *transmittance *= exp(-extinction * step_size);
}
