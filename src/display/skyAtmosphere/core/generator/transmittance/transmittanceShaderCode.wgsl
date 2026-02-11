// [KO] 투과율(Transmittance) LUT 생성을 위한 Compute Shader
@group(0) @binding(0) var transmittanceTexture: texture_storage_2d<rgba16float, write>;

struct AtmosphereParameters {
    earthRadius: f32,
    atmosphereHeight: f32,
    mieScattering: f32,
    mieExtinction: f32,
    rayleighScattering: vec3<f32>,
};
@group(0) @binding(1) var<uniform> params: AtmosphereParameters;

const PI: f32 = 3.14159265359;

fn get_ray_sphere_intersection(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    return -b + sqrt(delta);
}

fn get_optical_depth(h: f32, cos_theta: f32) -> vec3<f32> {
    let atmosphereRadius = params.earthRadius + params.atmosphereHeight;
    let ray_origin = vec3<f32>(0.0, h + params.earthRadius, 0.0);
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
    let ray_dir = vec3<f32>(sin_theta, cos_theta, 0.0);
    
    let t_max = get_ray_sphere_intersection(ray_origin, ray_dir, atmosphereRadius);
    if (t_max < 0.0) { return vec3<f32>(0.0); }
    
    let steps = 40;
    let step_size = t_max / f32(steps);
    var optical_depth_rayleigh = 0.0;
    var optical_depth_mie = 0.0;
    
    for (var i = 0; i < steps; i = i + 1) {
        let t = (f32(i) + 0.5) * step_size;
        let p = ray_origin + ray_dir * t;
        let height = length(p) - params.earthRadius;
        
        optical_depth_rayleigh += exp(-height / 8.0) * step_size;
        optical_depth_mie += exp(-height / 1.2) * step_size;
    }
    
    return params.rayleighScattering * optical_depth_rayleigh + params.mieExtinction * optical_depth_mie;
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(transmittanceTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }
    
    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let cos_theta = uv.x * 2.0 - 1.0;
    
    // [KO] uv.y = 1 이 지면(h=0), uv.y = 0 이 대기 끝(h=60)이 되도록 수정
    // [EN] Map uv.y = 1 to Ground (h=0), uv.y = 0 to Atmosphere Boundary (h=60)
    let h = (1.0 - uv.y) * params.atmosphereHeight;
    
    let optical_depth = get_optical_depth(h, cos_theta);
    let transmittance = exp(-optical_depth);
    
    textureStore(transmittanceTexture, global_id.xy, vec4<f32>(transmittance, 1.0));
}
