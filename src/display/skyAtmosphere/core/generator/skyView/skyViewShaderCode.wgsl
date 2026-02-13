// [KO] Sky-View LUT 생성을 위한 Compute Shader

@group(0) @binding(0) var skyViewTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var tSampler: sampler;
@group(0) @binding(4) var<uniform> params: AtmosphereParameters;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(skyViewTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let azimuth = (uv.x - 0.5) * 2.0 * PI;

    let r = params.earthRadius;
    let h_c = max(0.0001, params.cameraHeight);
    
    // 기하학적 지평선 계산
    let horizon_sin = -sqrt(max(0.0, h_c * (2.0 * r + h_c))) / (r + h_c);
    let horizon_elevation = asin(clamp(horizon_sin, -1.0, 1.0));

    let v_coord = uv.y;
    var elevation: f32;
    if (v_coord <= 0.5) {
        let coord = 1.0 - v_coord * 2.0; 
        elevation = horizon_elevation + (coord * coord) * (PI * 0.5 - horizon_elevation);
    } else {
        let coord = (v_coord - 0.5) * 2.0; 
        elevation = horizon_elevation - (coord * coord) * (horizon_elevation + PI * 0.5);
    }

    let view_dir = vec3<f32>(cos(elevation) * cos(azimuth), sin(elevation), cos(elevation) * sin(azimuth));
    let ray_origin = vec3<f32>(0.0, h_c + r, 0.0);

    let t_max = get_ray_sphere_intersection(ray_origin, view_dir, r + params.atmosphereHeight);
    let t_earth = get_ray_sphere_intersection(ray_origin, view_dir, r);

    // [핵심] 적분 거리 결정
    // 언리얼은 SkyView LUT 생성 시 지면에 부딪히는 광선도 대기 끝까지 적분하거나, 
    // 지면에서의 기여분을 정확히 분리합니다. 
    // 여기서는 '하늘' 데이터만 담기 위해 지면 충돌 시 적분을 중단하되, 
    // 지평선 부근의 전이를 위해 t_earth를 정교하게 처리합니다.
    var dist_limit = t_max;
    if (t_earth > 0.0) {
        dist_limit = t_earth;
    }

    var luminance = vec3<f32>(0.0);
    var transmittance_to_camera = vec3<f32>(1.0);

    if (dist_limit > 0.0) {
        let steps = 64; // 효율과 품질의 균형
        let step_size = dist_limit / f32(steps);

        for (var i = 0; i < steps; i = i + 1) {
            let t = (f32(i) + 0.5) * step_size;
            let p = ray_origin + view_dir * t;
            let p_len = length(p);
            let up = p / p_len;
            let cur_h = p_len - r;

            let cos_sun = dot(up, params.sunDirection); 
            
            // [언리얼 스타일] 행성 그림자 (Earth Shadow)
            // 지면에 의해 가려지는 태양광을 부드럽게 계산
            var shadow_mask = 1.0;
            let t_earth_shadow = get_ray_sphere_intersection(p, params.sunDirection, r);
            if (t_earth_shadow > 0.0) { 
                shadow_mask = 0.0; 
            } else {
                // 지평선 부근에서의 산란광 감쇠 (Shadow Terminator)
                let current_horizon_cos = -sqrt(max(0.0, cur_h * (2.0 * r + cur_h))) / (r + cur_h);
                shadow_mask = smoothstep(current_horizon_cos - 0.01, current_horizon_cos + 0.01, cos_sun);
            }

            let sun_trans = get_transmittance(transmittanceTexture, tSampler, cur_h, cos_sun, params.atmosphereHeight);
            let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
            let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);
            
            let o_width = max(1e-3, params.ozoneLayerWidth);
            let rho_o = max(0.0, 1.0 - abs(cur_h - params.ozoneLayerCenter) / o_width);

            let view_sun_cos = dot(view_dir, params.sunDirection);
            let step_scat = (params.rayleighScattering * rho_r * phase_rayleigh(view_sun_cos) + 
                             params.mieScattering * rho_m * phase_mie(view_sun_cos, params.mieAnisotropy)) * sun_trans * shadow_mask;

            // 다중 산란 (Multi-Scattering)
            let multi_scat_uv = vec2<f32>(clamp(cos_sun * 0.5 + 0.5, 0.0, 1.0), sqrt(clamp(max(0.0, cur_h) / params.atmosphereHeight, 0.0, 1.0)));
            let multi_scat_energy = textureSampleLevel(multiScatTexture, tSampler, multi_scat_uv, 0.0).rgb;
            let total_scat = params.rayleighScattering * rho_r + params.mieScattering * rho_m;
            let scat_ms = multi_scat_energy * total_scat * shadow_mask;

            let extinction = params.rayleighScattering * rho_r + params.mieExtinction * rho_m + params.ozoneAbsorption * rho_o;

            luminance += transmittance_to_camera * (step_scat + scat_ms) * step_size;
            transmittance_to_camera *= exp(-extinction * step_size);

            if (all(transmittance_to_camera < vec3<f32>(0.001))) { break; }
        }
    }

    // [중요] 텍스처 저장 시 알파 채널에 투과율 저장
    let avg_transmittance = (transmittance_to_camera.r + transmittance_to_camera.g + transmittance_to_camera.b) / 3.0;
    textureStore(skyViewTexture, global_id.xy, vec4<f32>(luminance, avg_transmittance));
}
