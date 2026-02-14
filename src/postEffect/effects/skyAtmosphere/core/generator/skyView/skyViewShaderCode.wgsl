// [KO] UE5 표준 Sky-View LUT 생성

@group(0) @binding(0) var skyViewTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var tSampler: sampler;
@group(0) @binding(4) var<uniform> params: AtmosphereParameters;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(skyViewTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    // [KO] 텍셀 중심 매핑
    // [EN] Pixel center mapping
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let azimuth = (uv.x - 0.5) * 2.0 * PI;

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
        view_elevation = horizon_elevation + ratio * ((PI * 0.5) - horizon_elevation);
    } else {
        // [Ground Part] v = 0.5 * (1 + sqrt(ratio)) -> ratio = (2v - 1)^2
        let ratio = (2.0 * uv.y - 1.0) * (2.0 * uv.y - 1.0);
        view_elevation = horizon_elevation - ratio * (horizon_elevation + (PI * 0.5));
    }

    let view_dir = vec3<f32>(cos(view_elevation) * cos(azimuth), sin(view_elevation), cos(view_elevation) * sin(azimuth));
    let ray_origin = vec3<f32>(0.0, h_c + r, 0.0);

    let t_max = get_ray_sphere_intersection(ray_origin, view_dir, r + params.atmosphereHeight);
    let t_earth = get_ray_sphere_intersection(ray_origin, view_dir, r);
    let dist_limit = select(t_max, t_earth, t_earth > 0.0);

    var luminance = vec3<f32>(0.0);
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

            let cos_sun = dot(up, params.sunDirection);
            let sun_trans = get_transmittance(transmittanceTexture, tSampler, cur_h, cos_sun, params.atmosphereHeight);

            // 행성 그림자
            var shadow_mask = 1.0;
            if (get_ray_sphere_intersection(p, params.sunDirection, r) > 0.0) { shadow_mask = 0.0; }

            let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
            let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);
            
            // [KO] 오존층: 가우시안 분포 모델 적용
            // [EN] Ozone layer: Apply Gaussian distribution model
            let ozone_dist = abs(cur_h - params.ozoneLayerCenter);
            let rho_o = exp(-max(0.0, ozone_dist * ozone_dist) / (params.ozoneLayerWidth * params.ozoneLayerWidth));

            let view_sun_cos = dot(view_dir, params.sunDirection);
            let scat = (params.rayleighScattering * rho_r * phase_rayleigh(view_sun_cos) + 
                        vec3<f32>(params.mieScattering * rho_m * phase_mie(view_sun_cos, params.mieAnisotropy))) * sun_trans * shadow_mask;

            // [KO] 다중 산란 기여 (V 매핑을 1.0 - H로 수정하여 생성기와 일치시킴)
            // [EN] Multi-scattering contribution (Updated V mapping to 1.0 - H to match generator)
            let ms_uv = vec2<f32>(cos_sun * 0.5 + 0.5, 1.0 - clamp(cur_h / params.atmosphereHeight, 0.0, 1.0));
            let ms_energy = textureSampleLevel(multiScatTexture, tSampler, ms_uv, 0.0).rgb;
            let ms_scat = ms_energy * (params.rayleighScattering * rho_r + vec3<f32>(params.mieScattering * rho_m)) * shadow_mask;

            let ext = params.rayleighScattering * rho_r + vec3<f32>(params.mieExtinction * rho_m) + params.ozoneAbsorption * rho_o;

            luminance += transmittance * (scat + ms_scat) * step_size;
            transmittance *= exp(-ext * step_size);
            if (all(transmittance < vec3<f32>(0.001))) { break; }
        }
    }

    textureStore(skyViewTexture, global_id.xy, vec4<f32>(luminance, (transmittance.r + transmittance.g + transmittance.b) / 3.0));
}
