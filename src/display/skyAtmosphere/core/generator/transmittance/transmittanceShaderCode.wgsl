// [KO] UE5 표준 Transmittance LUT 생성

@group(0) @binding(0) var transmittanceTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var<uniform> params: AtmosphereParameters;

fn get_optical_depth(h: f32, cos_theta: f32) -> vec3<f32> {
    let r = params.earthRadius;
    let ray_origin = vec3<f32>(0.0, h + r, 0.0);
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
    let ray_dir = vec3<f32>(sin_theta, cos_theta, 0.0);

    let t_earth = get_ray_sphere_intersection(ray_origin, ray_dir, r);
    if (t_earth > 0.0) { return vec3<f32>(MAX_TAU); }

    let t_max = get_ray_sphere_intersection(ray_origin, ray_dir, r + params.atmosphereHeight);
    if (t_max < 0.0) { return vec3<f32>(0.0); }

    let steps = 40;
    let step_size = t_max / f32(steps);
    var opt_r = 0.0;
    var opt_m = 0.0;
    var opt_o = 0.0;

    for (var i = 0; i < steps; i = i + 1) {
        let t = (f32(i) + 0.5) * step_size;
        let cur_h = length(ray_origin + ray_dir * t) - r;
        opt_r += exp(-max(0.0, cur_h) / params.rayleighScaleHeight) * step_size;
        opt_m += exp(-max(0.0, cur_h) / params.mieScaleHeight) * step_size;
        opt_o += max(0.0, 1.0 - abs(cur_h - params.ozoneLayerCenter) / max(1e-3, params.ozoneLayerWidth)) * step_size;
    }

    return params.rayleighScattering * opt_r + params.mieExtinction * opt_m + params.ozoneAbsorption * opt_o;
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(transmittanceTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let cos_theta = uv.x * 2.0 - 1.0;
    let h = uv.y * params.atmosphereHeight;

    let T = exp(-min(get_optical_depth(h, cos_theta), vec3<f32>(MAX_TAU)));
    textureStore(transmittanceTexture, global_id.xy, vec4<f32>(T, 1.0));
}
