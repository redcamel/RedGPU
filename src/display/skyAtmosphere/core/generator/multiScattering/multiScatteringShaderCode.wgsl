// [KO] UE5 표준 Multi-Scattering LUT 생성

@group(0) @binding(0) var multiScatTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var tSampler: sampler;
@group(0) @binding(3) var<uniform> params: AtmosphereParameters;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(multiScatTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let cos_sun_theta = uv.x * 2.0 - 1.0;
    
    // [역매핑 보정] V = 1.0 - sqrt(h / H_atm) -> h = (1.0 - V)^2 * H_atm
    let ratio = (1.0 - uv.y) * (1.0 - uv.y);
    let h = ratio * params.atmosphereHeight;

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
        let dist_limit = select(t_max, t_earth, t_earth > 0.0);

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
                let sun_t = get_transmittance(transmittanceTexture, tSampler, cur_h, cos_s, params.atmosphereHeight);
                
                let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
                let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);
                let scat_total = params.rayleighScattering * rho_r + params.mieScattering * rho_m;
                let ext_total = params.rayleighScattering * rho_r + params.mieExtinction * rho_m;

                L1 += T_path * sun_t * scat_total * (1.0 / (4.0 * PI)) * step_size;
                f1 += T_path * scat_total * step_size;
                T_path *= exp(-ext_total * step_size);
            }

            if (t_earth > 0.0) {
                let hit_p = ray_origin + ray_dir * t_earth;
                let cos_s = max(0.0, dot(normalize(hit_p), sun_dir));
                L1 += T_path * get_transmittance(transmittanceTexture, tSampler, 0.0, cos_s, params.atmosphereHeight) * cos_s * params.groundAlbedo / PI;
            }
            lum_total += L1;
            fms_total += f1 / f32(sample_count);
        }
    }

    let output = (lum_total / f32(sample_count)) / (1.0 - min(fms_total, vec3<f32>(0.999)));
    textureStore(multiScatTexture, global_id.xy, vec4<f32>(output, 1.0));
}
