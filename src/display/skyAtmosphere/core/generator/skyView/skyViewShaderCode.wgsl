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
    let t_earth = get_ray_sphere_intersection(ray_origin, view_dir, r);
    
    // [KO] 배경 시각화에서만 지면 가림 여부를 showGround에 종속시킵니다.
    // [EN] Make ground occlusion dependent on showGround only for background visualization.
    let effective_use_ground = params.useGround * params.showGround;

    var dist_limit = t_max;
    if (effective_use_ground > 0.5 && t_earth > 0.0) {
        dist_limit = t_earth;
    }

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    if (dist_limit > 0.0) {
        let steps = 64;
        let step_size = dist_limit / f32(steps);

        for (var i = 0; i < steps; i = i + 1) {
            let t = (f32(i) + 0.5) * step_size;
            let p = ray_origin + view_dir * t;
            let p_len = length(p);
            let up = p / p_len;
            let cur_h = p_len - r;

            // [KO] effective_use_ground를 사용하여 showGround가 꺼져 있으면 지면 내부도 공기로 간주합니다.
            if (effective_use_ground > 0.5 && cur_h < -0.001) { continue; }

            let cos_sun = dot(up, params.sunDirection);
            
            // [KO] showGround는 useGround가 켜져 있을 때만 의미가 있습니다.
            let is_ghost_planet = params.useGround > 0.5 && params.showGround < 0.5;

            var sun_trans: vec3<f32>;
            if (is_ghost_planet) {
                // [KO] Ghost Planet 모드: 지면은 물리적으로 존재하지만 배경 시각화를 위해 투과 처리
                let ray_origin_sun = p;
                let t_max_sun = get_ray_sphere_intersection(ray_origin_sun, params.sunDirection, r + params.atmosphereHeight);
                let step_size_sun = t_max_sun / 40.0;
                var opt_ext_sun = vec3<f32>(0.0);
                for (var j = 0u; j < 40u; j = j + 1u) {
                    let t_sun = (f32(j) + 0.5) * step_size_sun;
                    let cur_h_sun = length(ray_origin_sun + params.sunDirection * t_sun) - r;
                    opt_ext_sun += get_total_extinction(cur_h_sun, params) * step_size_sun;
                }
                sun_trans = exp(-min(opt_ext_sun, vec3<f32>(50.0)));
            } else {
                // [KO] 일반 모드: LUT 사용 (useGround가 꺼져 있다면 이미 가림이 없는 상태임)
                sun_trans = get_transmittance(transmittanceTexture, atmosphereSampler, cur_h, cos_sun, params.atmosphereHeight);
            }

            // [KO] 행성 그림자 역시 배경에서는 showGround가 꺼져 있으면 제거합니다.
            var shadow_mask = 1.0;
            if (effective_use_ground > 0.5 && get_ray_sphere_intersection(p, params.sunDirection, r) > 0.0) { shadow_mask = 0.0; }

            let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
            let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);
            
            // [KO] 오존층 및 높이 안개 기여분
            let ozone_dist = abs(cur_h - params.ozoneLayerCenter);
            let rho_o = exp(-max(0.0, ozone_dist * ozone_dist) / (params.ozoneLayerWidth * params.ozoneLayerWidth));
            let rho_f = exp(-max(0.0, cur_h) * params.heightFogFalloff);

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

            radiance += transmittance * (scat + ms_scat) * step_size;
            transmittance *= exp(-extinction * step_size);
            if (all(transmittance < vec3<f32>(0.001))) { break; }
        }

        // [KO] 지면 반사광 (useGround가 켜져 있고 실제 지면 충돌이 있을 때만 추가)
        // [EN] Add ground radiance only if useGround is active and a real collision occurred.
        if (params.useGround > 0.5 && params.showGround > 0.5 && t_earth > 0.0) {
            let hitPos = ray_origin + view_dir * t_earth;
            let up = normalize(hitPos);
            let cos_sun = dot(up, params.sunDirection);
            let sun_trans = get_transmittance(transmittanceTexture, atmosphereSampler, 0.0, cos_sun, params.atmosphereHeight);
            
            let albedo = params.groundAlbedo * INV_PI;
            let ms_energy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cos_sun * 0.5 + 0.5, 0.0), 0.0).rgb;
            
            // [KO] 지면 반사광: (직사광 + 다중 산란광 + 환경광) * 알베도
            // [EN] Ground radiance: (Direct light + Multi-scattered light + Ambient light) * Albedo
            let ground_radiance = (sun_trans * max(0.0, cos_sun) + ms_energy + params.groundAmbient) * albedo;
            radiance += transmittance * ground_radiance;
        }
    }

    textureStore(skyViewTexture, global_id.xy, vec4<f32>(radiance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}
