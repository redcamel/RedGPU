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
    let g = 0.8;
    let g2 = g * g;
    return 1.0 / (4.0 * PI) * ((1.0 - g2) / pow(1.0 + g2 - 2.0 * g * cos_theta, 1.5));
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(skyViewTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }
    
    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let azimuth = (uv.x - 0.5) * 2.0 * PI;
    let elevation = (0.5 - uv.y) * PI; 
    
    let view_dir = vec3<f32>(
        cos(elevation) * cos(azimuth),
        sin(elevation),
        cos(elevation) * sin(azimuth)
    );
    
    let h = 0.2; 
    let ray_origin = vec3<f32>(0.0, h + params.earthRadius, 0.0);
    let atmosphereRadius = params.earthRadius + params.atmosphereHeight;
    
    let t_max = get_ray_sphere_intersection(ray_origin, view_dir, atmosphereRadius);
    let t_earth = get_ray_sphere_intersection(ray_origin, view_dir, params.earthRadius);
    
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
            let current_h = length(p) - params.earthRadius;
            let up_at_p = normalize(p);
            
            let cos_sun = dot(up_at_p, params.sunDirection);
            let sun_transmittance = get_transmittance(current_h, cos_sun);
            
            let rho_rayleigh = exp(-max(0.0, current_h) / 8.0);
            let rho_mie = exp(-max(0.0, current_h) / 1.2);
            
            let view_sun_cos = dot(view_dir, params.sunDirection);
            let scat_rayleigh = params.rayleighScattering * rho_rayleigh * phase_rayleigh(view_sun_cos);
            let scat_mie = params.mieScattering * rho_mie * phase_mie(view_sun_cos);
            
            let multi_scat = textureSampleLevel(multiScatTexture, tSampler, vec2<f32>(cos_sun * 0.5 + 0.5, 1.0 - (max(0.0, current_h) / params.atmosphereHeight)), 0.0).rgb;
            
            // [KO] 임의의 보정값 없이 순수 산란 합산
            let step_scat = (scat_rayleigh + scat_mie) * sun_transmittance;
            let total_scat = step_scat + multi_scat * (scat_rayleigh + scat_mie);
            
            let step_transmittance = exp(-(params.rayleighScattering * rho_rayleigh + params.mieExtinction * rho_mie) * step_size);
            
            luminance += transmittance_to_camera * total_scat * step_size;
            transmittance_to_camera *= step_transmittance;
        }
    }
    
    // [KO] 지면 Ambient 제거
    textureStore(skyViewTexture, global_id.xy, vec4<f32>(luminance, 1.0));
}
