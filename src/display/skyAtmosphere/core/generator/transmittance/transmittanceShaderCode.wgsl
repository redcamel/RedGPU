// [KO] 투과율(Transmittance) LUT 생성을 위한 Compute Shader (최종 최적화)
@group(0) @binding(0) var transmittanceTexture: texture_storage_2d<rgba16float, write>;

// [KO] 키워드 없이 순서만으로 정렬을 맞춘 구조체
struct TransmittanceParameters {
    earthRadius: f32,
    atmosphereHeight: f32,
    mieExtinction: f32,
    rayleighScaleHeight: f32,
    
    mieScaleHeight: f32,
    dummy1: f32,
    dummy2: f32,
    dummy3: f32,

    rayleighScattering: vec3<f32>,
    dummy4: f32,

    ozoneAbsorption: vec3<f32>,
    dummy5: f32,
};
@group(0) @binding(1) var<uniform> params: TransmittanceParameters;

fn get_ray_sphere_intersection(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    let t = -b + sqrt(delta);
    return select(-1.0, t, t > 0.0);
}

fn get_optical_depth(h: f32, cos_theta: f32) -> vec3<f32> {
    let atmosphereRadius = params.earthRadius + params.atmosphereHeight;
    let ray_origin = vec3<f32>(0.0, h + params.earthRadius, 0.0);
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
    let ray_dir = vec3<f32>(sin_theta, cos_theta, 0.0);
    
    let t_earth = get_ray_sphere_intersection(ray_origin, ray_dir, params.earthRadius);
    if (t_earth > 0.0) { return vec3<f32>(1e20); }
    
    let t_max = get_ray_sphere_intersection(ray_origin, ray_dir, atmosphereRadius);
    if (t_max < 0.0) { return vec3<f32>(0.0); }
    
    let steps = 40;
    let step_size = t_max / f32(steps);
    var opt_r = 0.0;
    var opt_m = 0.0;
    var opt_o = 0.0;
    
    for (var i = 0; i < steps; i = i + 1) {
        let t = (f32(i) + 0.5) * step_size;
        let p = ray_origin + ray_dir * t;
        let height = length(p) - params.earthRadius;
        
        opt_r += exp(-max(0.0, height) / params.rayleighScaleHeight) * step_size;
        opt_m += exp(-max(0.0, height) / params.mieScaleHeight) * step_size;
        opt_o += max(0.0, 1.0 - abs(height - 25.0) / 15.0) * step_size;
    }
    
    return params.rayleighScattering * opt_r + params.mieExtinction * opt_m + params.ozoneAbsorption * opt_o;
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(transmittanceTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }
    
    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let cos_theta = uv.x * 2.0 - 1.0;
    let h = (1.0 - uv.y) * params.atmosphereHeight;
    
    textureStore(transmittanceTexture, global_id.xy, vec4<f32>(exp(-get_optical_depth(h, cos_theta)), 1.0));
}
