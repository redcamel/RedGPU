// [KO] 다중 산란(Multi-Scattering) 에너지 보정 LUT 생성을 위한 Compute Shader

@group(0) @binding(0) var multiScatTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var tSampler: sampler;
@group(0) @binding(3) var<uniform> params: AtmosphereParameters;

fn get_transmittance(h: f32, cos_theta: f32) -> vec3<f32> {
    let uv = get_transmittance_uv(h, cos_theta, params.atmosphereHeight);
    return textureSampleLevel(transmittanceTexture, tSampler, uv, 0.0).rgb;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(multiScatTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let cos_sun_theta = uv.x * 2.0 - 1.0;
    let h = (uv.y * uv.y) * params.atmosphereHeight;

    let r = params.earthRadius;
    let ray_origin = vec3<f32>(0.0, h + r, 0.0);
    let sun_dir = vec3<f32>(sqrt(max(0.0, 1.0 - cos_sun_theta * cos_sun_theta)), cos_sun_theta, 0.0);

    var lum_total = vec3<f32>(0.0);
    var fms_total = vec3<f32>(0.0);

    let sample_count = 64;
    for (var i = 0; i < sample_count; i = i + 1) {
        let step = f32(i) + 0.5;
        let theta = acos(1.0 - 2.0 * step / f32(sample_count));
        let phi = (sqrt(5.0) + 1.0) * PI * step;
        let ray_dir = vec3<f32>(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));

        let t_max = get_ray_sphere_intersection(ray_origin, ray_dir, r + params.atmosphereHeight);
        let t_earth = get_ray_sphere_intersection(ray_origin, ray_dir, r);

        var dist_limit = t_max;
        var hit_ground = false;
        if (t_earth > 0.0) {
            dist_limit = t_earth;
            hit_ground = true;
        }

        if (dist_limit > 0.0) {
            let steps = 20;
            let step_size = dist_limit / f32(steps);
            var L1 = vec3<f32>(0.0);
            var f1 = vec3<f32>(0.0);
            var T_path = vec3<f32>(1.0);

            for(var j = 0; j < steps; j = j + 1) {
                let t = (f32(j) + 0.5) * step_size;
                let cur_p = ray_origin + ray_dir * t;
                let cur_h = length(cur_p) - r;
                let cos_s = dot(normalize(cur_p), sun_dir);
                let sun_t = get_transmittance(cur_h, cos_s);
                
                let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
                let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);
                let scat_total = params.rayleighScattering * rho_r + params.mieScattering * rho_m;
                let ext_total = params.rayleighScattering * rho_r + params.mieExtinction * rho_m;

                let phase = 1.0 / (4.0 * PI);
                L1 += T_path * sun_t * scat_total * phase * step_size;
                f1 += T_path * scat_total * step_size;
                T_path *= exp(-ext_total * step_size);
            }

            if (hit_ground) {
                let hit_p = ray_origin + ray_dir * dist_limit;
                let ground_n = normalize(hit_p);
                let cos_s = max(0.0, dot(ground_n, sun_dir));
                let sun_t = get_transmittance(0.0, cos_s);
                L1 += T_path * sun_t * cos_s * params.groundAlbedo / PI;
            }

            lum_total += L1;
            fms_total += f1 / f32(sample_count);
        }
    }

    let L2 = lum_total / f32(sample_count);
    let output = L2 / (1.0 - min(fms_total, vec3<f32>(0.999)));
    textureStore(multiScatTexture, global_id.xy, vec4<f32>(output, 1.0));
}
