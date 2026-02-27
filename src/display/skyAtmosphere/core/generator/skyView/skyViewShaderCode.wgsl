// [KO] UE5 표준 Sky-View LUT 생성

@group(0) @binding(0) var skyViewTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var atmosphereSampler: sampler;
@group(0) @binding(4) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(skyViewTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    // [KO] 텍셀 중심 매핑
    // [EN] Pixel center mapping
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let azimuth = (uv.x - 0.5) * PI2;

    let r = params.earthRadius;
    let h_c = max(0.0001, params.cameraHeight);
    
    // 지평선 각도 계산
    let horizon_cos = -sqrt(max(0.0, h_c * (2.0 * r + h_c))) / (r + h_c);
    let horizon_elevation = asin(clamp(horizon_cos, -1.0, 1.0));

    // [UE5 표준 역매핑]
    var view_elevation: f32;
    if (uv.y < 0.5) {
        // [Sky Part] v = 0.5 * (1 - sqrt(ratio)) -> ratio = (1 - 2v)^2
        let ratio = (1.0 - 2.0 * uv.y) * (1.0 - 2.0 * uv.y);
        view_elevation = horizon_elevation + ratio * (HPI - horizon_elevation);
    } else {
        // [Ground Part] v = 0.5 * (1 + sqrt(ratio)) -> ratio = (2v - 1)^2
        let ratio = (2.0 * uv.y - 1.0) * (2.0 * uv.y - 1.0);
        view_elevation = horizon_elevation - ratio * (horizon_elevation + HPI);
    }

    let view_dir = vec3<f32>(cos(view_elevation) * cos(azimuth), sin(view_elevation), cos(view_elevation) * sin(azimuth));
    let ray_origin = vec3<f32>(0.0, h_c + r, 0.0);

    let t_max = get_ray_sphere_intersection(ray_origin, view_dir, r + params.atmosphereHeight);
    
    // [KO] 지면 교차점 계산 (t_in, t_out 모두 확보)
    // [EN] Calculate earth intersections (get both t_in and t_out)
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

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    // [KO] 구간 설정: 지면 충돌 여부에 따라 적분 구간을 최적화합니다.
    // [EN] Segment Setup: Optimize integration segments based on earth collision.
    let hit_earth = params.useGround > 0.5 && t_earth_in > 0.0;
    
    if (hit_earth) {
        // --- Segment 1: Camera to Earth (Front Atmosphere) ---
        let steps_front = 32;
        let step_size_front = t_earth_in / f32(steps_front);
        for (var i = 0; i < steps_front; i = i + 1) {
            let t = (f32(i) + 0.5) * step_size_front;
            integrate_step(ray_origin + view_dir * t, view_dir, step_size_front, &radiance, &transmittance);
        }

        if (params.showGround > 0.5) {
            // [KO] 일반 모드: 지면 반사광 추가 후 종료
            let hitPos = ray_origin + view_dir * t_earth_in;
            let up = normalize(hitPos);
            let cos_sun = dot(up, params.sunDirection);
            let sun_trans = get_transmittance(transmittanceTexture, atmosphereSampler, 0.0, cos_sun, params.atmosphereHeight);
            let albedo = params.groundAlbedo * INV_PI;
            let ms_energy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cos_sun * 0.5 + 0.5, 0.0), 0.0).rgb;
            radiance += transmittance * (sun_trans * max(0.0, cos_sun) + ms_energy + params.groundAmbient) * albedo;
        } else if (t_earth_out > 0.0 && t_max > t_earth_out) {
            // --- Segment 2: Earth Exit to Atmosphere Top (Back Atmosphere) ---
            // [KO] Ghost Planet 모드: 지면 너머의 대기를 정밀하게 적분하여 밴딩 제거
            let back_dist = t_max - t_earth_out;
            let steps_back = 32;
            let step_size_back = back_dist / f32(steps_back);
            for (var i = 0; i < steps_back; i = i + 1) {
                let t = t_earth_out + (f32(i) + 0.5) * step_size_back;
                integrate_step(ray_origin + view_dir * t, view_dir, step_size_back, &radiance, &transmittance);
            }
        }
    } else if (t_max > 0.0) {
        // --- Single Segment: Camera to Space (Normal Sky) ---
        let steps = 64;
        let step_size = t_max / f32(steps);
        for (var i = 0; i < steps; i = i + 1) {
            let t = (f32(i) + 0.5) * step_size;
            integrate_step(ray_origin + view_dir * t, view_dir, step_size, &radiance, &transmittance);
        }
    }

    textureStore(skyViewTexture, global_id.xy, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}

// [KO] 개별 적분 단계 함수 (중복 제거)
fn integrate_step(p: vec3<f32>, view_dir: vec3<f32>, step_size: f32, radiance: ptr<function, vec3<f32>>, transmittance: ptr<function, vec3<f32>>) {
    let p_len = length(p);
    let r = params.earthRadius;
    let cur_h = p_len - r;
    let up = p / p_len;
    let cos_sun = dot(up, params.sunDirection);

    // [KO] Ghost Planet 모드에서의 태양 투과율 계산 (지면 가림 고려)
    var sun_trans: vec3<f32>;
    let is_ghost_planet = params.useGround > 0.5 && params.showGround < 0.5;
    
    if (is_ghost_planet) {
        let t_earth_sun = get_ray_sphere_intersection(p, params.sunDirection, r);
        if (t_earth_sun > 0.0) {
            sun_trans = vec3<f32>(0.0);
        } else {
            let t_max_sun = get_ray_sphere_intersection(p, params.sunDirection, r + params.atmosphereHeight);
            let step_size_sun = t_max_sun / 32.0;
            var opt_ext_sun = vec3<f32>(0.0);
            for (var j = 0u; j < 32u; j = j + 1u) {
                let t_sun = (f32(j) + 0.5) * step_size_sun;
                let h_sun = length(p + params.sunDirection * t_sun) - r;
                if (params.useGround > 0.5 && h_sun < -0.001) { continue; }
                opt_ext_sun += get_total_extinction(h_sun, params) * step_size_sun;
            }
            sun_trans = exp(-min(opt_ext_sun, vec3<f32>(MAX_TAU)));
        }
    } else {
        sun_trans = get_transmittance(transmittanceTexture, atmosphereSampler, cur_h, cos_sun, params.atmosphereHeight);
    }

    // [KO] 행성 그림자
    var shadow_mask = 1.0;
    if (params.useGround > 0.5 && get_ray_sphere_intersection(p, params.sunDirection, r) > 0.0) { shadow_mask = 0.0; }

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
