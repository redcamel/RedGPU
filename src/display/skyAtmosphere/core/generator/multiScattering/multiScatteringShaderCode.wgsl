// [KO] UE5 표준 Multi-Scattering LUT 생성
#redgpu_include math.INV_PI

@group(0) @binding(0) var multiScatTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(multiScatTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    // [KO] 텍셀 중심 매핑
    // [EN] Pixel center mapping
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let cos_sun_theta = uv.x * 2.0 - 1.0;
    
    // [KO] V = 1.0 - (h / H_atm) -> h = (1.0 - V) * H_atm (Transmittance와 일관성 유지)
    // [EN] V = 1.0 - (h / H_atm) -> h = (1.0 - V) * H_atm (Keep consistency with Transmittance)
    let h = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);

    let r = params.earthRadius;
    let ray_origin = vec3<f32>(0.0, h + r, 0.0);
    let sun_dir = vec3<f32>(sqrt(max(0.0, 1.0 - cos_sun_theta * cos_sun_theta)), cos_sun_theta, 0.0);

    var lum_total = vec3<f32>(0.0);
    var fms_total = vec3<f32>(0.0);

    let sample_count = 64;
    for (var i = 0; i < sample_count; i = i + 1) {
        let step = f32(i) + 0.5;
        let theta = acos(clamp(1.0 - 2.0 * step / f32(sample_count), -1.0, 1.0));
        let phi = (sqrt(5.0) + 1.0) * PI * step;
        let ray_dir = vec3<f32>(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));

        let t_max = get_ray_sphere_intersection(ray_origin, ray_dir, r + params.atmosphereHeight);

        // [KO] 지면 충돌 정보 확보
        let b_val = dot(ray_origin, ray_dir);
        let c_val = dot(ray_origin, ray_origin) - r * r;
        let delta_val = b_val * b_val - c_val;
        var t_earth_in = -1.0;
        var t_earth_out = -1.0;
        if (delta_val >= 0.0) {
            let s_val = sqrt(delta_val);
            t_earth_in = -b_val - s_val;
            t_earth_out = -b_val + s_val;
        }

        var L1 = vec3<f32>(0.0);
        var f1 = vec3<f32>(0.0);
        var T_path = vec3<f32>(1.0);

        let hit_earth = params.useGround > 0.5 && t_earth_in > 0.0;
        
        if (hit_earth) {
            // Segment 1: Camera to Earth
            let steps = 16u;
            let step_size = t_earth_in / f32(steps);
            for(var j = 0u; j < steps; j = j + 1u) {
                let t = (f32(j) + 0.5) * step_size;
                integrate_multi_scat_step(ray_origin + ray_dir * t, ray_dir, step_size, sun_dir, &L1, &f1, &T_path);
            }
            // Add ground reflection
            let hit_p = ray_origin + ray_dir * t_earth_in;
            let up_hit = normalize(hit_p);
            let cos_s = max(0.0, dot(up_hit, sun_dir));
            let sun_t_ground = get_physical_transmittance(hit_p, sun_dir, r, params.atmosphereHeight, params);
            L1 += T_path * sun_t_ground * cos_s * params.groundAlbedo * INV_PI;
        } else {
            // Hollow Shell Mode (useGround=false or looking at sky)
            if (params.useGround < 0.5 && t_earth_in > 0.0) {
                 // Segment 1: Front Atmosphere
                 let steps_f = 16u;
                 let step_size_f = t_earth_in / f32(steps_f);
                 for(var j = 0u; j < steps_f; j = j + 1u) {
                     let t = (f32(j) + 0.5) * step_size_f;
                     integrate_multi_scat_step(ray_origin + ray_dir * t, ray_dir, step_size_f, sun_dir, &L1, &f1, &T_path);
                 }
                 // Segment 2: Back Atmosphere
                 if (t_earth_out > 0.0 && t_max > t_earth_out) {
                     let steps_b = 16u;
                     let step_size_b = (t_max - t_earth_out) / f32(steps_b);
                     for(var j = 0u; j < steps_b; j = j + 1u) {
                         let t = t_earth_out + (f32(j) + 0.5) * step_size_b;
                         integrate_multi_scat_step(ray_origin + ray_dir * t, ray_dir, step_size_b, sun_dir, &L1, &f1, &T_path);
                     }
                 }
            } else if (t_max > 0.0) {
                 // Normal atmosphere to space
                 let steps = 20u;
                 let step_size = t_max / f32(steps);
                 for(var j = 0u; j < steps; j = j + 1u) {
                     let t = (f32(j) + 0.5) * step_size;
                     integrate_multi_scat_step(ray_origin + ray_dir * t, ray_dir, step_size, sun_dir, &L1, &f1, &T_path);
                 }
            }
        }
        lum_total += L1;
        fms_total += f1 / f32(sample_count);
    }

    let output = (lum_total / f32(sample_count)) / (1.0 - min(fms_total, vec3<f32>(0.999)));
    textureStore(multiScatTexture, global_id.xy, vec4<f32>(output, 1.0));
}

fn integrate_multi_scat_step(cur_p: vec3<f32>, ray_dir: vec3<f32>, step_size: f32, sun_dir: vec3<f32>, L1: ptr<function, vec3<f32>>, f1: ptr<function, vec3<f32>>, T_path: ptr<function, vec3<f32>>) {
    let r = params.earthRadius;
    let cur_p_len = length(cur_p);
    let up_p = cur_p / cur_p_len;
    let cur_h = cur_p_len - r;
    
    // [KO] 행성 내부(cur_h < 0)는 진공으로 처리하여 밀도를 0으로 설정합니다.
    var rho_r = 0.0;
    var rho_m = 0.0;
    if (cur_h >= 0.0) {
        rho_r = exp(-cur_h / params.rayleighScaleHeight);
        rho_m = exp(-cur_h / params.mieScaleHeight);
    }
    
    let sun_t = get_physical_transmittance(cur_p, sun_dir, r, params.atmosphereHeight, params);
    
    // 행성 그림자
    var shadow_mask = 1.0;
    if (params.useGround > 0.5 && get_ray_sphere_intersection(cur_p, sun_dir, r) > 0.0) { shadow_mask = 0.0; }

    let scat_total = params.rayleighScattering * rho_r + vec3<f32>(params.mieScattering * rho_m);
    let ext_total = params.rayleighScattering * rho_r + vec3<f32>(params.mieExtinction * rho_m);

    *L1 += *T_path * sun_t * scat_total * (0.25 * INV_PI) * shadow_mask * step_size;
    *f1 += *T_path * scat_total * step_size;
    *T_path *= exp(-ext_total * step_size);
}
