// [KO] 투과율(Transmittance) LUT 생성을 위한 Compute Shader

@group(0) @binding(0) var transmittanceTexture: texture_storage_2d<rgba16float, write>;

struct TransmittanceParametersPacked {
    p0: vec4<f32>, // (earthRadius, atmosphereHeight, mieExtinction, rayleighScaleHeight)
    p1: vec4<f32>, // (mieScaleHeight, ozoneLayerCenter, ozoneLayerWidth, reserved)
    p2: vec4<f32>, // (rayleighScattering.rgb, reserved)
    p3: vec4<f32>, // (ozoneAbsorption.rgb, reserved)
};
@group(0) @binding(1) var<uniform> params: TransmittanceParametersPacked;

fn earth_radius() -> f32 { return params.p0.x; }
fn atmosphere_height() -> f32 { return params.p0.y; }
fn mie_extinction() -> f32 { return params.p0.z; }
fn rayleigh_scale_height() -> f32 { return params.p0.w; }

fn mie_scale_height() -> f32 { return params.p1.x; }
fn ozone_layer_center() -> f32 { return params.p1.y; }
fn ozone_layer_width() -> f32 { return params.p1.z; }

fn rayleigh_scattering() -> vec3<f32> { return params.p2.xyz; }
fn ozone_absorption() -> vec3<f32> { return params.p3.xyz; }

// [튜닝] 수평선(μ≈0)에서 광학깊이가 과도해져 0에 붙는 걸 완화하기 위한 최소 μ
const MIN_MU: f32 = 1e-2;

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
    let atmosphereRadius = earth_radius() + atmosphere_height();
    let ray_origin = vec3<f32>(0.0, h + earth_radius(), 0.0);

    // cos_theta는 [0..1] 상향 반구. 수평선 특이점 완화를 위해 MIN_MU 적용.
    let mu = max(clamp(cos_theta, 0.0, 1.0), MIN_MU);
    let sin_theta = sqrt(max(0.0, 1.0 - mu * mu));
    let ray_dir = vec3<f32>(sin_theta, mu, 0.0);

    let t_earth = ray_sphere_intersection_nearest(ray_origin, ray_dir, earth_radius());
    if (t_earth > 0.0) { return vec3<f32>(1e20); }

    let t_max = ray_sphere_intersection_nearest(ray_origin, ray_dir, atmosphereRadius);
    if (t_max < 0.0) { return vec3<f32>(0.0); }

    let steps: i32 = 48;
    let step_size = t_max / f32(steps);

    var opt_r = 0.0;
    var opt_m = 0.0;
    var opt_o = 0.0;

    for (var i: i32 = 0; i < steps; i = i + 1) {
        let t = (f32(i) + 0.5) * step_size;
        let p = ray_origin + ray_dir * t;
        let height = length(p) - earth_radius();

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

    // [개선] 지표 근처(아래쪽)에 해상도를 더 주기 위해 비선형 높이 매핑 사용
    // uv.y=1(아래) => h=0, uv.y=0(위) => h=H 는 유지
    let y = 1.0 - uv.y;
    let h = (y * y) * atmosphere_height();

    // [개선] μ는 0..1이지만 너무 0에 붙으면 τ가 급증하므로 MIN_MU~1로 리맵
    let cos_theta = mix(MIN_MU, 1.0, uv.x);

    let tau3 = get_optical_depth(h, cos_theta);

    // [개선] exp 언더플로우 방지(시각화/안정화용)
    let tau_clamped = min(tau3, vec3<f32>(MAX_TAU));
    let T = exp(-tau_clamped);

    textureStore(transmittanceTexture, global_id.xy, vec4<f32>(T, 1.0));
}