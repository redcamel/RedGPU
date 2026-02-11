// [KO] 다중 산란(Multi-Scattering) LUT 생성을 위한 Compute Shader
@group(0) @binding(0) var multiScatTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var tSampler: sampler;

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
};
@group(0) @binding(3) var<uniform> params: AtmosphereParameters;

const PI: f32 = 3.14159265359;

fn get_ray_sphere_intersection(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    return -b + sqrt(delta);
}

fn get_transmittance(h: f32, cos_theta: f32) -> vec3<f32> {
    let uv = vec2<f32>((cos_theta + 1.0) * 0.5, 1.0 - (h / params.atmosphereHeight));
    return textureSampleLevel(transmittanceTexture, tSampler, uv, 0.0).rgb;
}

@compute @workgroup_size(1, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(multiScatTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }
    
    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let cos_sun_theta = uv.x * 2.0 - 1.0;
    let h = (1.0 - uv.y) * params.atmosphereHeight;
    
    var multi_scat_as_vector = vec3<f32>(0.0);
    let sample_count = 64;
    for (var i = 0; i < sample_count; i = i + 1) {
        let step = f32(i) + 0.5;
        let theta = acos(1.0 - 2.0 * step / f32(sample_count));
        let phi = (sqrt(5.0) + 1.0) * PI * step;
        
        let ray_dir = vec3<f32>(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));
        let ray_cos_theta = ray_dir.y;
        
        let atmosphereRadius = params.earthRadius + params.atmosphereHeight;
        let ray_origin = vec3<f32>(0.0, h + params.earthRadius, 0.0);
        let t_max = get_ray_sphere_intersection(ray_origin, ray_dir, atmosphereRadius);
        
        if (t_max > 0.0) {
            let transmittance = get_transmittance(h, ray_cos_theta);
            let height_factor = exp(-h / params.rayleighScaleHeight);
            multi_scat_as_vector += (1.0 - transmittance) * height_factor;
        }
    }
    
    multi_scat_as_vector /= f32(sample_count);
    textureStore(multiScatTexture, global_id.xy, vec4<f32>(multi_scat_as_vector, 1.0));
}
