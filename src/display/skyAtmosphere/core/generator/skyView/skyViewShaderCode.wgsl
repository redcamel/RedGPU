// [KO] Sky-View LUT 생성을 위한 Compute Shader
@group(0) @binding(0) var skyViewTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var tSampler: sampler;

struct AtmosphereParameters {
    earthRadius: f32,
    atmosphereHeight: f32,
    mieScattering: f32,
    mieExtinction: f32,
    rayleighScattering: vec3<f32>,
    mieAnisotropy: f32,
    rayleighScaleHeight: f32,
    mieScaleHeight: f32,
    cameraHeight: f32,
    multiScatAmbient: f32,
    ozoneAbsorption: vec3<f32>,
    ozoneLayerCenter: f32,
    sunDirection: vec3<f32>,
    ozoneLayerWidth: f32,
};
@group(0) @binding(4) var<uniform> params: AtmosphereParameters;

const PI: f32 = 3.14159265359;

fn get_ray_sphere_intersection(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    let t = -b + sqrt(delta);
    return select(-1.0, t, t > 0.0);
}

fn get_transmittance(h: f32, cos_theta: f32) -> vec3<f32> {
    // [표준] Transmittance LUT 매핑 (v=sqrt(h/H), u=cos*0.5+0.5)
    let v = sqrt(clamp(h / params.atmosphereHeight, 0.0, 1.0));
    let u = clamp(cos_theta * 0.5 + 0.5, 0.0, 1.0);
    return textureSampleLevel(transmittanceTexture, tSampler, vec2<f32>(u, v), 0.0).rgb;
}

fn phase_rayleigh(cos_theta: f32) -> f32 {
    return 3.0 / (16.0 * PI) * (1.0 + cos_theta * cos_theta);
}

fn phase_mie(cos_theta: f32) -> f32 {
    let g = params.mieAnisotropy;
    let g2 = g * g;
    return 1.0 / (4.0 * PI) * ((1.0 - g2) / pow(max(0.001, 1.0 + g2 - 2.0 * g * cos_theta), 1.5));
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(skyViewTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let azimuth = (uv.x - 0.5) * 2.0 * PI;

    // [표준] UE 비선형 Elevation 매핑 (v=0:천정/Up, v=0.5:지평선, v=1:천저/Down)
    let v_coord = uv.y;
    var elevation: f32;
    if (v_coord <= 0.5) {
        let coord = 1.0 - v_coord * 2.0; // v=0 -> 1.0, v=0.5 -> 0.0
        elevation = (coord * coord) * (PI * 0.5);
    } else {
        let coord = (v_coord - 0.5) * 2.0; // v=0.5 -> 0.0, v=1 -> 1.0
        elevation = -(coord * coord) * (PI * 0.5);
    }

    let view_dir = vec3<f32>(cos(elevation) * cos(azimuth), sin(elevation), cos(elevation) * sin(azimuth));
    let r = params.earthRadius;
    let ray_origin = vec3<f32>(0.0, params.cameraHeight + r, 0.0);

    let t_max = get_ray_sphere_intersection(ray_origin, view_dir, r + params.atmosphereHeight);
    let t_earth = get_ray_sphere_intersection(ray_origin, view_dir, r);

    var dist_limit = t_max;
    if (t_earth > 0.0) { dist_limit = min(t_max, t_earth); }

    var luminance = vec3<f32>(0.0);
    var transmittance_to_camera = vec3<f32>(1.0);

    if (dist_limit > 0.0) {
        let steps = 32;
        let step_size = dist_limit / f32(steps);

        for (var i = 0; i < steps; i = i + 1) {
            let t = (f32(i) + 0.5) * step_size;
            let p = ray_origin + view_dir * t;
            let cur_h = length(p) - r;

            let cos_sun = params.sunDirection.y;
            let horizon_cosine = -sqrt(max(0.0, cur_h * (2.0 * r + cur_h))) / (r + cur_h);
            let light_fade = smoothstep(horizon_cosine - 0.1, horizon_cosine + 0.1, cos_sun);

            let sun_trans = get_transmittance(max(0.0, cur_h), cos_sun) * light_fade;

            var shadow_mask = 1.0;
            if (get_ray_sphere_intersection(p, params.sunDirection, r) > 0.0) { shadow_mask = 0.0; }
            shadow_mask = min(shadow_mask, light_fade);

            let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
            let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);

            let view_sun_cos = dot(view_dir, params.sunDirection);
            let phase_r = phase_rayleigh(view_sun_cos);
            let phase_m = phase_mie(view_sun_cos);

            let scat_r = params.rayleighScattering * rho_r * phase_r;
            let scat_m = params.mieScattering * rho_m * phase_m;
            let single_scat = (scat_r + scat_m) * sun_trans * shadow_mask;

            // Multi Scattering
            let multi_scat_uv = vec2<f32>(
                clamp(cos_sun * 0.5 + 0.5, 0.0, 1.0),
                sqrt(clamp(cur_h / params.atmosphereHeight, 0.0, 1.0))
            );
            let multi_scat_energy = textureSampleLevel(multiScatTexture, tSampler, multi_scat_uv, 0.0).rgb;
            let total_density = params.rayleighScattering * rho_r + params.mieScattering * rho_m;
            let multi_scat = multi_scat_energy * total_density * params.multiScatAmbient;

            let step_scat = single_scat + multi_scat;
            let ozone_density = max(0.0, 1.0 - abs(cur_h - params.ozoneLayerCenter) / params.ozoneLayerWidth);
            let extinction = params.rayleighScattering * rho_r + params.mieExtinction * rho_m + params.ozoneAbsorption * ozone_density;

            luminance += transmittance_to_camera * step_scat * step_size;
            transmittance_to_camera *= exp(-extinction * step_size);

            if (all(transmittance_to_camera < vec3<f32>(0.001))) { break; }
        }
    }

    textureStore(skyViewTexture, global_id.xy, vec4<f32>(luminance, 1.0));
}
