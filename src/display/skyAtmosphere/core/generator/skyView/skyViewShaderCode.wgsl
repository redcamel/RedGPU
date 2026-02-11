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
    dummy1: f32,
    ozoneAbsorption: vec3<f32>,
    dummy2: f32,
    sunDirection: vec3<f32>,
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
    let uv = vec2<f32>((cos_theta + 1.0) * 0.5, 1.0 - (h / params.atmosphereHeight));
    return textureSampleLevel(transmittanceTexture, tSampler, uv, 0.0).rgb;
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
    
    // [KO] 비선형 매핑 적용 (지평선 부근 정밀도)
    let v = uv.y;
    var elevation: f32;
    if (v < 0.5) {
        let coord = 1.0 - v * 2.0;
        elevation = (coord * coord) * (PI * 0.5);
    } else {
        let coord = (v - 0.5) * 2.0;
        elevation = -(coord * coord) * (PI * 0.5);
    }
    
    let view_dir = vec3<f32>(cos(elevation) * cos(azimuth), sin(elevation), cos(elevation) * sin(azimuth));
    let h = params.cameraHeight; 
    let ray_origin = vec3<f32>(0.0, h + params.earthRadius, 0.0);
    
    let t_max = get_ray_sphere_intersection(ray_origin, view_dir, params.earthRadius + params.atmosphereHeight);
    let t_earth = get_ray_sphere_intersection(ray_origin, view_dir, params.earthRadius);
    var dist_limit = t_max;
    if (t_earth > 0.0) { dist_limit = min(t_max, t_earth); }

    var luminance = vec3<f32>(0.0);
    var transmittance_to_camera = vec3<f32>(1.0);
    
    if (dist_limit > 0.0) {
        let steps = 40;
        let step_size = dist_limit / f32(steps);
        for (var i = 0; i < steps; i = i + 1) {
            let t = (f32(i) + 0.5) * step_size;
            let p = ray_origin + view_dir * t;
            let cur_h = length(p) - params.earthRadius;
            let cos_sun = dot(normalize(p), params.sunDirection);
            
            let sun_trans = get_transmittance(max(0.0, cur_h), cos_sun);
            let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
            let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);
            
            let view_sun_cos = dot(view_dir, params.sunDirection);
            let scat_r = params.rayleighScattering * rho_r * phase_rayleigh(view_sun_cos);
            let scat_m = params.mieScattering * rho_m * phase_mie(view_sun_cos);
            
            let multi_scat = textureSampleLevel(multiScatTexture, tSampler, vec2<f32>(cos_sun * 0.5 + 0.5, 1.0 - (max(0.0, cur_h) / params.atmosphereHeight)), 0.0).rgb;
            
            let step_scat = (scat_r + scat_m) * sun_trans + multi_scat * (scat_r + scat_m);
            let total_extinction = params.rayleighScattering * rho_r + params.mieExtinction * rho_m + params.ozoneAbsorption * max(0.0, 1.0 - abs(cur_h - 25.0) / 15.0);
            
            luminance += transmittance_to_camera * step_scat * step_size;
            transmittance_to_camera *= exp(-total_extinction * step_size);
        }
    }
    textureStore(skyViewTexture, global_id.xy, vec4<f32>(luminance, 1.0));
}
