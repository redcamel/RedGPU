// [KO] 투과율(Transmittance) LUT 생성을 위한 Compute Shader

@group(0) @binding(0) var transmittanceTexture: texture_storage_2d<rgba16float, write>;

struct TransmittanceParameters {
    earthRadius: f32,
    atmosphereHeight: f32,
    mieExtinction: f32,
    rayleighScaleHeight: f32,

    mieScaleHeight: f32,
    ozoneLayerCenter: f32,
    ozoneLayerWidth: f32,
    padding0: f32,

    rayleighScattering: vec3<f32>,
    padding1: f32,

    ozoneAbsorption: vec3<f32>,
    padding2: f32,
};
@group(0) @binding(1) var<uniform> params: TransmittanceParameters;

fn earth_radius() -> f32 { return params.earthRadius; }
fn atmosphere_height() -> f32 { return params.atmosphereHeight; }
fn mie_extinction() -> f32 { return params.mieExtinction; }
fn rayleigh_scale_height() -> f32 { return params.rayleighScaleHeight; }

fn mie_scale_height() -> f32 { return params.mieScaleHeight; }
fn ozone_layer_center() -> f32 { return params.ozoneLayerCenter; }
fn ozone_layer_width() -> f32 { return params.ozoneLayerWidth; }

fn rayleigh_scattering() -> vec3<f32> { return params.rayleighScattering; }
fn ozone_absorption() -> vec3<f32> { return params.ozoneAbsorption; }

// [튜닝] exp(-tau) 언더플로우로 LUT가 까맣게 붙는 걸 완화(시각화/안정화용)
const MAX_TAU: f32 = 50.0;

// 가장 가까운 양의 교차 거리(없으면 -1)
fn ray_sphere_intersection_nearest(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }

    let s = sqrt(delta);
    let t0 = -b - s;
    let t1 = -b + s;

    if (t0 > 0.0) { return t0; }
    if (t1 > 0.0) { return t1; }
    return -1.0;
}

fn get_optical_depth(h: f32, cos_theta: f32) -> vec3<f32> {
    let r = earth_radius();
    let atmosphereRadius = r + atmosphere_height();
    let ray_origin = vec3<f32>(0.0, h + r, 0.0);

    // cos_theta에 따라 방향 벡터 생성
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
    let ray_dir = vec3<f32>(sin_theta, cos_theta, 0.0);

    // 지면과 충돌하면 광학 깊이를 최대값으로 리턴 (투과율 0)
    let t_earth = ray_sphere_intersection_nearest(ray_origin, ray_dir, r);
    if (t_earth > 0.0) { return vec3<f32>(MAX_TAU); }

    let t_max = ray_sphere_intersection_nearest(ray_origin, ray_dir, atmosphereRadius);
    if (t_max < 0.0) { return vec3<f32>(0.0); }

    let steps: i32 = 40;
    let step_size = t_max / f32(steps);

    var opt_r = 0.0;
    var opt_m = 0.0;
    var opt_o = 0.0;

    for (var i: i32 = 0; i < steps; i = i + 1) {
        let t = (f32(i) + 0.5) * step_size;
        let p = ray_origin + ray_dir * t;
        let height = length(p) - r;

        opt_r += exp(-max(0.0, height) / rayleigh_scale_height()) * step_size;
        opt_m += exp(-max(0.0, height) / mie_scale_height()) * step_size;

        let o_width = max(1e-3, ozone_layer_width());
        opt_o += max(0.0, 1.0 - abs(height - ozone_layer_center()) / o_width) * step_size;
    }

    return rayleigh_scattering() * opt_r
         + mie_extinction() * opt_m
         + ozone_absorption() * opt_o;
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(transmittanceTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);

    // [표준] v=0 -> h=0, v=1 -> h=H (제곱 매핑)
    let h = (uv.y * uv.y) * atmosphere_height();
    
    // [표준] u=0 -> cos=-1, u=1 -> cos=1
    let cos_theta = uv.x * 2.0 - 1.0;

    let tau3 = get_optical_depth(h, cos_theta);
    let T = exp(-min(tau3, vec3<f32>(MAX_TAU)));

    textureStore(transmittanceTexture, global_id.xy, vec4<f32>(T, 1.0));
}
